# @ai-native-solutions/fallmirror-mcp

MCP server for **FallMirror** — exposes the sovereign 7-angle probing engine, safety layer, witness-stage detection, and session chord generator as MCP tools and resources.

Wraps [`@ai-native-solutions/fallmirror-sdk`](https://github.com/sjgant80-hub/fallmirror-sdk).

## Install

```bash
npm install -g @ai-native-solutions/fallmirror-mcp
```

Or run directly with `npx`:

```bash
npx @ai-native-solutions/fallmirror-mcp
```

## Wire it up

### Claude Code

```bash
claude mcp add fallmirror npx @ai-native-solutions/fallmirror-mcp
```

### Claude Desktop

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fallmirror": {
      "command": "npx",
      "args": ["-y", "@ai-native-solutions/fallmirror-mcp"]
    }
  }
}
```

### Cursor / Cline / Windsurf

Add to your MCP config:

```json
{
  "mcpServers": {
    "fallmirror": {
      "command": "npx",
      "args": ["-y", "@ai-native-solutions/fallmirror-mcp"]
    }
  }
}
```

## Tools

| Tool | Purpose |
|---|---|
| `fallmirror_pick_probe` | Pick a probe from an axis (or auto-pick from session state) |
| `fallmirror_score_response` | Score free-text against the 7 axes, return dominant + entropy |
| `fallmirror_safety_check` | Detect crisis / abuse / psychosis language |
| `fallmirror_detect_witness_stage` | EMA-smoothed self-awareness stage (0–4) |
| `fallmirror_generate_chord` | Closing takeaway sentence for a session |
| `fallmirror_bloom_ema` | Update the 7-vector profile after a session |
| `fallmirror_session_to_torus` | Project a session onto the torus dashboard |

## Resources

| URI | Description |
|---|---|
| `fallmirror://probes` | All 28 probe questions by axis |
| `fallmirror://axes` | The 7 axes with descriptions |
| `fallmirror://witness-markers` | Marker phrases for each self-awareness stage |
| `fallmirror://crisis-resources` | Human-answered support numbers |

## Example flow

```
Assistant: (calls fallmirror_safety_check with text=user_message)
           -> { level: 'ok' }