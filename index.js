import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

/**
 * Stylizes a markdown body into an appropriate embed message style.
 *  Remove HTML comments (commonly added by 'Generate release notes' button)
 *  Redundant whitespace and newlines removed, keeping at max 2 to provide space between paragraphs.
 *  Trim leading/trailing whitespace
 *  If reduce_headings:
 *   H3s converted to bold and underlined.
 *   H2s converted to bold.
 * @param description
 * @returns {*}
 */
const formatDescription = (description) => {
    let edit = description
        .replace(/<!--.*?-->/g, '')
        .replace(
            new RegExp(
                "https://github.com/(.+)/(.+)/(issues|pull|compare)/(\\S+)",
                "g"
            ),
            (match, user, repo, type, id) => {
                return `[${getUrlPrefix(type) + id}](${match})`;
            }
        )
        .replace(/\n\s*\n/g, (ws) => {
            const nlCount = (ws.match(/\n/g) || []).length
            return nlCount >= 2 ? '\n\n' : '\n'
        })
        .trim()

    if (core.getBooleanInput('reduce_headings')) {
        edit = edit
            .replace(/^### (.*?)$/gm, '**__$1__**')
            .replace(/^## (.*?)$/gm, '**$1**')
    }

    return edit
}

/**
 * Get a prefix to use for Github link display
 * @param {'issues' | 'pull' | 'compare'} type 
 */
function getUrlPrefix (type) {
    switch (type) {
        case 'issues':
            return 'Issue #'
        case 'pull':
            return 'PR #'
        case 'compare':
            return ''
        default:
            return '#'
    }
}

/**
 * Gets the max description length if set to a valid number,
 * otherwise the default of 1500
 * @returns {number}
 */
function getMaxDescription () {
    try {
        const max = core.getInput('max_description')
        if (typeof max === 'string' && max.length) {
            // https://discord.com/developers/docs/resources/channel#embed-object-embed-limits
            // 4096 is max for Embed Description, minus 500 to allow for elipsis and link
            return Math.min(parseInt(max, 10), 4096 - 500)
        }
    } catch (err) {
        core.warning(`max_description not a valid number: ${err}`)
    }
    return 1500
}

/**
 * Get the context of the action, returns a GitHub Release payload.
 * @returns {Promise<{html_url, body: (*|string), name: string}>}
 */
async function getContext () {
    const payload = github.context.payload;
    const maxDesc = getMaxDescription()

    return {
        body: payload.release.body.length < maxDesc
            ? payload.release.body
            : payload.release.body.substring(0, maxDesc) + ` ([...](${payload.release.html_url}))`,
        name: payload.release.name,
        html_url: payload.release.html_url
    }
}

/**
 * Handles the action.
 * Get inputs, creates a stylized response webhook, and sends it to the channel.
 * @returns {Promise<void>}
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

    const {body, html_url, name} = await getContext();

    const description = formatDescription(body);

    let embedMsg = {
        title: name,
        url: html_url,
        color: color,
        description: description,
        footer: {}
    }

    if (footerTitle != '') embedMsg.footer.text = footerTitle;
    if (footerIconUrl != '') embedMsg.footer.icon_url = footerIconUrl;
    if (footerTimestamp == 'true') embedMsg.timestamp = new Date().toISOString();

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