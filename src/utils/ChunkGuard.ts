import { Transform, TransformCallback } from 'stream';

interface GuardOpts {
  byteLimit: number; // e.g. 256 * 1024
  tokenLimit?: number; // e.g. 16_000   (optional)
}

export class ChunkGuard extends Transform {
  private bytesSeen = 0;
  private tokensSeen = 0;
  private readonly opt: GuardOpts;

  constructor(opt: GuardOpts) {
    super();
    this.opt = opt;
  }

  override _transform(
    chunk: Buffer,
    _: BufferEncoding,
    cb: TransformCallback
  ): void {
    this.bytesSeen += chunk.length;

    // Log the SSE chunk for debugging
    const chunkString = chunk.toString('utf8');
    console.log(
      `📡 [SSE CHUNK] ${this.bytesSeen} bytes total: ${chunkString.substring(0, 500)}${chunkString.length > 500 ? '...' : ''}`
    );

    if (this.opt.tokenLimit) {
      // Simple approximation: 4 characters = 1 token
      const str = chunk.toString('utf8');
      const dataLines = str
        .split('\n')
        .filter((l: string) => l.startsWith('data:'))
        .map((l: string) => l.slice(5).trim());
      for (const line of dataLines) {
        this.tokensSeen += Math.ceil(line.length / 4);
      }
      console.log(
        `🔢 [TOKEN COUNT] ${this.tokensSeen} tokens seen so far (4 chars = 1 token)`
      );
    }

    if (
      this.bytesSeen > this.opt.byteLimit ||
      (this.opt.tokenLimit &&
        this.tokensSeen > (this.opt.tokenLimit ?? Infinity))
    ) {
      console.log(
        `⚠️ [TRUNCATED] Stream truncated at ${this.bytesSeen} bytes, ${this.tokensSeen} tokens`
      );
      // Push one last well‑formed SSE message so the client knows why it closed
      const msg = `event: error\ndata: {"reason":"truncated by proxy"}\n\n`;
      this.push(msg);
      this.destroy(); // closes the stream towards the client
      return cb(); // we're done
    }

    this.push(chunk);
    cb();
  }

  override _destroy(
    err: Error | null,
    cb: (error?: Error | null) => void
  ): void {
    cb(err);
  }
}
