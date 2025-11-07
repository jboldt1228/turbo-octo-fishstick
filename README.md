# turbo-octo-fishstick

A Model Context Protocol (MCP) server for Claude Desktop that provides useful tools for file operations, system information, and text processing.

## Available Tools

This MCP server provides the following tools:

### File Operations
- **read_file**: Read the contents of a file from the filesystem
- **write_file**: Write content to a file on the filesystem
- **list_directory**: List files and directories in a given path

### System Information
- **system_info**: Get system information including OS, platform, CPU count, memory usage, and uptime

### Utilities
- **calculate**: Perform basic mathematical calculations (supports +, -, *, /, parentheses)
- **text_stats**: Get statistics about text including character count, word count, line count, sentences, and paragraphs

## Installation

### Prerequisites

- Node.js 18 or higher
- Claude Desktop app

### Setup

1. Clone this repository:
```bash
git clone https://github.com/jboldt1228/turbo-octo-fishstick.git
cd turbo-octo-fishstick
```

2. Install dependencies:
```bash
npm install
```

## Connecting to Claude Desktop

To connect this MCP server to Claude Desktop, you need to configure it in the Claude Desktop configuration file.

### Configuration Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Configuration Setup

Edit the configuration file and add your server under the `mcpServers` section:

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

```bash
npm run dev
```

Or directly:
```bash
node index.js
```

### Testing

Run tests with:
```bash
npm test
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
