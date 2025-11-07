#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import os from "os";

/**
 * MCP Server for turbo-octo-fishstick
 * Provides useful tools for file operations, system info, and text processing
 */

class TurboOctoFishstickServer {
  constructor() {
    this.server = new Server(
      {
        name: "turbo-octo-fishstick",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "read_file",
          description: "Read the contents of a file from the filesystem",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the file to read",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "write_file",
          description: "Write content to a file on the filesystem",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the file to write",
              },
              content: {
                type: "string",
                description: "Content to write to the file",
              },
            },
            required: ["path", "content"],
          },
        },
        {
          name: "list_directory",
          description: "List files and directories in a given path",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the directory to list (defaults to current directory)",
              },
            },
          },
        },
        {
          name: "system_info",
          description: "Get system information (OS, platform, memory, etc.)",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "calculate",
          description: "Perform basic mathematical calculations",
          inputSchema: {
            type: "object",
            properties: {
              expression: {
                type: "string",
                description: "Mathematical expression to evaluate (e.g., '2 + 2', '10 * 5')",
              },
            },
            required: ["expression"],
          },
        },
        {
          name: "text_stats",
          description: "Get statistics about a text (word count, character count, etc.)",
          inputSchema: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "Text to analyze",
              },
            },
            required: ["text"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "read_file":
            return await this.handleReadFile(args);
          case "write_file":
            return await this.handleWriteFile(args);
          case "list_directory":
            return await this.handleListDirectory(args);
          case "system_info":
            return await this.handleSystemInfo();
          case "calculate":
            return await this.handleCalculate(args);
          case "text_stats":
            return await this.handleTextStats(args);
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
  }

  async handleReadFile(args) {
    const { path: filePath } = args;
    const content = await fs.readFile(filePath, "utf-8");
    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  }

  async handleWriteFile(args) {
    const { path: filePath, content } = args;
    await fs.writeFile(filePath, content, "utf-8");
    return {
      content: [
        {
          type: "text",
          text: `Successfully wrote to ${filePath}`,
        },
      ],
    };
  }

  async handleListDirectory(args) {
    const dirPath = args.path || ".";
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    const fileList = entries.map((entry) => {
      const type = entry.isDirectory() ? "📁" : "📄";
      return `${type} ${entry.name}`;
    });

    return {
      content: [
        {
          type: "text",
          text: `Contents of ${dirPath}:\n${fileList.join("\n")}`,
        },
      ],
    };
  }

  async handleSystemInfo() {
    const info = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
      nodeVersion: process.version,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(info, null, 2),
        },
      ],
    };
  }

  async handleCalculate(args) {
    const { expression } = args;

    // Simple safe evaluation for basic math
    // Only allow numbers and basic operators
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "");

    if (sanitized !== expression) {
      throw new Error("Invalid characters in expression. Only numbers and +, -, *, /, (, ) are allowed.");
    }

    try {
      // Use Function constructor for safer evaluation than eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      return {
        content: [
          {
            type: "text",
            text: `${expression} = ${result}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Cannot evaluate expression: ${error.message}`);
    }
  }

  async handleTextStats(args) {
    const { text } = args;

    const stats = {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
      lines: text.split("\n").length,
      sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      paragraphs: text.split(/\n\n+/).filter(p => p.trim().length > 0).length,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(stats, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Turbo-Octo-Fishstick MCP server running on stdio");
  }
}

// Start the server
const server = new TurboOctoFishstickServer();
server.run().catch(console.error);
