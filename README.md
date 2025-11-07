# turbo-octo-fishstick

A Model Context Protocol (MCP) server for Claude Desktop that provides useful tools including a calculator, note-taking, and time utilities.

## Features

This MCP server provides the following tools:

- **calculate**: Perform basic mathematical calculations (supports +, -, *, /, and parentheses)
- **save_note**: Save notes with a unique key for later retrieval
- **get_note**: Retrieve previously saved notes
- **list_notes**: List all saved note keys
- **get_current_time**: Get the current date and time with optional timezone support

It also provides a resource with server information.

## Installation

### Prerequisites

- Node.js 18 or higher
- Claude Desktop app
- npm (comes with Node.js)

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

3. Make the index.js file executable (optional, but recommended):
```bash
chmod +x index.js
```

## Connecting to Claude Desktop

To connect this MCP server to Claude Desktop, follow these steps:

### Step 1: Locate Your Configuration File

Find the Claude Desktop configuration file at:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Step 2: Edit the Configuration

Open the configuration file in a text editor. If the file doesn't exist, create it.

Add your server configuration under the `mcpServers` section. Replace `/absolute/path/to/turbo-octo-fishstick` with the actual path where you cloned this repository.

**Example configuration:**
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

**Real example (macOS):**
```json
{
  "mcpServers": {
    "turbo-octo-fishstick": {
      "command": "node",
      "args": [
        "/Users/yourusername/projects/turbo-octo-fishstick/index.js"
      ]
    }
  }
}
```

**Real example (Windows):**
```json
{
  "mcpServers": {
    "turbo-octo-fishstick": {
      "command": "node",
      "args": [
        "C:\\Users\\yourusername\\projects\\turbo-octo-fishstick\\index.js"
      ]
    }
  }
}
```

**Important notes:**
- The path MUST be absolute (full path), not relative
- On Windows, use double backslashes (`\\`) in the path
- Make sure Node.js is installed and accessible in your system PATH

### Step 3: Restart Claude Desktop

After saving the configuration:
1. Completely quit Claude Desktop (not just close the window)
2. Restart Claude Desktop
3. The server will automatically connect on startup

### Step 4: Verify Connection

Once Claude Desktop restarts, verify the connection:

1. Look for a hammer icon or similar in Claude Desktop indicating MCP tools are available
2. Try using one of the tools, for example: "Can you calculate 25 * 4 for me?"
3. If there are issues, check the Claude Desktop logs (see Troubleshooting section below)

## Development

### Running Locally for Testing

You can test the server locally by running:

```bash
npm start
```

The server will start and listen on stdio. You should see:
```
Turbo Octo Fishstick MCP server running on stdio
```

Note: The server uses stdio transport, so it's designed to be run by Claude Desktop rather than directly by users. Direct testing requires MCP client tools.

### Available Tools

Once connected to Claude Desktop, you can use these tools:

1. **Calculator**
   - Example: "Calculate 15 * 8 + 22"
   - Example: "What's (100 - 25) * 3?"

2. **Notes**
   - Example: "Save a note with key 'meeting' containing 'Discuss Q4 roadmap'"
   - Example: "Get the note with key 'meeting'"
   - Example: "List all my notes"

3. **Time**
   - Example: "What time is it?"
   - Example: "What's the current time in America/New_York?"

## Troubleshooting

### Server Not Connecting

If the server doesn't connect to Claude Desktop:

1. **Check the configuration path**
   - Ensure the path in `claude_desktop_config.json` is absolute, not relative
   - Verify the path points to the correct `index.js` file
   - On Windows, make sure to use double backslashes (`\\`)

2. **Verify Node.js installation**
   - Run `node --version` in your terminal
   - You need Node.js 18 or higher
   - Make sure Node.js is in your system PATH

3. **Check Claude Desktop logs**
   - **macOS**: `~/Library/Logs/Claude/`
   - **Windows**: `%APPDATA%\Claude\logs\`
   - **Linux**: `~/.config/Claude/logs/`
   - Look for error messages related to "turbo-octo-fishstick"

4. **Verify dependencies are installed**
   ```bash
   cd /path/to/turbo-octo-fishstick
   npm install
   ```

### Permission Issues (macOS/Linux)

If you get permission errors, ensure the files have the correct permissions:

```bash
chmod +x index.js
```

### Configuration File Issues

If Claude Desktop doesn't seem to read your configuration:

1. Make sure the JSON is valid (no trailing commas, proper quotes)
2. Ensure the file is saved with UTF-8 encoding
3. Try completely quitting and restarting Claude Desktop (not just closing the window)

### Still Having Issues?

1. Check that you completely quit Claude Desktop before restarting
2. Try removing and re-adding the server configuration
3. Check the Claude Desktop logs for specific error messages
4. Verify that no other MCP server with the same name is configured

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
