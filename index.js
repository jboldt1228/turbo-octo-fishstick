#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// In-memory storage for notes
const notes = new Map();

// Create server instance
const server = new Server(
  {
    name: "turbo-octo-fishstick",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculate",
        description: "Perform basic mathematical calculations. Supports +, -, *, /, and parentheses.",
        inputSchema: {
          type: "object",
          properties: {
            expression: {
              type: "string",
              description: "Mathematical expression to evaluate (e.g., '2 + 2', '10 * (5 + 3)')",
            },
          },
          required: ["expression"],
        },
      },
      {
        name: "save_note",
        description: "Save a note with a given key for later retrieval",
        inputSchema: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "Unique identifier for the note",
            },
            content: {
              type: "string",
              description: "Content of the note to save",
            },
          },
          required: ["key", "content"],
        },
      },
      {
        name: "get_note",
        description: "Retrieve a previously saved note by its key",
        inputSchema: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "Key of the note to retrieve",
            },
          },
          required: ["key"],
        },
      },
      {
        name: "list_notes",
        description: "List all saved note keys",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_current_time",
        description: "Get the current date and time in ISO format",
        inputSchema: {
          type: "object",
          properties: {
            timezone: {
              type: "string",
              description: "Optional timezone (e.g., 'America/New_York'). Defaults to UTC.",
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "calculate": {
        const expression = args.expression;

        // Basic security check - only allow numbers, operators, and parentheses
        if (!/^[\d+\-*/(). ]+$/.test(expression)) {
          throw new Error("Invalid expression: only numbers and basic operators (+, -, *, /, parentheses) are allowed");
        }

        // Use Function constructor as a safer eval alternative for math
        const result = new Function(`return ${expression}`)();

        return {
          content: [
            {
              type: "text",
              text: `Result: ${result}`,
            },
          ],
        };
      }

      case "save_note": {
        const { key, content } = args;
        notes.set(key, {
          content,
          timestamp: new Date().toISOString(),
        });

        return {
          content: [
            {
              type: "text",
              text: `Note saved with key: ${key}`,
            },
          ],
        };
      }

      case "get_note": {
        const { key } = args;
        const note = notes.get(key);

        if (!note) {
          return {
            content: [
              {
                type: "text",
                text: `No note found with key: ${key}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Note: ${note.content}\nSaved at: ${note.timestamp}`,
            },
          ],
        };
      }

      case "list_notes": {
        const keys = Array.from(notes.keys());

        if (keys.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "No notes saved yet.",
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Saved notes:\n${keys.map(k => `- ${k}`).join('\n')}`,
            },
          ],
        };
      }

      case "get_current_time": {
        const timezone = args.timezone || "UTC";
        const now = new Date();

        let timeString;
        try {
          timeString = now.toLocaleString("en-US", { timeZone: timezone });
        } catch (error) {
          timeString = now.toISOString();
        }

        return {
          content: [
            {
              type: "text",
              text: `Current time (${timezone}): ${timeString}\nISO format: ${now.toISOString()}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "server://info",
        mimeType: "text/plain",
        name: "Server Information",
        description: "Information about this MCP server and its capabilities",
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "server://info") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Turbo Octo Fishstick MCP Server

This is a Model Context Protocol server that provides useful tools for Claude Desktop.

Available Tools:
- calculate: Perform basic math calculations
- save_note/get_note/list_notes: Simple note-taking functionality
- get_current_time: Get current date and time

Version: 1.0.0
`,
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Turbo Octo Fishstick MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
