#!/usr/bin/env node

import { setupToken } from '../lib/token-manager.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'setup-token':
      await setupToken();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

function showHelp() {
  console.log(`
Claude MCP Server CLI

Usage:
  claude setup-token    Configure your Claude API token
  claude help           Show this help message

Examples:
  claude setup-token    # Interactive token setup
`);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
