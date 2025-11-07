# GitHub MCP Server Setup for Windows

## Step 1: Open the Config File

1. Press `Win + R` to open Run dialog
2. Type: `%APPDATA%\Claude`
3. Press Enter
4. Look for `claude_desktop_config.json`
   - If it doesn't exist, create a new text file named `claude_desktop_config.json`

## Step 2: Get a GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Claude MCP Server"
4. Select scopes (permissions):
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `user` (Read user profile data)
5. Click "Generate token"
6. **COPY THE TOKEN** - you won't see it again!

## Step 3: Edit the Config File

Open `claude_desktop_config.json` and add this:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "paste_your_token_here"
      }
    }
  }
}
```

Replace `paste_your_token_here` with your actual GitHub token.

## Step 4: Restart Claude Desktop

1. Completely quit Claude Desktop (right-click system tray icon → Exit)
2. Restart Claude Desktop

## Step 5: Verify Connection

Once Claude Desktop restarts, the GitHub MCP server will be connected!

You can test it by asking Claude to:
- "List my GitHub repositories"
- "Search for issues in [repo-name]"
- "Create an issue in [repo-name]"

## Troubleshooting

If it doesn't work:

1. Check Claude Desktop logs at: `%APPDATA%\Claude\logs\`
2. Verify the token has correct permissions
3. Make sure the JSON is valid (no extra commas, proper quotes)
4. Check that npx is available (run `npx --version` in Command Prompt)

