const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const publicDir = path.join(__dirname, '..', 'public');
    const src = path.join(publicDir, 'logo.png');
    const iconsDir = path.join(publicDir, 'icons');

    if (!fs.existsSync(src)) {
      console.error('Source logo not found at public/logo.png');
      process.exit(1);
    }
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir);
    }

    const sizes = [192, 512];

    for (const size of sizes) {
      const out = path.join(iconsDir, `icon-${size}.png`);
      await sharp(src)
        .resize(size, size, { fit: 'cover' })
        .png({ compressionLevel: 9, quality: 90 })
        .toFile(out);
      console.log(`Generated ${out}`);
    }

    console.log('Icons generated successfully.');
  } catch (e) {
    console.error('Failed to generate icons:', e);
    process.exit(1);
  }
})();
