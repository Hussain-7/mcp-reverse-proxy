import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import morgan from 'morgan';
import { ChunkGuard } from './utils/ChunkGuard';
import { IncomingMessage } from 'http';
import { RECOMMENDED_SERVERS } from './constants/servers';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MCP_TARGET_URL = RECOMMENDED_SERVERS[0].endpoint_url.replace('/sse', '');

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
const proxy = createProxyMiddleware({
  target: MCP_TARGET_URL,
  changeOrigin: true,
  secure: true,
  selfHandleResponse: true, // << important
  on: {
    proxyRes: (proxyRes: IncomingMessage, req: Request, res: Response) => {
      console.log(`✅ [PROXY RES] ${proxyRes.statusCode} for ${req.url}`);
      const ctype = (proxyRes.headers['content-type'] ?? '') as string;
      console.log(`   Content-Type: ${ctype}`);
      console.log(
        `   Content-Length: ${proxyRes.headers['content-length'] || 'streaming'}`
      );

      // ----------------------------------------------------------------- SSE ---
      if (ctype.startsWith('text/event-stream')) {
        console.log(`🔴 [SSE STREAM] Starting SSE stream for ${req.url}`);

        // 1. copy all headers except content-length (chunked)
        Object.entries(proxyRes.headers).forEach(([k, v]) => {
          if (k.toLowerCase() !== 'content-length' && v != null) {
            res.setHeader(k, v as string);
          }
        });

        // 2. stream through the guard
        const guard = new ChunkGuard({
          byteLimit: 256 * 1024, // 256 kB
          tokenLimit: 16_000, // optional – take out if undesired
        });

        proxyRes.pipe(guard).pipe(res);
        return;
      }

      // -------------------------------------------------------- non‑stream JSON
      // Buffer the entire body → then you can mutate if you want.
      const bodyChunks: Buffer[] = [];
      proxyRes.on('data', (chunk: Buffer) => {
        bodyChunks.push(chunk);
        console.log(`📦 [DATA CHUNK] Received ${chunk.length} bytes`);
      });

      proxyRes.on('end', () => {
        const buf = Buffer.concat(bodyChunks);
        console.log(`📄 [RESPONSE END] Total ${buf.length} bytes received`);

        // Log response content based on type
        const responseString = buf.toString('utf8');
        if (ctype.includes('application/json')) {
          console.log(
            `📄 [JSON RESPONSE] ${responseString.substring(0, 1000)}${responseString.length > 1000 ? '...' : ''}`
          );
        } else if (ctype.includes('text/')) {
          console.log(
            `📝 [TEXT RESPONSE] ${responseString.substring(0, 500)}${responseString.length > 500 ? '...' : ''}`
          );
        }

        // example hard size check
        if (buf.length > 256 * 1024) {
          res.status(502).json({ error: 'Upstream response too large' });
          return;
        }

        // pipe straight through
        res.status(proxyRes.statusCode || 200);
        Object.entries(proxyRes.headers).forEach(
          ([k, v]) => v && res.setHeader(k, v)
        );
        res.end(buf);
      });
    },
  },
}) as unknown as (req: Request, res: Response, next: NextFunction) => void;

// mount the proxy (everything except /health)
app.use((req, res, next) =>
  req.path === '/health' ? next() : proxy(req, res, next)
);

app.listen(PORT, () => {
  console.log(`🚀 Reverse proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying all requests to: ${MCP_TARGET_URL}`);
  console.log(`\n📋 Usage Examples:`);
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`   SSE Endpoint: http://localhost:${PORT}/sse`);
  console.log(
    `   OAuth Discovery: http://localhost:${PORT}/.well-known/oauth-authorization-server`
  );
  console.log(
    `   Any Path: http://localhost:${PORT}/your-path -> ${MCP_TARGET_URL}/your-path`
  );
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down proxy server...');
  process.exit(0);
});
