const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Array of device data containing information about various devices and their dimensions
const deviceData = [
  { 'device': '12.9“ iPad Pro', 'width': 1024, 'height': 1366, 'scaled_width': 2048, 'scaled_height': 2732 },
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
  { 'device': 'iPod touch 5th generation and later', 'width': 320, 'height': 568, 'scaled_width': 640, 'scaled_height': 1136 }
]


// Array to store HTML code for the links to splash screen images
const htmlLinks = [];

// Function to process a single device image
async function processDeviceImage(deviceInfo, iconImage, backgroundImage) {
  const canvasWidth = deviceInfo.scaled_width;
  const canvasHeight = deviceInfo.scaled_height;
  const scale = deviceInfo.scaled_width / deviceInfo.width;
  const iconWidth = Math.max(canvasWidth * 0.57, 220);
  const fileName = (deviceInfo.device).toLocaleLowerCase().replace(/\s|\“/gm, "_") + '_@' + Math.round(scale) + 'x';

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Draw the background image onto the canvas
  ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

  // Draw the icon image in the center of the canvas
  ctx.drawImage(iconImage, canvasWidth / 2 - (iconWidth / 2), canvasHeight / 2 - iconWidth / 2, iconWidth, iconWidth);

  const outputFilePath = `dist/splash_screen/${fileName}.png`;

  const outputStream = fs.createWriteStream(outputFilePath);
  const pngStream = canvas.createPNGStream();
  pngStream.pipe(outputStream);

  // Wait for the image to finish writing, then add a link to the HTML links array
  await new Promise((resolve) => {
    outputStream.on('finish', () => {
      htmlLinks.push(`<link rel="apple-touch-startup-image" href="https://erichsia7.github.io/pwdgen2/dist/splash_screen/${fileName}.png" media="(device-width: ${deviceInfo.width}px) and (device-height: ${deviceInfo.height}px) and (-webkit-device-pixel-ratio: ${Math.round(scale)})">`);
      resolve();
    });
  });
}

// Function to process icon and background images for a single device
async function processImageFiles(deviceInfo) {
  const iconPath = 'icons/splash_screen_source/icon.png';
  const bgPath = 'icons/splash_screen_source/bg.png';
  const iconImage = await loadImage(iconPath);
  const backgroundImage = await loadImage(bgPath);
  await processDeviceImage(deviceInfo, iconImage, backgroundImage);
}

// Function to process images for all devices in the deviceData array
async function processImages() {
  for (const deviceInfo of deviceData) {
    await processImageFiles(deviceInfo);
  }
}

// Function to create the output directory for the splash screen images
async function createOutputDirectories() {
  const outputDir = 'dist/splash_screen';

  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
  } catch (err) {
    console.error('Error creating directories:', err);
  }
}

// Main asynchronous function to generate splash screen images and HTML file
(async () => {
  try {
    await createOutputDirectories();
    await processImages();
    fs.writeFileSync('dist/splash_screen/html.txt', htmlLinks.join('\n'));
    console.log('Images and HTML code generated successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
})();