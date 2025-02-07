import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

/**
 * Removes carriage return characters.
 * @param {string} text The input text.
 * @returns {string} The text without carriage return characters.
 */
const removeCarriageReturn = (text) => text.replace(/\r/g, '');

/**
 * Removes HTML comments.
 * @param {string} text The input text.
 * @returns {string} The text without HTML comments.
 */
const removeHTMLComments = (text) => text.replace(/<!--.*?-->/gs, '');

/**
 * Reduces redundant newlines and spaces.
 * Keeps a maximum of 2 newlines to provide spacing between paragraphs.
 * @param {string} text The input text.
 * @returns {string} The text with reduced newlines.
 */
const reduceNewlines = (text) => text.replace(/\n\s*\n/g, (ws) => {
    const nlCount = (ws.match(/\n/g) || []).length;
    return nlCount >= 2 ? '\n\n' : '\n';
});

/**
 * Converts @mentions to GitHub profile links for valid GitHub usernames.
 * @param {string} text The input text.
 * @returns {string} The text with valid @mentions converted to links.
 */
const convertMentionsToLinks = (text) => text.replace(
    /(?<![/@\w])@((?!-)(?!.*?--)[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,37})(?![.\w/-])(?!.*\])/g,
    (match, name) => `[@${name}](https://github.com/${name})`
);

/**
 * Reduces headings to a smaller format if 'reduce_headings' is enabled.
 * Converts H3 to bold+underline, H2 to bold.
 * @param {string} text The input text.
 * @returns {string} The text with reduced heading sizes.
 */
