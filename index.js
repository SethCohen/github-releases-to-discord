import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

/**
 * Stylizes a markdown body into an appropriate embed message style.
 *  Remove Carriage Return character to reduce size
 *  Remove HTML comments (commonly added by 'Generate release notes' button)
 *  Better URL linking for common Github links: PRs, Issues, Compare
 *  Redundant whitespace and newlines removed, keeping at max 2 to provide space between paragraphs
 *  Trim leading/trailing whitespace
 *  If reduce_headings:
 *   H3s converted to bold and underlined
 *   H2s converted to bold
 * @param {string} description
 */
const formatDescription = (description) => {
    let edit = description
        .replace(/\r/g, '')
        .replace(/<!--.*?-->/gs, '')
        .replace(
            new RegExp(
                "https://github.com/(.+)/(.+)/(issues|pull|commit|compare)/(\\S+)",
                "g"
            ),
            (match, user, repo, type, id) => {
                return `[${getTypePrefix(type) + id}](${match})`
            }
        )
        .replace(/\n\s*\n/g, (ws) => {
            const nlCount = (ws.match(/\n/g) || []).length
            return nlCount >= 2 ? '\n\n' : '\n'
        })
        .trim()

    if (core.getBooleanInput('reduce_headings')) {
        edit = edit
            .replace(/^###\s+(.+)$/gm, '**__$1__**')
            .replace(/^##\s+(.+)$/gm, '**$1**')
    }

    return edit
}

/**
 * Get a prefix to use for Github link display
 * @param {'issues' | 'pull' | 'commit' | 'compare'} type 
 */
function getTypePrefix (type) {
    switch (type) {
        case 'issues':
            return 'Issue #'
        case 'pull':
            return 'PR #'
        case 'commit':
            return 'Commit #'
        case 'compare':
            return ''
        default:
            return '#'
    }
}

/**
 * Gets the max description length if set to a valid number,
 * otherwise the default of 4096
 */
function getMaxDescription () {
    try {
        const max = core.getInput('max_description')
        if (typeof max === 'string' && max.length) {
            // 4096 is max for Embed Description
            // https://discord.com/developers/docs/resources/channel#embed-object-embed-limits
            return Math.min(parseInt(max, 10), 4096)
        }
    } catch (err) {
        core.warning(`max_description not a valid number: ${err}`)
    }
    return 4096
}

/**
 * Get the context of the action, returns a GitHub Release payload.
 */
function getContext () {
    const payload = github.context.payload;

    return {
        body: payload.release.body,
        name: payload.release.name,
        html_url: payload.release.html_url
    }
}

/**
 * 
 * @param {string} str
 * @param {number} maxLength
 * @param {string} [url]
 * @param {boolean} [clipAtLine=false] 
 */
function limit(str, maxLength, url, clipAtLine) {
    clipAtLine ??= false
    if (str.length <= maxLength)
        return str
    let replacement = clipAtLine ? '\n…' : '…'
    if (url) {
        replacement = `${clipAtLine ? '\n' : ''}([…](${url}))`
    }
    maxLength = maxLength - replacement.length
    str = str.substring(0, maxLength)

    const lastNewline = str.search(new RegExp(`[^${clipAtLine ? '\n' : '\s'}]*$`))
    if (lastNewline > -1) {
        str = str.substring(0, lastNewline)
    }

    return str + replacement
}

/**
 * Handles the action.
 * Get inputs, creates a stylized response webhook, and sends it to the channel.
 */
async function run () {
    const webhookUrl = core.getInput('webhook_url');
    const color = core.getInput('color');
    const username = core.getInput('username');
    const avatarUrl = core.getInput('avatar_url');
    const content = core.getInput('content');
    const footerTitle = core.getInput('footer_title');
    const footerIconUrl = core.getInput('footer_icon_url');
    const footerTimestamp = core.getInput('footer_timestamp');

    if (!webhookUrl) return core.setFailed('webhook_url not set. Please set it.');

    const {body, html_url, name} = getContext();

    const description = formatDescription(body);

    let embedMsg = {
        title: limit(name, 256),
        url: html_url,
        color: color,
        description: description,
        footer: {}
    }

    if (footerTitle != '') embedMsg.footer.text = limit(footerTitle, 2048);
    if (footerIconUrl != '') embedMsg.footer.icon_url = footerIconUrl;
    if (footerTimestamp == 'true') embedMsg.timestamp = new Date().toISOString();

    let embedSize = embedMsg.title.length + (embedMsg.footer?.text?.length ?? 0)
    embedMsg.description = limit(embedMsg.description, Math.min(getMaxDescription(), 6000 - embedSize), embedMsg.url, true)

    let requestBody = {
        embeds: [embedMsg]
    }

    if (username != '') requestBody.username = username;
    if (avatarUrl != '') requestBody.avatar_url = avatarUrl;
    if (content != '') requestBody.content = content;

    const url = `${webhookUrl}?wait=true`;
    fetch(url, {
        method: 'post',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => core.info(JSON.stringify(data)))
        .catch(err => core.info(err))
}

run()
    .then(() => {core.info('Action completed successfully')})
    .catch(err => {core.setFailed(err.message)})