import { Random } from './random';

export function shuffle<T>(array: Array<T>, size: number): Array<T> {
  const random = new Random();
  let index = -1;
  const length = array.length;
  const lastIndex = length - 1;
  size = size === undefined ? length : size;
  while (++index < size) {
    var rand = index + Math.floor(random.pull() * (lastIndex - index + 1));
    var value = array[rand];
    array[rand] = array[index];
    array[index] = value;
  }
  array.length = size;
  return array;
}
