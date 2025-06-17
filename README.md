# GitHub Releases to Discord Action

Easily notify your Discord community about new GitHub releases! This GitHub Action automatically sends a beautifully formatted Discord embed message with your release notes whenever you publish a release on GitHub.

**Main Benefits:**

- Instantly share release changelogs with your Discord server.
- Highly customizable message appearance and content.
- Simple setup—no coding required.
- Supports advanced formatting and filtering for professional notifications.

---

## Features

- **Automatic Release Notifications:** Sends a Discord embed when a GitHub release is published.
- **Clean Formatting:**
  - Removes carriage returns and HTML comments.
  - Optimizes whitespace and paragraph spacing.
- **Mention & Link Handling:**
  - Converts `@mentions` to clickable GitHub profile links.
  - Converts PR, issue, and changelog URLs to Markdown links.
  - Optionally removes PR, commit, and issue links for cleaner messages.
- **Heading Reduction:**
  - Optionally reduces heading sizes for compact display.
- **Custom Embed Appearance:**
  - Set color, username, avatar, footer, and more.
- **Length Management:**
  - Ensures messages fit Discord's embed limits, trimming and linking as needed.
- **Error Handling:**
  - Clear errors for missing or invalid inputs.
- **Easy Integration:**
  - Works with any public or private repository.

---

## Quick Start

### 1. Create a Discord Webhook

- Go to your Discord server settings → **Integrations** → **Webhooks**.
- Click **Create Webhook** and copy the webhook URL.

### 2. Add the Action to Your Workflow

Create (or update) `.github/workflows/github-releases-to-discord.yml`:

```yaml
on:
  release:
    types: [published]

jobs:
  github-releases-to-discord:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: GitHub Releases to Discord
        uses: SethCohen/github-releases-to-discord@v1
        with:
          webhook_url: ${{ secrets.WEBHOOK_URL }}
          color: "2105893"
          username: "Release Changelog"
          avatar_url: "https://cdn.discordapp.com/avatars/487431320314576937/bd64361e4ba6313d561d54e78c9e7171.png"
          content: "||@everyone||"
          footer_title: "Changelog"
          reduce_headings: true
```

### 3. Add Your Webhook URL as a Secret

- In your GitHub repo, go to **Settings → Secrets and variables → Actions**.
- Add a new secret named `WEBHOOK_URL` and paste your Discord webhook URL.

---

## Configuration Options

| Input Name                    | Required | Default     | Description                                                        |
|-------------------------------|----------|-------------|--------------------------------------------------------------------|
| `webhook_url`                 | ✔        |             | Discord webhook URL (use a GitHub secret).                         |
| `color`                       | ❌       | 2105893     | Embed color (decimal).                                             |
| `username`                    | ❌       |             | Webhook username.                                                  |
| `avatar_url`                  | ❌       |             | Webhook avatar image URL.                                          |
| `custom_html_url`             | ❌       |             | Custom URL for the embed title (overrides GitHub release URL).     |
| `content`                     | ❌       |             | Additional message content (e.g., `@everyone`).                    |
| `footer_title`                | ❌       |             | Footer title.                                                      |
| `footer_icon_url`             | ❌       |             | Footer icon image URL.                                             |
| `footer_timestamp`            | ❌       | false       | Show timestamp in footer (`true`/`false`).                         |
| `max_description`             | ❌       | 4096        | Max description length (Discord limit: 4096).                      |
| `remove_github_reference_links`| ❌      | false       | Remove PR, commit, and issue links from the description.           |
| `reduce_headings`             | ❌       | false       | Reduce heading sizes for compact display.                          |

---

## Example Output

![Discord Embed Example](https://i.imgur.com/ovr0gTL.png)

---

## Best Practices & Notes

- **Use Secrets for Webhook URLs:** Never commit your Discord webhook URL directly to your repository.
- **Discord Embed Limits:**
  - Title: 256 characters max
  - Description: 4096 characters max
  - The action will trim and link if limits are exceeded.
- **Release Body Formatting:**
  - Use Markdown in your release notes for best results.
- **Private Repos:**
  - The action works for both public and private repositories.

---

## Troubleshooting & FAQ

**Q: The action didn't post to Discord!**

- Check that your webhook URL is correct and not expired.
- Ensure the `webhook_url` secret is set in your repository.
- Review the Actions log for error messages.

**Q: My message is cut off.**

- Discord has strict embed limits. The action trims long messages and adds a link if needed.

**Q: How do I customize the embed?**

- Use the configuration options above to set color, username, avatar, footer, and more.

**Q: Can I mention everyone or specific roles?**

- Use the `content` input (e.g., `content: "@everyone"`).

---

## Contributing

We welcome contributions! To get started:

1. **Fork** this repository.
2. **Clone** your fork and run `npm install`.
3. **Create a test release payload:**
   - Copy `tests/sample-test-release.json` and edit as needed.
4. **Create a `.env` file** in the root with your webhook and config (see below):

   ```env
   INPUT_WEBHOOK_URL=your_webhook_url
   INPUT_COLOR=2105893
   ...
   ```

5. **Test locally** with [`act`](https://github.com/nektos/act):

   ```bash
   act release -e tests/sample-test-release.json
   ```

6. **Make your changes** and commit using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
7. **Open a pull request** with a clear description of your changes.

---

## License

[MIT License](LICENSE)

---

## Support & Feedback

- **Issues:** [Open an issue](https://github.com/SethCohen/github-releases-to-discord/issues) for bugs, questions, or feature requests.
- **Pull Requests:** Contributions are welcome—see above!

---

## Acknowledgements

- Inspired by the needs of open source maintainers and Discord communities.
- Built and maintained by [SethCohen](https://github.com/SethCohen).