const reduceHeadings = (text) => text
    .replace(/^###\s+(.+)$/gm, '**__$1__**') // Convert H3 to bold + underline
    .replace(/^##\s+(.+)$/gm, '**$1**');     // Convert H2 to bold

/**
 * Converts PR, issue, and changelog links to markdown format, ignoring existing markdown links.
 * - PR links: `https://github.com/OWNER/REPO/pull/1` -> `[PR #1](https://github.com/OWNER/REPO/pull/1)`
 * - Issue links: `https://github.com/OWNER/REPO/issues/1` -> `[Issue #30](https://github.com/OWNER/REPO/issues/1)`
 * - Changelog links: `https://github.com/OWNER/REPO/compare/v1.0.0...v1.1.0` -> `[v1.0.0...v1.1.0](https://github.com/OWNER/REPO/compare/v1.0.0...v1.1.0)`
 * @param {string} text The input text.
 * @returns {string} The text with links converted to markdown format.
 */
const convertLinksToMarkdown = (text) => {
    // Extract existing markdown links and replace them with placeholders
    const markdownLinks = [];
    const textWithoutMarkdownLinks = text.replace(/\[.*?\]\(.*?\)/g, (link) => {
        markdownLinks.push(link);
        return `__MARKDOWN_LINK_PLACEHOLDER_${markdownLinks.length - 1}__`;
    });

    // Convert standalone PR, issue, and changelog URLs to markdown format
    let processedText = textWithoutMarkdownLinks
        .replace(/https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/pull\/(\d+)/g, (match, owner, repo, prNumber) => `[PR #${prNumber}](${match})`)
        .replace(/https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/issues\/(\d+)/g, (match, owner, repo, issueNumber) => `[Issue #${issueNumber}](${match})`)
        .replace(/https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/compare\/([v\w.-]+)\.\.\.([v\w.-]+)/g, (match, owner, repo, fromVersion, toVersion) => `[${fromVersion}...${toVersion}](${match})`);

    // Reinsert the original markdown links
    return processedText.replace(/__MARKDOWN_LINK_PLACEHOLDER_(\d+)__/g, (match, index) => markdownLinks[parseInt(index, 10)]);
};

/**
 * Stylizes a markdown body into an appropriate embed message style.
 * @param {string} description The description to format.
 * @returns {string} The formatted description.
 */
const formatDescription = (description) => {
    let edit = removeCarriageReturn(description);
    edit = removeHTMLComments(edit);
    edit = reduceNewlines(edit);
    edit = convertMentionsToLinks(edit);
    edit = convertLinksToMarkdown(edit);
    edit = edit.trim();

    if (core.getBooleanInput('reduce_headings')) {
        edit = reduceHeadings(edit);
    }

    return edit;
};

/**
 * Gets the max description length, defaulting to 4096 if not set or invalid.
 * @returns {number} The max description length.
 */
const getMaxDescription = () => {
    try {
        const max = core.getInput('max_description');
        if (max && !isNaN(max)) {
            return Math.min(parseInt(max, 10), 4096);
        }
    } catch (err) {
        core.warning(`Invalid max_description: ${err}`);
    }
    return 4096;
};

/**
 * Get the context of the action, returning a GitHub Release payload.
 * @returns {object} The context with release details.
 */
const getContext = () => {
    const { release } = github.context.payload;
    return {
        body: release.body,
        name: release.name,
        html_url: release.html_url
    };
};

/**
 * Limits the string to a maximum length, optionally adding a URL or clipping at a newline.
 * @param {string} str The string to limit.
 * @param {number} maxLength The maximum allowed length.
 * @param {string} [url] Optional URL for linking the truncated text.
 * @param {boolean} [clipAtLine=false] Whether to clip at the nearest newline.
 * @returns {string} The limited string.
 */
const limitString = (str, maxLength, url, clipAtLine = false) => {
    if (str.length <= maxLength) return str;

    const replacement = url
        ? `${clipAtLine ? '\n' : ''}([…](${url}))`
        : (clipAtLine ? '\n…' : '…');

    maxLength -= replacement.length;
    str = str.substring(0, maxLength);

    const lastNewline = str.search(new RegExp(`[^${clipAtLine ? '\n' : '\s'}]*$`));
    if (lastNewline > -1) {
        str = str.substring(0, lastNewline);
    }

    return str + replacement;
};

/**
 * Builds the embed message for the Discord webhook.
 * @param {string} name The title or name of the release.
 * @param {string} html_url The URL of the release.
 * @param {string} description The formatted description of the release.
 * @returns {object} The embed message to send in the webhook.
 */
const buildEmbedMessage = (name, html_url, description) => {
    const embedMsg = {
        title: limitString(name, 256),
        url: html_url,
        color: core.getInput('color'),
        description: limitString(description, Math.min(getMaxDescription(), 6000 - name.length)),
        footer: {}
    };

    if (core.getInput('custom_html_url')) {
        embedMsg.html_url = core.getInput('custom_html_url');
    }

    if (core.getInput('footer_title')) {
        embedMsg.footer.text = limitString(core.getInput('footer_title'), 2048);
    }
    if (core.getInput('footer_icon_url')) {
        embedMsg.footer.icon_url = core.getInput('footer_icon_url');
    }
    if (core.getInput('footer_timestamp') === 'true') {
        embedMsg.timestamp = new Date().toISOString();
    }

    return embedMsg;
};

/**
 * Sends the webhook request to Discord.
 * @param {string} webhookUrl The URL of the Discord webhook.
 * @param {object} requestBody The payload to send in the webhook.
 */
const sendWebhook = async (webhookUrl, requestBody) => {
    try {
        const response = await fetch(`${webhookUrl}?wait=true`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        core.info(JSON.stringify(data));
    } catch (err) {
        core.setFailed(err.message);
    }
};

/**
 * Builds the request body for the Discord webhook.
 * @param {object} embedMsg The embed message to include in the request body.
 * @returns {object} The request body for the webhook.
 */
const buildRequestBody = (embedMsg) => {
    return {
        embeds: [embedMsg],
        ...(core.getInput('username') && { username: core.getInput('username') }),
        ...(core.getInput('avatar_url') && { avatar_url: core.getInput('avatar_url') }),
        ...(core.getInput('content') && { content: core.getInput('content') })
    };
};


/**
 * Main function to handle the action: get inputs, format the message, and send the webhook.
 */
const run = async () => {
    const webhookUrl = core.getInput('webhook_url');
    if (!webhookUrl) return core.setFailed('webhook_url not set.');

    const { body, html_url, name } = getContext();
    const description = formatDescription(body);

    const embedMsg = buildEmbedMessage(name, html_url, description);

    const requestBody = buildRequestBody(embedMsg);

    await sendWebhook(webhookUrl, requestBody);
};

run()
    .then(() => core.info('Action completed successfully'))
    .catch(err => core.setFailed(err.message));
