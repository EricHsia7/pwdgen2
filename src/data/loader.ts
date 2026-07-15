export interface LoaderMessageProgress {
  type: 'progress';
  id: number;
  loaded: number;
  total: number;
  percent: number;
}

export interface LoaderMessageData {
  type: 'data';
  id: number;
  chunk: Uint8Array;
  final: boolean;
}

export interface LoaderMessageDone {
  type: 'done';
  id: number;
  loaded: number;
  total: number;
}

export interface LoaderMessageError {
  type: 'error';
  id: number;
  error: Error['message'];
}

export type LoaderMessage = LoaderMessageProgress | LoaderMessageData | LoaderMessageDone | LoaderMessageError;

export interface LoaderJob {
  resolve: Function;
  reject: Function;
  onProgress: Function;
  chunks: Array<Uint8Array>;
}

const worker = new Worker(new URL('./loader-worker.ts', import.meta.url));

let nextId: number = 0;
const pending = new Map<number, LoaderJob>();

worker.onmessage = (event: MessageEvent) => {
  const message = event.data as LoaderMessage;
  const job = pending.get(message.id);
  if (!job) return;

  switch (message.type) {
    case 'progress':
      job.onProgress?.(message);
      break;
    case 'data':
      job.chunks.push(message.chunk); // inflated Uint8Array
      break;
    case 'done':
      pending.delete(message.id);
      job.resolve(concatChunks(job.chunks));
      break;
    case 'error':
      pending.delete(message.id);
      job.reject(new Error(message.error));
      break;
  }
};

worker.onerror = (e) => console.error('Worker crashed:', e.message);

function concatChunks(chunks: Array<Uint8Array>): Uint8Array {
  const size = chunks.reduce((n, c) => n + c.length, 0);
  const result = new Uint8Array(size);
  let pos = 0;
  for (const chunk of chunks) {
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
}

/**
 * fetch a url, and inflate the response
 * @param url URL to fetch
 * @param onProgress function called on progress
 * @returns inflated Uint8Array
 */
export function fetchInflate(url: string, onProgress: (message: LoaderMessageProgress) => void): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, onProgress, chunks: [] });
    worker.postMessage({ id, url });
  });
}
