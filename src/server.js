#!/usr/bin/env node
// @ai-native-solutions/fallmirror-mcp
// MCP stdio server wrapping fallmirror-sdk primitives.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { TOOLS } from './tools.js';
import { RESOURCES } from './resources.js';

const server = new Server(
  { name: 'fallmirror-mcp', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error(`Unknown tool: ${req.params.name}`);
  const result = tool.run(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: RESOURCES.map(({ uri, name, description, mimeType }) => ({ uri, name, description, mimeType }))
}));

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  const res = RESOURCES.find(r => r.uri === req.params.uri);
  if (!res) throw new Error(`Unknown resource: ${req.params.uri}`);
  return { contents: [{ uri: res.uri, mimeType: res.mimeType, text: res.read() }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('fallmirror-mcp · stdio ready');
