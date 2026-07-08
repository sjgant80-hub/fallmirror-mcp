// fallmirror-mcp / resources.js
// MCP resources: read-only exposures of SDK catalogues.

import { AXES, PROBES, WITNESS_MARKERS, WITNESS_STAGES, CRISIS_RESOURCES } from '@ai-native-solutions/fallmirror-sdk';

export const RESOURCES = [
  {
    uri: 'fallmirror://probes',
    name: 'Probe library',
    description: 'All 28 probe questions organised by the 7 axes.',
    mimeType: 'application/json',
    read: () => JSON.stringify(PROBES, null, 2)
  },
  {
    uri: 'fallmirror://axes',
    name: 'The 7 axes',
    description: 'The reflection axes with their descriptions.',
    mimeType: 'application/json',
    read: () => JSON.stringify(AXES, null, 2)
  },
  {
    uri: 'fallmirror://witness-markers',
    name: 'Witness ladder markers',
    description: 'Marker phrases for each of the 5 self-awareness stages.',
    mimeType: 'application/json',
    read: () => JSON.stringify({ stages: WITNESS_STAGES, markers: WITNESS_MARKERS }, null, 2)
  },
  {
    uri: 'fallmirror://crisis-resources',
    name: 'Crisis resources',
    description: 'Human-answered support numbers (UK Samaritans, US 988, AU Lifeline, NHS 111, emergency, text lines).',
    mimeType: 'application/json',
    read: () => JSON.stringify(CRISIS_RESOURCES, null, 2)
  }
];
