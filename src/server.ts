import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createOrGetProxy } from './utils/ProxyPool';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ─── generic middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('combined'));

// Add custom request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`🔄 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`   Headers: ${JSON.stringify(req.headers, null, 2)}`);
  next();
});

// Health check endpoint
app.get('/health', (_, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString() })
);

// ─── proxy with SSE interception ─────────────────────────────────────────────

// mount the proxy (everything except /health)
app.use((req, res, next) => {
  if (req.path === '/health') return next();

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const queryParams = req.query;
  const mcp_server_url = queryParams.mcp_server_url as string;

  console.log('🔍 [SERVER SELECTION]');
  console.log('   host:', host);
  console.log('   queryParams:', queryParams);
  console.log('   mcp_server_url:', mcp_server_url);

  // const mcpServer = RECOMMENDED_SERVERS.find(
  //   (server) => server.endpoint_url === mcp_server_url
  // );

  if (!mcp_server_url) {
    console.error(
      `❌ [SERVER ERROR] Unknown mcp_server_url: ${mcp_server_url}`
    );
    return res.status(400).json({
      error: 'Unknown MCP server',
      server_url: mcp_server_url,
    });
  }

  const MCP_TARGET_URL = mcp_server_url.replace('/sse', '');
  console.log('🎯 [TARGET] Selected server:', mcp_server_url);
  console.log('   Target URL:', MCP_TARGET_URL);

  // STRIP mcp_server_id from query params before forwarding
  const cleanQuery = { ...queryParams };
  delete cleanQuery.mcp_server_url;

  console.log('🧹 [STRIPPED] Original query:', queryParams);
  console.log('   Clean query:', cleanQuery);

  // Reconstruct clean query string
  const cleanQueryString = new URLSearchParams(cleanQuery as any).toString();
  const cleanUrl = req.path + (cleanQueryString ? `?${cleanQueryString}` : '');

  console.log('🔄 [FORWARDING] Clean URL:', cleanUrl);

  const proxy = createOrGetProxy(MCP_TARGET_URL);
  return req.path === '/health' ? next() : proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`🚀 Reverse proxy server running on http://localhost:${PORT}`);
  console.log(`\n📋 Usage Examples:`);
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`   SSE Endpoint: http://localhost:${PORT}/sse`);
  console.log(
    `   OAuth Discovery: http://localhost:${PORT}/.well-known/oauth-authorization-server`
  );
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down proxy server...');
  process.exit(0);
});
