const fs = require('fs');
const path = require('path');

// Create a simple colored square as base64 PNG for placeholder icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Simple 1x1 blue pixel PNG
const bluePixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

sizes.forEach(size => {
  const iconPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`);
  
  // For now, create empty files - in production you'd generate actual icons
  fs.writeFileSync(iconPath, Buffer.from(bluePixelBase64, 'base64'));
  console.log(`Created placeholder icon: ${iconPath}`);
});

console.log('Placeholder icons created successfully');