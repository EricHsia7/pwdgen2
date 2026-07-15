export class Random {
  counter: number;
  buffer: Uint32Array;
  size: number;

  constructor(size: number = 32) {
    const buffer = new Uint32Array(size);
    this.buffer = buffer;
    this.counter = 0;
    this.size = size;
  }

  pull() {
    const index = this.counter++ % (this.size - 1);
    if (index === 0) {
      const buffer = new Uint32Array(this.size);
      crypto.getRandomValues(buffer);
      this.buffer = buffer;
    }
    return this.buffer[index];
  }
}
