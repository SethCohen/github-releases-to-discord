const core = require('@actions/core');
const github = require('@actions/github');

const fetch = require('node-fetch')

async function getContext () {
    const payload = github.context.payload

    return {
        body: payload.release.body.length < 1500
            ? payload.release.body
            : payload.release.body.substring(0, 1500) + ` ([...](${payload.release.html_url}))`,
        version: payload.release.tag_name,
        html_url: payload.release.html_url
    }
}

async function run () {
    try {
        const webhookUrl = core.getInput('webhook_url')

        if (!webhookUrl) {
            return core.setFailed('webhook_url not set. Please set it.')
        }

        const content = await getContext()

        const embedMsg = {
            color: 3447003,
            title: `Release ${content.version}`,
            description: content.body,
            url: content.html_url
        }

        const body = { embeds: [embedMsg] }

        const url = `${webhookUrl}?wait=true`

        fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => core.info(JSON.stringify(data)))
            .catch(err => core.info(err))
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()