const fs = require('fs');
const path = require('path');

// Simple SVG icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0061a4"/>
  <text x="256" y="256" font-family="Arial, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">S</text>
</svg>`;

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Save SVG
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

// For now, create a simple colored square as PNG placeholder
// In production, you'd use a proper image generation library
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating placeholder PWA icons...');

// Create a simple base64 PNG (blue square with white "S")
// This is a 16x16 base that we'll reference for all sizes
const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB9SURBVDiNY2AYBYMTMDIwMPxnYGD4z0ABYGJgYGBkYGBgpNgARgYGBsb///8zUs4CBgYGBob/DAyUs4CBgYGBiYGBgZFiFjBSDQLG////M1LMAkYGBgZGRgYGRopZwEgNCxgZqGcBI/UsYKSeBYyMDAwMjNSwgBFZHAwBAG9pERSgVZcnAAAAAElFTkSuQmCC';

sizes.forEach(size => {
  const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
  // For now, just copy the same base64 image to all sizes
  // In production, you'd properly resize the image
  fs.writeFileSync(filename, Buffer.from(base64PNG, 'base64'));
  console.log(`Created ${filename}`);
});

console.log('PWA icons created successfully!');
console.log('Note: These are placeholder icons. Replace with proper icons for production.');