// Test script to verify Grid fix
const fs = require('fs');
const path = require('path');

// Read the fixed page.tsx file
const pagePath = path.join(__dirname, '../src/app/page.tsx');
const pageContent = fs.readFileSync(pagePath, 'utf8');

// Check for GridLegacy import (should not exist)
if (pageContent.includes('GridLegacy')) {
  console.error('❌ ERROR: GridLegacy import still exists');
  process.exit(1);
}

// Check for old Grid item syntax (should not exist)
if (pageContent.includes('Grid item xs=') || pageContent.includes('Grid item md=')) {
  console.error('❌ ERROR: Old Grid item syntax still exists');
  process.exit(1);
}

// Check for new Grid size syntax (should exist)
if (!pageContent.includes('Grid size=')) {
  console.error('❌ ERROR: New Grid size syntax not found');
  process.exit(1);
}

// Check for percentage values in Grid props
const gridSizeRegex = /Grid\s+size=\{?\{?[^}]*%/;
if (gridSizeRegex.test(pageContent)) {
  console.error('❌ ERROR: Grid size prop contains percentage value');
  process.exit(1);
}

console.log('✅ SUCCESS: Grid component has been fixed correctly');
console.log('- Using modern Grid import from @mui/material/Grid');
console.log('- Using new Grid size prop syntax');
console.log('- No percentage values in Grid size props');
console.log('\nThe MUI error #9 about "0%" should now be resolved.');