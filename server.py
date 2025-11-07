"""
FastMCP 2.0 Server Example

This MCP server demonstrates the key features of FastMCP 2.0:
- Tools: Callable functions for performing actions
- Resources: Static and dynamic data sources
- Prompts: Reusable templates for LLM interactions
"""

from fastmcp import FastMCP
from datetime import datetime
import json

# Initialize the FastMCP server
mcp = FastMCP(
    name="Demo MCP Server",
    instructions="This server provides utility tools, data resources, and helpful prompts for various tasks."
)

# ============================================================================
# TOOLS - Callable functions that clients can invoke
# ============================================================================

@mcp.tool
def add(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b


@mcp.tool
def multiply(a: float, b: float) -> float:
    """Multiply two numbers together."""
    return a * b


@mcp.tool
def reverse_string(text: str) -> str:
    """Reverse the given text string."""
    return text[::-1]


@mcp.tool
def word_count(text: str) -> dict:
    """Count words, characters, and lines in the given text."""
    lines = text.split('\n')
    words = text.split()
    return {
        "characters": len(text),
        "words": len(words),
        "lines": len(lines)
    }


@mcp.tool
def get_current_time() -> str:
    """Get the current date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@mcp.tool
def format_json(data: str) -> str:
    """Format a JSON string with proper indentation."""
    try:
        parsed = json.loads(data)
        return json.dumps(parsed, indent=2)
    except json.JSONDecodeError as e:
        return f"Error: Invalid JSON - {str(e)}"


# ============================================================================
# RESOURCES - Static and dynamic data sources
# ============================================================================

@mcp.resource("config://server")
def get_server_config() -> dict:
    """Provides the server configuration."""
    return {
        "name": "Demo MCP Server",
        "version": "1.0.0",
        "features": ["tools", "resources", "prompts"],
        "status": "active"
    }


@mcp.resource("data://stats")
def get_server_stats() -> dict:
    """Provides server statistics."""
    return {
        "uptime_checked_at": datetime.now().isoformat(),
        "tools_count": 6,
        "resources_count": 3,
        "status": "healthy"
    }


# Resource template with dynamic parameter
@mcp.resource("user://{user_id}/info")
def get_user_info(user_id: str) -> dict:
    """Get information about a specific user by ID."""
    # In a real application, this would fetch from a database
    return {
        "user_id": user_id,
        "username": f"user_{user_id}",
        "status": "active",
        "created_at": "2024-01-01",
        "last_seen": datetime.now().isoformat()
    }


# ============================================================================
# PROMPTS - Reusable templates for LLM interactions
# ============================================================================

@mcp.prompt
def code_review_prompt(code: str, language: str = "python") -> str:
    """Creates a prompt for code review."""
    return f"""Please review the following {language} code and provide feedback on:
1. Code quality and readability
2. Potential bugs or issues
3. Performance considerations
4. Best practices

Code:
```{language}
{code}
```

Please provide a detailed analysis."""


@mcp.prompt
def summarize_text_prompt(text: str, max_sentences: int = 3) -> str:
    """Creates a prompt for text summarization."""
    return f"""Please summarize the following text in no more than {max_sentences} sentences:

{text}

Summary:"""


@mcp.prompt
def debug_help_prompt(error_message: str, context: str = "") -> str:
    """Creates a prompt for debugging assistance."""
    prompt = f"""I'm encountering the following error:

Error: {error_message}
"""
    if context:
        prompt += f"""
Context:
{context}
"""
    prompt += """
Please help me:
1. Understand what this error means
2. Identify the likely cause
3. Suggest solutions to fix it
"""
    return prompt


# ============================================================================
# SERVER EXECUTION
# ============================================================================

if __name__ == "__main__":
    # Run the server using STDIO transport (default for local connections)
    # For HTTP transport, use: mcp.run(transport="http", port=8000)
    mcp.run()
