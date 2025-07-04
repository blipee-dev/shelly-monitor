import { lightTheme, darkTheme } from '../src/lib/theme/theme';
import { lightColorScheme, darkColorScheme } from '../src/lib/theme/colors';

console.log('🎨 Testing Material Design 3 Theme Configuration\n');

// Test light theme
console.log('Light Theme:');
console.log('- Primary:', lightTheme.palette.primary.main);
console.log('- Secondary:', lightTheme.palette.secondary.main);
console.log('- Background:', lightTheme.palette.background.default);
console.log('- Surface levels:', Object.keys(lightColorScheme).filter(k => k.includes('surface')).length);

console.log('\nDark Theme:');
console.log('- Primary:', darkTheme.palette.primary.main);
console.log('- Secondary:', darkTheme.palette.secondary.main);  
console.log('- Background:', darkTheme.palette.background.default);
console.log('- Surface levels:', Object.keys(darkColorScheme).filter(k => k.includes('surface')).length);

// Test typography
console.log('\nTypography Variants:');
const typographyKeys = Object.keys(lightTheme.typography).filter(k => 
  !['fontFamily', 'fontSize', 'fontWeightLight', 'fontWeightRegular', 'fontWeightMedium', 'fontWeightBold', 'htmlFontSize', 'pxToRem'].includes(k)
);
console.log('- Total variants:', typographyKeys.length);
console.log('- MD3 variants:', typographyKeys.filter(k => 
  k.includes('display') || k.includes('headline') || k.includes('title') || k.includes('body') || k.includes('label')
).length);

// Test component overrides
console.log('\nComponent Overrides:');
console.log('- Total components styled:', Object.keys(lightTheme.components || {}).length);

console.log('\n✅ Theme configuration test complete!');