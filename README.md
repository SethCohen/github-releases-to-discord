# GitHub Releases To Discord Action
A GitHub action that parses a GitHub release and posts it to a Discord channel as a stylized Discord webhook.

---
## Output
![output](https://i.imgur.com/Zf3TXtb.png)

## Configuration

| Variable   | Required | Default                                                                                                   | Description                                |
|------------|----------|----------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| webhook_url | ✔      |                                                                                                                | Discord's webhook url. Use GH repo secrets. |
| color      | ❌       | "2105893"                                                                                                      | Decimal color value for embed.             |
| username   | ❌       | "Release Changelog"                                                                                            | String username for webhook.               |
| avatar_url | ❌       | ["Profile Picture"](https://cdn.discordapp.com/avatars/487431320314576937/bd64361e4ba6313d561d54e78c9e7171.png) | String url to webhook avatar picture.      |

## Example Usage

`.github/workflows/github-release-to-discord.yml`
```yaml
on:
  release:
    types: [published]

jobs:
  github-release-to-discord:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Github Releases To Discord
        uses: SethCohen/github-release-to-discord@v1.12.0
        with:
          webhook_url: ${{ secrets.WEBHOOK_URL }}
          color: "2105893"
          username: "Release Changelog"
          avatar_url: "https://cdn.discordapp.com/avatars/487431320314576937/bd64361e4ba6313d561d54e78c9e7171.png"
```

## Setup Instructions
1. Open your **Server Settings** and head into the **Integrations** tab:
2. Click the "**Create Webhook**" button to create a new webhook!
   ![](https://support.discord.com/hc/article_attachments/1500000463501/Screen_Shot_2020-12-15_at_4.41.53_PM.png)
   ![](https://support.discord.com/hc/article_attachments/360101553853/Screen_Shot_2020-12-15_at_4.51.38_PM.png)
3. Copy the webhook url
4. Create a new Github repository secret called WEBHOOK_URL and paste the webhook url into it.
   ![](https://i.imgur.com/hAaNOds.png)
5. Save the secret.
6. Add the secret to your action configuration.

And you're done! Whenever you create a new release, the workflow should run and, if properly setup, post to your specified Discord channel.
