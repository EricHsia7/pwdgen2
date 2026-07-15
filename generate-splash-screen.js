const { Resvg } = require('@resvg/resvg-js');
const { Jimp } = require('jimp');
const md5 = require('md5');

const { shortenHex } = require('./shorten-hex');
const { writeTextFile, makeDirectory } = require('./files');

const deviceData = require('./splash-screen-device-data.json');

const assetName = 'splash-screen';
const outputDir = `./dist/${assetName}`;

async function rasterize(svgText, outputPath, width, height, scale) {
  const svg = Buffer.from(svgText, 'utf-8');
  const options = {
    fitTo: {
      mode: 'width',
      value: width * scale
    }
  };
  const resvg = new Resvg(svg, options);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const resizedImage = await Jimp.fromBuffer(pngBuffer);
  resizedImage.resize({ w: width, h: height });
  await resizedImage.write(outputPath);
}

function getSVGText(width, height) {
  const iconSize = Math.max(Math.min(width * 0.45, 160), 50);
  return `<svg stroke-miterlimit="10" style="fill-rule: nonzero; clip-rule: evenodd; stroke-linecap: round; stroke-linejoin: round" version="1.1" viewBox="0 0 ${width} ${height}" xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect x="0" y="0" width="${width}" height="${height}" fill="#24aff5" />
  <g width="64" height="64" transform="translate(${width / 2 - iconSize / 2} ${height / 2 - iconSize / 2}) scale(${iconSize / 64} ${iconSize / 64})">
  
  </g>
</svg>`;
}

async function main() {
  const outputDirCreation = await makeDirectory(outputDir);
  if (outputDirCreation === 1) {
    const htmlLinks = [];
    const map = new Map();
    for (const deviceInfo of deviceData.data) {
      const width = deviceInfo.width;
      const height = deviceInfo.height;
      const scale = deviceInfo.scale;

      const fileName = shortenHex(md5(`${width}x${height}@${scale}x`)).substring(0, 5);
      if (!map.has(fileName)) {
        map.set(fileName, true);
        const svgText = getSVGText(width, height);
        const outputFilePath = `${outputDir}/${fileName}.png`;
        await rasterize(svgText, outputFilePath, width * scale, height * scale, 2); // supersampling: 2x
        htmlLinks.push(`<link rel="apple-touch-startup-image" href="./${assetName}/${fileName}.png" media="(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${scale})"/>`);
      }
      console.log(`\x1b[32mSuccessfully\x1b[0m generated splash screen for \x1b[1m${deviceInfo.name}\x1b[0m.`);
    }
    await writeTextFile(`${outputDir}/html.json`, JSON.stringify({ html: htmlLinks.join('\n') }));
    console.log('\x1b[32mSuccessfully\x1b[0m generated splash screens and HTML code.');
  } else if (outputDirCreation === 0) {
    console.log('Using \x1b[1mcached\x1b[0m splash screens and HTML code.');
  } else {
    process.exit(1);
  }
  process.exit(0);
}

main();
