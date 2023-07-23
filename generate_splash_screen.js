const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

var data = [{ 'device': '12.9“ iPad Pro', 'width': 1024, 'height': 1366, 'scaled_width': 2048, 'scaled_height': 2732 },
{ 'device': '11“ iPad Pro', 'width': 834, 'height': 1194, 'scaled_width': 1668, 'scaled_height': 2388 },
{ 'device': '10.5“ iPad Pro', 'width': 834, 'height': 1194, 'scaled_width': 1668, 'scaled_height': 2388 },
{ 'device': '9.7“ iPad Pro', 'width': 768, 'height': 1024, 'scaled_width': 1536, 'scaled_height': 2048 },
{ 'device': '7.9“ iPad mini', 'width': 768, 'height': 1024, 'scaled_width': 1536, 'scaled_height': 2048 },
{ 'device': '10.5“ iPad Air', 'width': 834, 'height': 1112, 'scaled_width': 1668, 'scaled_height': 2224 },
{ 'device': '9.7“ iPad Air', 'width': 768, 'height': 1024, 'scaled_width': 1536, 'scaled_height': 2048 },
{ 'device': '10.2“ iPad', 'width': 810, 'height': 1080, 'scaled_width': 1620, 'scaled_height': 2160 },
{ 'device': '9.7“ iPad', 'width': 768, 'height': 1024, 'scaled_width': 1536, 'scaled_height': 2048 },
{ 'device': 'iPhone 14 Pro Max', 'width': 430, 'height': 932, 'scaled_width': 1290, 'scaled_height': 2796 },
{ 'device': 'iPhone 14 Pro', 'width': 393, 'height': 852, 'scaled_width': 1179, 'scaled_height': 2556 },
{ 'device': 'iPhone 14 Plus', 'width': 428, 'height': 926, 'scaled_width': 1284, 'scaled_height': 2778 },
{ 'device': 'iPhone 14', 'width': 390, 'height': 844, 'scaled_width': 1170, 'scaled_height': 2532 },
{ 'device': 'iPhone 13 Pro Max', 'width': 428, 'height': 926, 'scaled_width': 1284, 'scaled_height': 2778 },
{ 'device': 'iPhone 13 Pro', 'width': 390, 'height': 844, 'scaled_width': 1170, 'scaled_height': 2532 },
{ 'device': 'iPhone 13', 'width': 390, 'height': 844, 'scaled_width': 1170, 'scaled_height': 2532 },
{ 'device': 'iPhone 13 mini', 'width': 375, 'height': 812, 'scaled_width': 1125, 'scaled_height': 2436 },
{ 'device': 'iPhone 12 Pro Max', 'width': 428, 'height': 926, 'scaled_width': 1284, 'scaled_height': 2778 },
{ 'device': 'iPhone 12 Pro', 'width': 390, 'height': 844, 'scaled_width': 1170, 'scaled_height': 2532 },
{ 'device': 'iPhone 12', 'width': 390, 'height': 844, 'scaled_width': 1170, 'scaled_height': 2532 },
{ 'device': 'iPhone 12 mini', 'width': 375, 'height': 812, 'scaled_width': 1125, 'scaled_height': 2436 },
{ 'device': 'iPhone 11 Pro Max', 'width': 414, 'height': 896, 'scaled_width': 1242, 'scaled_height': 2688 },
{ 'device': 'iPhone 11 Pro', 'width': 375, 'height': 812, 'scaled_width': 1125, 'scaled_height': 2436 },
{ 'device': 'iPhone 11', 'width': 414, 'height': 896, 'scaled_width': 828, 'scaled_height': 1792 },
{ 'device': 'iPhone XS Max', 'width': 414, 'height': 896, 'scaled_width': 1242, 'scaled_height': 2688 },
{ 'device': 'iPhone XS', 'width': 375, 'height': 812, 'scaled_width': 1125, 'scaled_height': 2436 },
{ 'device': 'iPhone XR', 'width': 414, 'height': 896, 'scaled_width': 828, 'scaled_height': 1792 },
{ 'device': 'iPhone X', 'width': 375, 'height': 812, 'scaled_width': 1125, 'scaled_height': 2436 },
{ 'device': 'iPhone 8 Plus', 'width': 414, 'height': 736, 'scaled_width': 1080, 'scaled_height': 1920 },
{ 'device': 'iPhone 8', 'width': 375, 'height': 667, 'scaled_width': 750, 'scaled_height': 1334 },
{ 'device': 'iPhone 7 Plus', 'width': 414, 'height': 736, 'scaled_width': 1080, 'scaled_height': 1920 },
{ 'device': 'iPhone 7', 'width': 375, 'height': 667, 'scaled_width': 750, 'scaled_height': 1334 },
{ 'device': 'iPhone 6s Plus', 'width': 414, 'height': 736, 'scaled_width': 1080, 'scaled_height': 1920 },
{ 'device': 'iPhone 6s', 'width': 375, 'height': 667, 'scaled_width': 750, 'scaled_height': 1334 },
{ 'device': 'iPhone 6 Plus', 'width': 414, 'height': 736, 'scaled_width': 1080, 'scaled_height': 1920 },
{ 'device': 'iPhone 6', 'width': 375, 'height': 667, 'scaled_width': 750, 'scaled_height': 1334 },
{ 'device': '4.7“ iPhone SE', 'width': 375, 'height': 667, 'scaled_width': 750, 'scaled_height': 1334 },
{ 'device': '4“ iPhone SE', 'width': 320, 'height': 568, 'scaled_width': 640, 'scaled_height': 1136 },
{ 'device': 'iPod touch 5th generation and later', 'width': 320, 'height': 568, 'scaled_width': 640, 'scaled_height': 1136 }]


const html_arr = [];

async function processImage(f, icon_image, bg_image) {
  const cw = f.scaled_width;
  const ch = f.scaled_height;
  const scale = f.scaled_width / f.width;
  const iw = Math.max(cw * 0.5897, 220);
  const name = (f.device).toLocaleLowerCase().replace(/\s|\“/gm, "_") + '_@' + Math.round(scale) + 'x';

  const canvas = createCanvas(cw, ch);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bg_image, 0, 0, cw, ch);

  ctx.drawImage(icon_image, cw / 2 - (iw / 2), ch / 2 - iw / 2, iw, iw);

  const outputFilePath = `dist/splash_screen/${name}.png`;

  const out = fs.createWriteStream(outputFilePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  await new Promise((resolve) => {
    out.on('finish', () => {
      html_arr.push(`<link rel="apple-touch-startup-image" href="https://erichsia7.github.io/pwdgen2/dist/splash_screen/${name}.png" media="(device-width: ${f.width}px) and (device-height: ${f.height}px) and (-webkit-device-pixel-ratio: ${Math.round(scale)})">`);
      resolve();
    });
  });
}

async function processImageFiles(f) {
  const icon_path = 'pwaicon8/transparent.png';
  const bg_path = 'pwaicon8/bg.png';
  const icon_image = await loadImage(icon_path);
  const bg_image = await loadImage(bg_path);
  await processImage(f, icon_image, bg_image);
}

async function processImages() {
  for (const f of data) {
    await processImageFiles(f);
  }
}

async function createOutputDirectories() {
  const outputDir = 'dist/splash_screen';

  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
  } catch (err) {
    console.error('Error creating directories:', err);
  }
}

(async () => {
  try {
    await createOutputDirectories();
    await processImages();
    fs.writeFileSync('dist/splash_screen/html.txt', html_arr.join('\n'));
    console.log('Images and HTML file generated successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
})();