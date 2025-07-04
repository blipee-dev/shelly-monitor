// This script generates placeholder icons for the PWA
// In production, replace these with actual designed icons

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgIcon = `
<svg width="{size}" height="{size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#1976d2"/>
  <circle cx="50" cy="35" r="20" fill="#ffffff"/>
  <rect x="30" y="55" width="40" height="30" rx="5" fill="#ffffff"/>
  <circle cx="40" cy="70" r="5" fill="#1976d2"/>
  <circle cx="60" cy="70" r="5" fill="#1976d2"/>
  <text x="50" y="90" font-family="Arial, sans-serif" font-size="8" fill="#ffffff" text-anchor="middle">Shelly</text>
</svg>
`;

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate placeholder message
console.log('Generating placeholder PWA icons...');
console.log('Note: Replace these with actual designed icons for production!');

// Create a placeholder text file
fs.writeFileSync(
  path.join(iconsDir, 'PLACEHOLDER_ICONS.txt'),
  `These are placeholder icons generated for PWA functionality.
Please replace with actual designed icons before production deployment.

Icon requirements:
- Should include Shelly Monitor branding
- Use Material Design 3 color scheme
- Should work well on various backgrounds
- Consider using adaptive icons for Android

Recommended tools:
- Figma or Sketch for design
- https://maskable.app/ for maskable icon testing
- https://www.pwabuilder.com/imageGenerator for generating all sizes
`
);

console.log('✓ Icon placeholder instructions created');
console.log('  Location: public/icons/PLACEHOLDER_ICONS.txt');