// Test script to understand MUI error code 9
// Based on https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/formatMuiErrorMessage/formatMuiErrorMessage.ts

// MUI Error codes mapping (approximate based on common errors)
const muiErrors = {
  1: 'Invalid `children` supplied to `%s`. Expected an element that can hold a ref.',
  2: 'Cannot read the getChildContext() method on a component instance.',
  3: 'It looks like there are several instances of Material-UI.',
  4: 'Invalid property `%s` supplied to `%s`.',
  5: 'The `component` prop provided to %s is invalid.',
  6: 'Expected valid input target.',
  7: 'You must provide a `render` method.',
  8: 'The Grid `item` prop is deprecated.',
  9: 'Invalid size `%s` was used in the theme.'
};

// Error code 9 with argument "0%"
console.log('MUI Error Code 9:');
console.log(muiErrors[9]);
console.log('\nWith argument "0%":');
console.log(muiErrors[9].replace('%s', '0%'));
console.log('\nThis error typically occurs when:');
console.log('1. A Grid component has an invalid size prop value like "0%"');
console.log('2. Grid v2 size prop expects numeric values (0-12) or breakpoint objects, not percentage strings');
console.log('3. Legacy Grid syntax is being used with the new Grid v2 component');