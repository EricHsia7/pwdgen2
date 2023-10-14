// Import required functions
import fine_grained_password from './fine-grained-password';
var aesjs = require('aes-js');

function isValidURL(url: string) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/.*)?$/;
  return regex.test(url);
}

function encryptString(string) {
  var initialization_vector_pattern = [
    {
      type: 'regex',
      regex: '/[1-9]/g',
      quantity: 1,
      repeat: false
    },
    {
      type: 'group',
      group: [
        {
          type: 'regex',
          regex: '/[0-9]/g',
          quantity: 9,
          repeat: true
        }
      ],
      actions: ['shuffle']
    }
  ];
  var initialization_vector = parseInt(fine_grained_password.generate(initialization_vector_pattern, 'production'));
  var keyu = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  var textBytes = aesjs.utils.utf8.toBytes(string);
  var aesCtr = new aesjs.ModeOfOperation.ctr(keyu, new aesjs.Counter(initialization_vector));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return [encryptedHex, initialization_vector];
}

function decryptString(encrypted_string, initialization_vector) {
  var keye = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  var encryptedBytese = aesjs.utils.hex.toBytes(encrypted_string);
  var aesCtre = new aesjs.ModeOfOperation.ctr(keye, new aesjs.Counter(parseInt(initialization_vector)));
  var decryptedBytese = aesCtre.decrypt(encryptedBytese);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytese);
  return decryptedText;
}
function enur(u) {
  return encodeURIComponent(u);
}
function deur(u) {
  return decodeURIComponent(u);
}

function gid(n) {
  var genidchars = '0123456789abcdefghijklmnopqrstuvwxyz';
  var genid = '';
  for (var i = 0; i < 16; i++) {
    var genrandomNumber = Math.floor(Math.random() * genidchars.length);
    genid += genidchars.substring(genrandomNumber, genrandomNumber + 1);
  }
  if (!(n === undefined)) {
    n = n.replaceAll('_', '-');
    return n + '-' + genid + '' + new Date().getTime();
  }
  return genid + '' + new Date().getTime();
}

function shuffleSelf(array: object, size: number) {
  var index = -1;
  var length = array.length;
  var lastIndex = length - 1;
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

function che(y: number) {
  if (y < 10) {
    return '0' + y;
  } else {
    return y;
  }
}

function timestr(date: Date) {
  return date.getFullYear() + '-' + che(date.getMonth() + 1) + '-' + che(date.getDate()) + ' ' + che(date.getHours()) + ':' + che(date.getMinutes()) + ':' + che(date.getSeconds());
}

function checkTouchFeatures(): boolean {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    return true;
  } else {
    return false;
  }
}

function qe(selector) {
  var elt = document.querySelector(selector);
  if (elt === null) {
    elt = document.createElement('div');
  }
  return elt;
}

function qeAll(selector) {
  return document.querySelectorAll(selector);
}

function copyProperty(source: HTMLElement, target: HTMLElement, property: string): void {
  target.style.setProperty(property, source.style.getPropertyValue(property));
}

function unicode_arr(str) {
  var str_len = str.length;
  var unicode_arr = [];
  for (var t = 0; t < str_len; t++) {
    var unicode = str.charCodeAt(t);
    if (!(unicode_arr.indexOf(unicode) > -1)) {
      unicode_arr.push(unicode);
    }
  }
  return unicode_arr;
}

