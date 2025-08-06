import { IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
import { ChunkGuard } from './ChunkGuard';

const proxyCache = new Map<
  string,
  (req: Request, res: Response, next: NextFunction) => void
>();

export const createOrGetProxy = (
  MCP_TARGET_URL: string
): ((req: Request, res: Response, next: NextFunction) => void) => {
  // Check cache first - Map.get() returns undefined if key doesn't exist
  const cachedProxy = proxyCache.get(MCP_TARGET_URL);
  if (cachedProxy) {
    return cachedProxy;
  }

  // Create new proxy if not cached
  const proxy = createProxyMiddleware({
    target: MCP_TARGET_URL,
    changeOrigin: true,
    secure: true,
    selfHandleResponse: true, // << important
    // pathRewrite: () => cleanUrl, // Use the clean URL without mcp_server_id
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

  proxyCache.set(MCP_TARGET_URL, proxy);
  return proxy;
};
