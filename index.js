#!/usr/bin/env node

import { getToken, hasToken } from './lib/token-manager.js';

/**
 * Main MCP Server Entry Point
 */
async function main() {
  console.log('Starting turbo-octo-fishstick MCP Server...');

  // Check if token is configured
  if (!hasToken()) {
    console.error('\n❌ Error: Claude API token not configured.');
    console.error('Please run: claude setup-token\n');
    process.exit(1);
  }

  const token = getToken();
  console.log('✓ API token loaded successfully');

  // TODO: Implement MCP server logic here
  // This is where you would initialize your MCP server
  // and use the token for authentication with Claude API

  console.log('MCP Server is running...');
  console.log('Press Ctrl+C to stop');

  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n\nShutting down MCP Server...');
    process.exit(0);
  });

  // Prevent the process from exiting
  setInterval(() => {}, 1000);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
