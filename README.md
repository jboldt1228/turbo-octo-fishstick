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

### Server Not Connecting

1. Check that the path in the configuration is absolute, not relative
2. Verify Node.js/Python is in your system PATH
3. Check Claude Desktop logs:
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
