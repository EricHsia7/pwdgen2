const crypto = require('crypto');

class Hasher {
  constructor() {
    this.hash = crypto.createHash('sha256');
  }

  update(data) {
    if (data === undefined || data === null) return this;
    this.hash.update(data);
    return this;
  }

  digest() {
    return this.hash.digest('hex');
  }
}

module.exports = {
  Hasher
};
