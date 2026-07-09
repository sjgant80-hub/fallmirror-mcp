#!/usr/bin/env node
// fallmirror-mcp · MCP stdio server wrapping fallmirror-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'fallmirror-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fallmirror_safety_check',
    description: 'safetyCheck · from fallmirror-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { safetyCheck } = await import('@ai-native-solutions/fallmirror-sdk');
      return typeof safetyCheck === 'function' ? await safetyCheck(args) : { error: 'safetyCheck not callable' };
    }
  },
  {
    name: 'fallmirror_pick_probe',
    description: 'pickProbe · from fallmirror-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { pickProbe } = await import('@ai-native-solutions/fallmirror-sdk');
      return typeof pickProbe === 'function' ? await pickProbe(args) : { error: 'pickProbe not callable' };
    }
  },
  {
    name: 'fallmirror_score_response',
    description: 'scoreResponse · from fallmirror-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { scoreResponse } = await import('@ai-native-solutions/fallmirror-sdk');
      return typeof scoreResponse === 'function' ? await scoreResponse(args) : { error: 'scoreResponse not callable' };
    }
  },
  {
    name: 'fallmirror_dominant_axis',
    description: 'dominantAxis · from fallmirror-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { dominantAxis } = await import('@ai-native-solutions/fallmirror-sdk');
      return typeof dominantAxis === 'function' ? await dominantAxis(args) : { error: 'dominantAxis not callable' };
    }
  },
  {
    name: 'fallmirror_next_probe_axis',
    description: 'nextProbeAxis · from fallmirror-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { nextProbeAxis } = await import('@ai-native-solutions/fallmirror-sdk');
      return typeof nextProbeAxis === 'function' ? await nextProbeAxis(args) : { error: 'nextProbeAxis not callable' };
    }
  },
  {
    name: 'fallmirror_update_bloom_e_m_a',
    description: 'updateBloomEMA · from fallmirror-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { updateBloomEMA } = await import('@ai-native-solutions/fallmirror-sdk');
      return typeof updateBloomEMA === 'function' ? await updateBloomEMA(args) : { error: 'updateBloomEMA not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('fallmirror-mcp v1.0.0 · stdio ready');
