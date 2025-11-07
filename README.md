# turbo-octo-fishstick

A Model Context Protocol (MCP) server for Claude Desktop.

## Installation

### Prerequisites

- Node.js 18 or higher (for Node-based servers)
- Python 3.8 or higher (for Python-based servers)
- Claude Desktop app

### Setup

1. Clone this repository:
```bash
git clone https://github.com/jboldt1228/turbo-octo-fishstick.git
cd turbo-octo-fishstick
```

2. Install dependencies:

**For Node.js:**
```bash
npm install
```

**For Python:**
```bash
pip install -r requirements.txt
```

## API Token Setup

Before running the MCP server, you need to configure your Claude API token.

### Getting Your API Token

1. Go to [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Create a new API key or copy an existing one
3. The token should start with `sk-ant-`

### Setup Command

Run the interactive setup command:

```bash
npx . setup-token
```

Or if you've installed the package globally:

```bash
npm link
claude setup-token
```

The setup wizard will:
- Prompt you for your Claude API token
- Validate the token format
- Securely store it in your system configuration
- Show you where the token is stored

### Token Storage

Tokens are encrypted and stored locally using [conf](https://github.com/sindresorhus/conf) at:

- **macOS/Linux**: `~/.config/turbo-octo-fishstick-nodejs/config.json`
- **Windows**: `%APPDATA%\turbo-octo-fishstick-nodejs\Config\config.json`

### CLI Commands

```bash
# Set up or update your API token
claude setup-token

# Show help
claude help
```

## Connecting to Claude Desktop

To connect this MCP server to Claude Desktop, you need to configure it in the Claude Desktop configuration file.

### Configuration Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Configuration Setup

Edit the configuration file and add your server under the `mcpServers` section:

**For Node.js server:**
```json
{
  "mcpServers": {
    "turbo-octo-fishstick": {
      "command": "node",
      "args": [
        "/absolute/path/to/turbo-octo-fishstick/index.js"
      ]
    }
  }
}
```

**For Python server:**
```json
{
  "mcpServers": {
    "turbo-octo-fishstick": {
      "command": "python",
      "args": [
        "-m",
        "mcp_server_turbo_octo_fishstick"
      ],
      "env": {
        "PYTHONPATH": "/absolute/path/to/turbo-octo-fishstick"
      }
    }
  }
}
```

### Alternative: Using npx (for published packages)

If this server is published to npm:
```json
{
  "mcpServers": {
    "turbo-octo-fishstick": {
      "command": "npx",
      "args": [
        "-y",
        "turbo-octo-fishstick"
      ]
    }
  }
}
```

### Restart Claude Desktop

After updating the configuration:
1. Quit Claude Desktop completely
2. Restart the application
3. The server will be automatically connected

### Verify Connection

Once Claude Desktop restarts, you can verify the connection by:
- Checking for any error messages in the app
- Looking for available tools/resources from this server
- Opening Claude Desktop logs if troubleshooting is needed

## Development

### Running Locally

**Node.js:**
```bash
npm run dev
```

**Python:**
```bash
python -m mcp_server_turbo_octo_fishstick
```

### Testing

Run tests with:
```bash
npm test    # Node.js
pytest      # Python
```

## Troubleshooting

### Token Not Configured

If you see an error about the token not being configured:

```
❌ Error: Claude API token not configured.
Please run: claude setup-token
```

Run the setup command:
```bash
claude setup-token
```

### Server Not Connecting

1. Make sure you've run `claude setup-token` to configure your API token
2. Check that the path in the configuration is absolute, not relative
3. Verify Node.js/Python is in your system PATH
4. Check Claude Desktop logs:
   - **macOS**: `~/Library/Logs/Claude/`
   - **Windows**: `%APPDATA%\Claude\logs\`
   - **Linux**: `~/.config/Claude/logs/`

### Permission Issues

Ensure the server files have execute permissions:
```bash
chmod +x index.js  # or your entry file
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
