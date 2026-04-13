# MCP Reverse Proxy

A reverse proxy for Model Context Protocol (MCP) servers with response truncation and auth passthrough capabilities.

## Features

- **Universal MCP Support**: Proxy any MCP-compliant server (JSON-RPC and SSE)
- **Response Truncation**: Smart truncation of large responses with token counting
- **Authentication Support**: API keys and OAuth tokens
- **Monitoring**: Prometheus metrics for observability
- **Health Checks**: Built-in health and status endpoints

## Quick Start

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Alternative watch mode (using ts-node --watch)
npm run watch

# Build for production
npm run build
npm start
```

## API Endpoints

### Proxy Endpoints

- `POST /proxy/:serverIdOrUrl?api_key=X&oauth_token=Y` - Proxy JSON-RPC requests
- `GET /proxy/:serverIdOrUrl?api_key=X&oauth_token=Y` - Proxy SSE requests
- `GET /proxy/:serverIdOrUrl/sse?api_key=X&oauth_token=Y` - Explicit SSE endpoint

### Management Endpoints

- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics
- `GET /servers` - List available servers
- `GET /servers/:serverId` - Get server information

## Usage Examples

### Using Server ID (from predefined servers)
```bash
# JSON-RPC request to Linear MCP server
curl -X POST http://localhost:3000/proxy/linear?oauth_token=your_token \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# SSE connection to Notion MCP server  
curl -H "Accept: text/event-stream" \
  http://localhost:3000/proxy/notion?oauth_token=your_token
```

### Using Direct URL
```bash
# Proxy to custom MCP server
curl -X POST http://localhost:3000/proxy/https://your-mcp-server.com/sse?api_key=your_key \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Response Truncation

The proxy automatically truncates large responses based on:
- **Size limits**: Default 10MB max response size  
- **Token limits**: Default 100k tokens max
- **Strategy**: Both size and token limits enforced

Truncated responses include metadata:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": "...",
    "_proxy_metadata": {
      "truncated": true,
      "originalSize": 15728640,
      "truncatedSize": 10485760,
      "strategy": "both"
    }
  }
}
```

## Configuration

Environment variables:
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0)
- `NODE_ENV`: Environment (development/production)

## Monitoring

Prometheus metrics available at `/metrics`:
- Request/response counters
- Response sizes and truncation stats  
- Token usage metrics
- Error rates and types
- Active SSE connections

## Supported MCP Servers

The proxy includes predefined configurations for popular MCP servers:
- Linear
- Notion  
- Neon Database
- Sentry
- Atlassian
- Google Calendar/Drive/Gmail
- And more...

Custom MCP servers can be accessed by URL directly.
