/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { Decompress } from 'fflate';
import { LoaderMessageData, LoaderMessageDone, LoaderMessageError, LoaderMessageProgress } from './loader';

self.onmessage = function (event: MessageEvent): void {
  const { id, url } = event.data;
  streamInflate(id, url).catch((error: Error) => self.postMessage({ id, type: 'error', error: error.message } as LoaderMessageError));
};

async function streamInflate(id: number, url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.body) throw new Error('No response body to stream');

  const total = parseInt(String(response.headers.get('content-length')), 10);
  let loaded: number = 0;

  const inflater = new Decompress();

  inflater.ondata = (chunk, final) => {
    // slice() -> own the exact bytes so transferring the buffer is safe.
    // (fflate may hand back a view into a larger internal buffer.)
    const output = chunk.slice();
    self.postMessage({ id, type: 'data', chunk: output, final } as LoaderMessageData, [output.buffer]);
  };

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    loaded += value.length;
    inflater.push(value, false); // feed compressed bytes incrementally

    self.postMessage({
      id,
      type: 'progress',
      loaded,
      total,
      percent: total ? loaded / total : -1
    } as LoaderMessageProgress);
  }

  inflater.push(new Uint8Array(0), true); // final = true -> flush the tail
  self.postMessage({ id, type: 'done', loaded, total } as LoaderMessageDone);
}
