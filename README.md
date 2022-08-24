# Github Release To Discord Action

This action parses a github release and posts it to a discord channel via a discord webhook.
## Configuration
| Variable    | Required | Default                                                                                                   | Description                                 |
|-------------|----------|----------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| webhook_url | ✔      |                                                                                                                | Discord's webhook url. Use GH repo secrets. |
| colour      | ❌       | "2105893"                                                                                                      | Decimal colour value for embed.             |
| username    | ❌       | "Release Changelog"                                                                                            | String username for webhook.                |
| avatar_url  | ❌       | ["Profile Picture"](https://cdn.discordapp.com/avatars/487431320314576937/bd64361e4ba6313d561d54e78c9e7171.png) | String url to webhook avatar picture.       |


## Output
![output](https://i.imgur.com/fOIu7pC.png)

## Example usage

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
      - name: Handle Release
        uses: ./ # Uses an action in the root directory
        id: release
        with:
          webhook_url: ${{ secrets.WEBHOOK_URL }}
```