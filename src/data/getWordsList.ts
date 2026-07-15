import { fetchInflate } from './loader';

export type WordsList = Array<string>;

export async function getWordsList(): Promise<WordsList> {
  const data = await fetchInflate('./words-list/index.gz', function () {});
  const decoder = new TextDecoder();
  const text = decoder.decode(data);
  return text.split(/\n/g);
}
