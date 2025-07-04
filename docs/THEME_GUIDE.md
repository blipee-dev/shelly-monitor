# Material Design 3 Theme Guide

This guide explains how to use and customize the Material Design 3 theme system in Shelly Monitor.

## Overview

Shelly Monitor implements a comprehensive Material Design 3 (Material You) theme system with:
- Complete MD3 color system
- Typography scale following MD3 guidelines
- Custom components with MD3 styling
- Light/dark theme support with system preference detection
- Theme persistence across sessions

## Using the Theme

### Theme Provider

The application is wrapped with our custom `ThemeProvider` that manages theme state:

```tsx
// Already configured in app/layout.tsx
<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

### Accessing Theme in Components

Use the `useTheme` hook to access theme state and controls:

```tsx
import { useTheme } from '@/lib/theme/ThemeProvider';

function MyComponent() {
  const { mode, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      Current theme: {mode}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Using Material UI Components

All Material UI components automatically use our MD3 theme:

```tsx
import { Button, TextField, Card } from '@mui/material';

function MyForm() {
  return (
    <Card>
      <TextField label="Name" variant="outlined" />
      <Button variant="contained">Submit</Button>
    </Card>
  );
}
```

## Custom Components

### Card Component

Our custom Card component provides MD3-style variants:

```tsx
import { Card } from '@/components/ui';

// Elevated card (default)
<Card variant="elevated">
  <CardContent>Elevated content</CardContent>
</Card>

// Filled card
<Card variant="filled">
  <CardContent>Filled content</CardContent>
</Card>

// Outlined card
<Card variant="outlined">
  <CardContent>Outlined content</CardContent>
</Card>

// Interactive card
<Card variant="elevated" interactive>
  <CardContent>Clickable card</CardContent>
</Card>
```

### Surface Component

Surface provides MD3 elevation levels:

```tsx
import { Surface } from '@/components/ui';

// Surface with different elevation levels (0-5)
<Surface level={0}>Base level</Surface>
<Surface level={1}>Level 1</Surface>
<Surface level={2}>Level 2</Surface>
<Surface level={3}>Level 3</Surface>
<Surface level={4}>Level 4</Surface>
<Surface level={5}>Highest level</Surface>
```

### NavigationRail Component

Responsive navigation following MD3 guidelines:

```tsx
import { NavigationRail } from '@/components/ui';
import { Home, Settings, Notifications } from '@mui/icons-material';

const navItems = [
  { id: 'home', label: 'Home', icon: <Home /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
  { id: 'alerts', label: 'Alerts', icon: <Notifications />, badge: 3 },
];

<NavigationRail
  items={navItems}
  activeId="home"
  expanded={true}
  onItemClick={(id) => console.log('Clicked:', id)}
  header={<Logo />}
  footer={<ThemeToggle />}
/>
```

### FAB Component

Floating Action Button with MD3 styling:

```tsx
import { FAB } from '@/components/ui';
import { Add } from '@mui/icons-material';

// Standard FAB
<FAB variant="primary">
  <Add />
</FAB>

// Extended FAB
<FAB variant="secondary" extended>
  <Add sx={{ mr: 1 }} />
  Add Device
</FAB>

// Different variants
<FAB variant="tertiary">...</FAB>
<FAB variant="surface">...</FAB>
```

## Typography

Use MD3 typography variants:

```tsx
import { Typography } from '@mui/material';

// Display styles
<Typography variant="displayLarge">Display Large</Typography>
<Typography variant="displayMedium">Display Medium</Typography>
<Typography variant="displaySmall">Display Small</Typography>

// Headlines
<Typography variant="headlineLarge">Headline Large</Typography>
<Typography variant="headlineMedium">Headline Medium</Typography>
<Typography variant="headlineSmall">Headline Small</Typography>

// Titles
<Typography variant="titleLarge">Title Large</Typography>
<Typography variant="titleMedium">Title Medium</Typography>
<Typography variant="titleSmall">Title Small</Typography>

// Body text
<Typography variant="bodyLarge">Body Large</Typography>
<Typography variant="bodyMedium">Body Medium</Typography>
<Typography variant="bodySmall">Body Small</Typography>

// Labels
<Typography variant="labelLarge">Label Large</Typography>
<Typography variant="labelMedium">Label Medium</Typography>
<Typography variant="labelSmall">Label Small</Typography>
```

## Color System

### Accessing Colors

Use the theme object to access MD3 colors:

```tsx
import { useTheme } from '@mui/material/styles';

function ColorExample() {
  const theme = useTheme();
  
  return (
    <Box sx={{
      backgroundColor: theme.palette.primary.container,
      color: theme.palette.primary.onContainer,
      // Surface levels
      background: theme.palette.background.surfaceContainerHigh,
      // Tertiary colors
      borderColor: theme.palette.tertiary.main,
    }}>
      MD3 Colors
    </Box>
  );
}
```

### Color Tokens

Available color tokens:
- `primary`, `secondary`, `tertiary`, `error`
- Each has: `main`, `container`, `onContainer`
- Surface levels: `surfaceContainerLowest` through `surfaceContainerHighest`
- `outline`, `outlineVariant`
- `surfaceVariant`, `onSurfaceVariant`

## Dark Mode

### Theme Toggle Component

Use the pre-built theme toggle:

```tsx
import { ThemeToggle } from '@/components/theme/ThemeToggle';

<ThemeToggle size="medium" />
```

### Programmatic Theme Control

```tsx
const { mode, setTheme } = useTheme();

// Force light mode
setTheme('light');

// Force dark mode
setTheme('dark');

// Check current mode
if (mode === 'dark') {
  // Dark mode specific logic
}
```

### Feature Flag Control

Dark mode can be controlled via feature flag:

```tsx
// Dark mode is only available when DARK_MODE feature flag is enabled
// Check in settings or feature flags panel
```

## Responsive Design

### Breakpoints

Use MUI's responsive helpers:

```tsx
import { useMediaQuery, useTheme } from '@mui/material';

function ResponsiveComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <Box sx={{
      padding: {
        xs: 2,  // mobile
        sm: 3,  // tablet
        md: 4,  // desktop
      },
      fontSize: {
        xs: 'body2.fontSize',
        md: 'body1.fontSize',
      },
    }}>
      Responsive content
    </Box>
  );
}
```

## Best Practices

1. **Use Theme Colors**: Always use theme colors instead of hardcoded values
2. **Semantic Variants**: Use appropriate typography variants for content hierarchy
3. **Surface Levels**: Use surface levels to create visual depth
4. **Responsive**: Design mobile-first using breakpoints
5. **Accessibility**: Ensure sufficient color contrast in both themes

## Customization

### Extending the Theme

To add custom theme properties:

```tsx
// In src/lib/theme/theme.ts
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      myProperty: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      myProperty?: string;
    };
  }
}
```

### Creating New Components

Follow the pattern of existing custom components:

```tsx
import { styled } from '@mui/material/styles';

export const MyCustomComponent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.surface,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  // MD3 styling...
}));
```

## Examples

### Complete Page Example

```tsx
'use client';

import { Container, Typography, Stack } from '@mui/material';
import { Surface, Card, FAB } from '@/components/ui';
import { Add } from '@mui/icons-material';

export default function ExamplePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Surface level={1}>
          <Typography variant="headlineLarge">
            Page Title
          </Typography>
        </Surface>
        
        <Card variant="elevated">
          <Typography variant="bodyLarge">
            Card content with MD3 styling
          </Typography>
        </Card>
      </Stack>
      
      <FAB
        variant="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </FAB>
    </Container>
  );
}
```

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [MUI Documentation](https://mui.com/material-ui/)
- Theme Demo: `/theme-demo` (when running locally)
- Color Scheme: See `src/lib/theme/colors.ts`
- Typography: See `src/lib/theme/typography.ts`