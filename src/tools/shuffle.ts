export function shuffle<T>(array: Array<T>, size: number): Array<T> {
  let index = -1;
  const length = array.length;
  const lastIndex = length - 1;
  size = size === undefined ? length : size;
  while (++index < size) {
    var rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    var value = array[rand];
    array[rand] = array[index];
    array[index] = value;
  }
  array.length = size;
  return array;
}
