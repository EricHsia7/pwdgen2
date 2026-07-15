const { gzipSync, decompressSync } = require('fflate');
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const data = await fs.promises.readFile('./index.txt', {
    encoding: 'utf-8'
  });
  const encoder = new TextEncoder();
  const compressedData = gzipSync(encoder.encode(data));
  await fs.promises.writeFile('./index.gz', Buffer.from(compressedData));
}

main();

async function test() {
  const compressedData = await fs.promises.readFile('./index.gz');
  const data = decompressSync(compressedData);
  const decoder = new TextDecoder();
  const text = decoder.decode(data);
  console.log(text);
}

// test();
