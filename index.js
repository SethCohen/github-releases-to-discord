import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

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
        const color = core.getInput('color')
        const username = core.getInput('username')
        const avatarUrl = core.getInput('avatar_url')

        if (!webhookUrl) {
            return core.setFailed('webhook_url not set. Please set it.')
        }

        const {body, html_url, version} = await getContext()

        const description = body
            .replace(/### (.*?)\n/g,function (substring) {
                const newString = substring.slice(4).replace(/(\r\n|\n|\r)/gm, "")
                return `**__${newString}__**`
            })
            .replace(/## (.*?)\n/g,function (substring) {
                const newString = substring.slice(3).replace(/(\r\n|\n|\r)/gm, "")
                return `**${newString}**`
            })
            .replace(/\n\s*\n/g, '\n')

        const embedMsg = {
            title: `Release ${version}`,
            url: html_url,
            color: color,
            description: description,
        }

        const requestBody = { username: username, avatar_url: avatarUrl, embeds: [embedMsg], }

        const url = `${webhookUrl}?wait=true`

        fetch(url, {
            method: 'post',
            body: JSON.stringify(requestBody),
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