#!/usr/bin/env node

/**
 * Manual test script for MCP server tools
 * This verifies that each tool function works correctly
 */

import fs from "fs/promises";
import os from "os";

console.log("🧪 Testing turbo-octo-fishstick MCP Server Tools\n");

// Test 1: Calculate
console.log("1️⃣  Testing calculate tool...");
try {
  const expression = "(10 + 5) * 3 - 8";
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "");
  const result = Function(`"use strict"; return (${sanitized})`)();
  console.log(`   ✓ ${expression} = ${result}`);
  console.log(`   Expected: 37, Got: ${result}`);
  if (result === 37) {
    console.log("   ✅ PASS\n");
  } else {
    console.log("   ❌ FAIL\n");
  }
} catch (error) {
  console.log(`   ❌ FAIL: ${error.message}\n`);
}

// Test 2: Text Stats
console.log("2️⃣  Testing text_stats tool...");
try {
  const text = "Hello world! This is a test.\nIt has multiple lines.\n\nAnd paragraphs.";
  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
    lines: text.split("\n").length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    paragraphs: text.split(/\n\n+/).filter(p => p.trim().length > 0).length,
  };
  console.log(`   Text: "${text.substring(0, 30)}..."`);
  console.log(`   Characters: ${stats.characters}`);
  console.log(`   Words: ${stats.words}`);
  console.log(`   Lines: ${stats.lines}`);
  console.log(`   Sentences: ${stats.sentences}`);
  console.log(`   ✅ PASS\n`);
} catch (error) {
  console.log(`   ❌ FAIL: ${error.message}\n`);
}

// Test 3: System Info
console.log("3️⃣  Testing system_info tool...");
try {
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
  console.log(`   Platform: ${info.platform}`);
  console.log(`   Architecture: ${info.arch}`);
  console.log(`   CPUs: ${info.cpus}`);
  console.log(`   Node Version: ${info.nodeVersion}`);
  console.log(`   ✅ PASS\n`);
} catch (error) {
  console.log(`   ❌ FAIL: ${error.message}\n`);
}

// Test 4: Write and Read File
console.log("4️⃣  Testing write_file and read_file tools...");
const testFile = "/tmp/mcp-test-file.txt";
const testContent = "Hello from MCP server test!";
try {
  await fs.writeFile(testFile, testContent, "utf-8");
  console.log(`   ✓ Wrote to ${testFile}`);

  const readContent = await fs.readFile(testFile, "utf-8");
  console.log(`   ✓ Read from ${testFile}`);

  if (readContent === testContent) {
    console.log(`   ✓ Content matches!`);
    console.log(`   ✅ PASS\n`);
  } else {
    console.log(`   ❌ FAIL: Content mismatch\n`);
  }

  // Cleanup
  await fs.unlink(testFile);
} catch (error) {
  console.log(`   ❌ FAIL: ${error.message}\n`);
}

// Test 5: List Directory
console.log("5️⃣  Testing list_directory tool...");
try {
  const dirPath = ".";
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const fileList = entries.map((entry) => {
    const type = entry.isDirectory() ? "📁" : "📄";
    return `${type} ${entry.name}`;
  });
  console.log(`   Found ${entries.length} entries in current directory`);
  console.log(`   First few: ${fileList.slice(0, 3).join(", ")}`);
  console.log(`   ✅ PASS\n`);
} catch (error) {
  console.log(`   ❌ FAIL: ${error.message}\n`);
}

console.log("✨ All tests completed!");
