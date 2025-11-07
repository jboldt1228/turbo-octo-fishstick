# FastMCP 2.0 Demo Server

A demonstration MCP (Model Context Protocol) server built with FastMCP 2.0, showcasing tools, resources, and prompts.

## Features

This server demonstrates the key capabilities of FastMCP 2.0:

### 🛠️ Tools
- **Calculator Functions**: `add`, `multiply`
- **Text Utilities**: `reverse_string`, `word_count`
- **JSON Formatter**: `format_json`
- **Time Utility**: `get_current_time`

### 📦 Resources
- **Static Resources**: Server configuration and statistics
- **Dynamic Resources**: User information lookup with parameterized URIs

### 💬 Prompts
- **Code Review**: Generate code review prompts
- **Text Summarization**: Create summarization requests
- **Debug Assistance**: Format debugging help requests

## Installation

### Prerequisites
- Python 3.10 or higher
- `uv` or `pip` package manager

### Setup

1. Install dependencies:
```bash
# Using uv (recommended)
uv add fastmcp

# Or using pip
pip install -r requirements.txt
```

2. Verify installation:
```bash
fastmcp version
```

## Usage

### Running the Server

#### STDIO Transport (Local)
The default transport for local connections:

```bash
# Using Python
python server.py

# Or using FastMCP CLI
fastmcp run server.py:mcp
```

#### HTTP Transport (Remote)
For remote connections and web access:

```bash
# Using Python with HTTP transport
# Modify server.py line: mcp.run(transport="http", port=8000)
python server.py

# Or using FastMCP CLI
fastmcp run server.py:mcp --transport http --port 8000
```

### Connecting Clients

Once the server is running, you can connect MCP clients (like Claude Desktop, Cursor, or custom clients) to use the exposed tools, resources, and prompts.

### Example Tool Calls

When connected via a client, you can:

```python
# Add numbers
result = await client.call_tool("add", {"a": 5, "b": 3})
# Returns: 8

# Count words in text
result = await client.call_tool("word_count", {"text": "Hello world from FastMCP"})
# Returns: {"characters": 24, "words": 4, "lines": 1}

# Format JSON
result = await client.call_tool("format_json", {"data": '{"name":"test"}'})
# Returns: formatted JSON string
```

### Example Resource Access

```python
# Get server configuration
config = await client.read_resource("config://server")

# Get user information (dynamic resource)
user_info = await client.read_resource("user://12345/info")
```

### Example Prompt Usage

```python
# Generate a code review prompt
prompt = await client.get_prompt("code_review_prompt", {
    "code": "def hello(): print('world')",
    "language": "python"
})
```

## Project Structure

```
turbo-octo-fishstick/
├── server.py           # Main MCP server implementation
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Development

### Adding New Tools

Add a new tool by decorating a function with `@mcp.tool`:

```python
@mcp.tool
def my_new_tool(param: str) -> str:
    """Description of what this tool does."""
    return f"Processed: {param}"
```

### Adding New Resources

Add static resources:

```python
@mcp.resource("mydata://example")
def get_my_data() -> dict:
    """Provides example data."""
    return {"key": "value"}
```

Or dynamic resource templates:

```python
@mcp.resource("items://{item_id}")
def get_item(item_id: str) -> dict:
    """Get a specific item by ID."""
    return {"id": item_id, "data": "..."}
```

### Adding New Prompts

```python
@mcp.prompt
def my_prompt(topic: str) -> str:
    """Creates a prompt about a topic."""
    return f"Please explain {topic} in detail."
```

## Deployment

### Local Development
Use STDIO transport for local testing and development with MCP-compatible clients.

### Production Deployment
- Use HTTP transport for remote access
- Consider FastMCP Cloud for managed hosting
- Set appropriate port and host settings for your environment

## Resources

- [FastMCP Documentation](https://gofastmcp.com)
- [FastMCP Quickstart](https://gofastmcp.com/getting-started/quickstart.md)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io)

## License

This is a demo project for educational purposes.