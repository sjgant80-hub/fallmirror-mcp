// fallmirror-mcp / tools.js
// MCP tool definitions wrapping the SDK primitives.

import {
  safetyCheck, pickProbe, nextProbeAxis,
  scoreResponse, dominantAxis, detectWitnessStage,
  updateBloomEMA, profileShape, profileHint,
  generateChord, sessionToTorus,
  AXES, PROBES, WITNESS_STAGES
} from '@ai-native-solutions/fallmirror-sdk';

export const TOOLS = [
  {
    name: 'fallmirror_pick_probe',
    description: 'Pick a probe question from an axis, avoiding recently-used probes. Given optional session_state, decides the next axis via nextProbeAxis; otherwise uses the axis you pass explicitly.',
    inputSchema: {
      type: 'object',
      properties: {
        axis: { type: 'string', enum: AXES.map(a => a.key), description: 'Force a specific axis. Omit to auto-pick from session_state.' },
        session_state: {
          type: 'object',
          description: 'Optional session state: { probes: [{axis}], lastDominant, currentDH }',
          properties: {
            probes: { type: 'array', items: { type: 'object', properties: { axis: { type: 'string' } } } },
            lastDominant: { type: 'string' },
            currentDH: { type: 'number' }
          }
        },
        avoid: { type: 'array', items: { type: 'string' }, description: 'Probe texts to avoid.' }
      }
    },
    run: ({ axis, session_state, avoid }) => {
      const chosenAxis = axis || (session_state ? nextProbeAxis(session_state) : 'polarity');
      const text = pickProbe(chosenAxis, avoid || []);
      return { probe_text: text, axis: chosenAxis };
    }
  },
  {
    name: 'fallmirror_score_response',
    description: 'Score free-text against the 7 axes (polarity, structure, depth, time, expansion, relationship, resolution). Returns keyword-hit counts, entropy (0-1), word count, and dominant axis.',
    inputSchema: {
      type: 'object',
      required: ['text'],
      properties: { text: { type: 'string' } }
    },
    run: ({ text }) => {
      const scored = scoreResponse(text);
      return { ...scored, dominant_axis: dominantAxis(scored.scores) };
    }
  },
  {
    name: 'fallmirror_safety_check',
    description: 'Scan text for crisis / abuse / psychosis language. Returns { level: "ok" | "crisis" | "referral", kind? }. Always run before showing any AI response to user text.',
    inputSchema: {
      type: 'object',
      required: ['text'],
      properties: { text: { type: 'string' } }
    },
    run: ({ text }) => safetyCheck(text)
  },
  {
    name: 'fallmirror_detect_witness_stage',
    description: 'EMA-smoothed self-awareness stage (0-4) based on marker phrases in the text and the current stage.',
    inputSchema: {
      type: 'object',
      required: ['text'],
      properties: {
        text: { type: 'string' },
        current_stage: { type: 'number', description: 'Current stage (default 0). Float allowed for smoothing.' }
      }
    },
    run: ({ text, current_stage }) => ({
      new_stage: detectWitnessStage(text, current_stage || 0),
      stages: WITNESS_STAGES
    })
  },
  {
    name: 'fallmirror_generate_chord',
    description: 'Generate the closing takeaway ("chord") for a session. Needs { probes: [{axis}], lastEntropy }. Returns { text, resolved }.',
    inputSchema: {
      type: 'object',
      required: ['session_state'],
      properties: {
        session_state: {
          type: 'object',
          properties: {
            probes: { type: 'array', items: { type: 'object', properties: { axis: { type: 'string' } } } },
            lastEntropy: { type: 'number' }
          }
        }
      }
    },
    run: ({ session_state }) => generateChord(session_state)
  },
  {
    name: 'fallmirror_bloom_ema',
    description: 'EMA-update a 7-vector bloom profile from a session\'s scores. Alpha defaults to 0.15.',
    inputSchema: {
      type: 'object',
      required: ['current_bloom', 'session_scores'],
      properties: {
        current_bloom: { type: 'array', items: { type: 'number' }, minItems: 7, maxItems: 7 },
        session_scores: { type: 'object' },
        alpha: { type: 'number', description: 'Smoothing factor, default 0.15' }
      }
    },
    run: ({ current_bloom, session_scores, alpha }) => {
      const newBloom = updateBloomEMA(current_bloom, session_scores, alpha || 0.15);
      const shape = profileShape(newBloom);
      return { new_bloom: newBloom, shape, hint: profileHint(shape) };
    }
  },
  {
    name: 'fallmirror_session_to_torus',
    description: 'Project a session onto the torus dashboard: theta = dominant axis, psi = entropy delta.',
    inputSchema: {
      type: 'object',
      required: ['session_scores'],
      properties: {
        session_scores: { type: 'object' },
        dh: { type: 'number', description: 'entropy - 0.618' }
      }
    },
    run: ({ session_scores, dh }) => sessionToTorus(session_scores, dh || 0)
  }
];