function jaroWinklerDistance(str1, str2) {
  var len1 = str1.length;
  var len2 = str2.length;
  var matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  var matches1 = new Array(len1).fill(false);
  var matches2 = new Array(len2).fill(false);
  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < len1; i++) {
    var start = Math.max(0, i - matchDistance);
    var end = Math.min(i + matchDistance + 1, len2);

    for (let j = start; j < end; j++) {
      if (!matches2[j] && str1[i] === str2[j]) {
        matches1[i] = true;
        matches2[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) {
    return 0;
  }

  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (matches1[i]) {
      while (!matches2[k]) {
        k++;
      }
      if (str1[i] !== str2[k]) {
        transpositions++;
      }
      k++;
    }
  }

  var similarity = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
  var prefix = 0;
  while (str1[prefix] === str2[prefix] && prefix < 4) {
    prefix++;
  }

  var weight = 0.1;
  return similarity + prefix * weight * (1 - similarity);
}

function gethashtags(str, k) {
  var hashtag_regex = /\B#([a-z0-q9]{2,})(?![~!@#$%^&*()=+_`\-\|\\/'\[\]\{\}]|[?.,]*\w)/g;
  var hashtags = str.match(hashtag_regex);
  var hashtags_norepeat = [];
  if (hashtags === null) {
    return [];
  }
  var hashtags_len = hashtags.length;
  for (var w = 0; w < hashtags_len; w++) {
    if (!(hashtags_norepeat.indexOf(hashtags[w]) > -1)) {
      hashtags_norepeat.push(hashtags[w]);
    }
  }
  if (k) {
    for (var s = 0; s < hashtags_norepeat.length; s++) {
      var hashtagkey = String(hashtags_norepeat[s]).replaceAll('#', '').toLowerCase();
      allhashtag[hashtagkey] = hashtags_norepeat[s];
    }
  }
  return hashtags_norepeat;
}

function fetchWithProgress(url, progressCallback) {
  return new Promise((resolve, reject) => {
    // Fetch the URL using the Fetch API
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        const contentLength = Number(response.headers.get('Content-Length'));
        const reader = response.body.getReader();
        var receivedBytes = 0;
        const decoder = new TextDecoder();
        var textContent = '';
        function read() {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                resolve(textContent);
                return;
              }
              receivedBytes += value.length;
              const progress = (receivedBytes / 85878) * 100;
              progressCallback(progress);
              const chunk = decoder.decode(value, { stream: true });
              textContent += chunk;
              read();
            })
            .catch((error) => {
              reject(error);
            });
        }
        read();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function encodeSignsToHtmlEntities(html: string) {
  return html.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
}

function isDarkMode(): boolean {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  } else {
    return false;
  }
}

function hsvToRgb(h, s, v) {
  // Normalize values
  h /= 360;
  s /= 100;
  v /= 100;

  let r, g, b;

  if (s === 0) {
    // If saturation is 0, the color is a shade of gray
    r = g = b = v;
  } else {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
  }

  // Convert RGB values to the range of 0-255
  const rgb = {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };

  return rgb;
}

function randomColorSet() {
  var randomIntInRange = function (min, max) {
    return Math.max(Math.min(Math.round(min + (max - min) * Math.random()), max), min);
  };

  var h = randomIntInRange(0, 360);
  var f = function (v: number, a: number) {
    var hsv_text = { h: h, s: 67, v: v };
    var hsv_bg = { h: h, s: 100, v: v };
    var rgb_text = hsvToRgb(hsv_text.h, hsv_text.s, hsv_text.v);
    var rgb_bg = hsvToRgb(hsv_bg.h, hsv_bg.s, hsv_bg.v);
    var text = { r: rgb_text.r, g: rgb_text.g, b: rgb_text.b, a: 1, str: `rgba(${rgb_text.r},${rgb_text.g},${rgb_text.b},${1})` };
    var bg = { r: rgb_bg.r, g: rgb_bg.g, b: rgb_bg.b, a: a, str: `rgba(${rgb_bg.r},${rgb_bg.g},${rgb_bg.b},${a})` };
    return { text, bg };
  };
  return { light: f(75, 0.06), dark: f(100, 0.11) };
}

function blendColors(hexColor, rgbaColor) {
  var hexToRGBA = function (hex, alpha) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const rgba: Array = rgbaColor
    .substring(5, rgbaColor.length - 1)
    .split(',')
    .map((f) => parseFloat(String(f).trim()));
  const r: number = rgba[0];
  const g: number = rgba[1];
  const b: number = rgba[2];
  const alpha: number = rgba[3];

  const blendedR: number = Math.round((1 - alpha) * parseInt(hexColor.substring(1, 3), 16) + alpha * r);
  const blendedG: number = Math.round((1 - alpha) * parseInt(hexColor.substring(3, 5), 16) + alpha * g);
  const blendedB: number = Math.round((1 - alpha) * parseInt(hexColor.substring(5, 7), 16) + alpha * b);

  return `#${blendedR.toString(16).padStart(2, '0')}${blendedG.toString(16).padStart(2, '0')}${blendedB.toString(16).padStart(2, '0')}`;
}

// Expose functions to the global scope
window.utilities = {
  encryptString,
  decryptString,
  enur,
  deur,
  gid,
  shuffleSelf,
  che,
  timestr,
  checkTouchFeatures,
  qe,
  qeAll,
  copyProperty,
  unicode_arr,
  jaroWinklerDistance,
  gethashtags,
  fetchWithProgress,
  hsvToRgb,
  randomColorSet,
  isDarkMode,
  blendColors,
  encodeSignsToHtmlEntities,
  isValidURL
};

export default window.utilities;
