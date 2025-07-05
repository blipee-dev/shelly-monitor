# Blipee OS Design System

## Overview
Blipee OS uses a sophisticated dark-first design system that emphasizes AI intelligence, sustainability, and enterprise-grade functionality. The design language combines glassmorphism, dynamic gradients, and Material Design 3 principles.

## Core Design Principles

### 1. AI-First Visual Language
- Conversational interfaces as primary interaction
- Predictive elements with visual confidence indicators
- Autonomous operations represented through animations
- Intelligence visualization through gradients and glows

### 2. Dark Theme Foundation
```css
/* Base colors */
--background-primary: #000000;
--background-secondary: rgba(255, 255, 255, 0.03);
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.7);
--text-tertiary: rgba(255, 255, 255, 0.5);
```

### 3. Glassmorphism Effects
```css
/* Glass card style */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

## Color System

### Primary Colors
```css
/* Brand Colors */
--primary-purple: #6750A4;
--primary-blue: #4A90E2;
--primary-green: #4CAF50;
--primary-orange: #FF6F00;
--primary-coral: #FF6B6B;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #6750A4 0%, #4A90E2 100%);
--gradient-success: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
--gradient-warning: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
--gradient-brand: linear-gradient(135deg, #FF6B6B 0%, #6750A4 100%);
```

### Semantic Colors
```css
/* Status Colors */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;

/* With opacity variants */
--success-bg: rgba(76, 175, 80, 0.1);
--warning-bg: rgba(255, 152, 0, 0.1);
--error-bg: rgba(244, 67, 54, 0.1);
--info-bg: rgba(33, 150, 243, 0.1);
```

### Dynamic Gradient System
```javascript
// Mouse-tracking gradient
background: `
  radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(103, 80, 164, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
  radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
  #000000
`;
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale
```css
/* Display */
--display-large: 57px;
--display-medium: 45px;
--display-small: 36px;

/* Headlines */
--headline-large: 32px;
--headline-medium: 28px;
--headline-small: 24px;

/* Body */
--body-large: 16px;
--body-medium: 14px;
--body-small: 12px;

/* Labels */
--label-large: 14px;
--label-medium: 12px;
--label-small: 11px;
```

### Font Weights
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

## Spacing System

### Base Unit: 8px
```css
/* Spacing Scale */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

## Component Patterns

### 1. Navigation Rail
```css
.nav-rail {
  width: 80px;
  background: linear-gradient(180deg, rgba(255, 107, 107, 0.1) 0%, rgba(103, 80, 164, 0.1) 100%);
  backdrop-filter: blur(20px);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}
```

### 2. Cards
```css
/* Elevated Card */
.card-elevated {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card-elevated:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(103, 80, 164, 0.3);
}
```

### 3. Buttons
```css
/* Primary Button */
.button-primary {
  background: linear-gradient(135deg, #6750A4 0%, #4A90E2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(103, 80, 164, 0.3);
}

.button-primary:hover {
  box-shadow: 0 6px 30px rgba(103, 80, 164, 0.4);
  transform: translateY(-2px);
}

/* Outlined Button */
.button-outlined {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.button-outlined:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}
```

### 4. Form Inputs (Dark Mode)
```css
.input-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 14px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.input-dark:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.input-dark:focus {
  border-color: #6750A4;
  outline: none;
  box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.2);
}

/* Autofill override */
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px rgba(255, 255, 255, 0.05) inset;
  -webkit-text-fill-color: #ffffff;
}
```

### 5. Chips/Badges
```css
.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.chip-success {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}
```

## Animation System

### Transitions
```css
/* Standard timing */
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

### Keyframe Animations
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## AI-Specific Components

### 1. AI Chat Interface
```css
.ai-chat-window {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 400px;
  height: 600px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}
```

### 2. AI Recommendations Card
```css
.ai-recommendation {
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.1) 0%, rgba(74, 144, 226, 0.1) 100%);
  border: 1px solid rgba(103, 80, 164, 0.3);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.ai-recommendation::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #6750A4, #4A90E2, #4CAF50);
  border-radius: 16px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.ai-recommendation:hover::before {
  opacity: 1;
}
```

### 3. Live Status Indicators
```css
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
}

.status-online {
  background: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
}

.status-online::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.3);
  animation: pulse 2s infinite;
}
```

## Dashboard Patterns

### 1. Metric Cards
```css
.metric-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.metric-value {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #6750A4 0%, #4A90E2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 2. Chart Containers
```css
.chart-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  min-height: 300px;
}
```

### 3. Timeline Component
```css
.timeline-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  margin-left: 8px;
  padding-left: 24px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 20px;
  width: 8px;
  height: 8px;
  background: #6750A4;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(103, 80, 164, 0.2);
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Container Widths
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 32px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 48px;
  }
}
```

## Accessibility

### Focus States
```css
/* Keyboard focus */
:focus-visible {
  outline: 2px solid #6750A4;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .glass-card {
    border-width: 2px;
  }
}
```

### Color Contrast
- All text meets WCAG AA standards
- Primary text on dark: #FFFFFF (21:1 ratio)
- Secondary text on dark: rgba(255, 255, 255, 0.7) (14.7:1 ratio)
- Interactive elements: Minimum 4.5:1 ratio

## Implementation Guidelines

### 1. Component Structure
```tsx
// Example component using design system
<Box
  sx={{
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    p: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(103, 80, 164, 0.3)',
    }
  }}
>
  {content}
</Box>
```

### 2. Dark Mode Text Fields
```tsx
<TextField
  sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6750A4',
      },
    },
  }}
/>
```

### 3. Gradient Text
```tsx
<Typography
  sx={{
    background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  Gradient Text
</Typography>
```

## Design Tokens for Development

```javascript
export const design = {
  colors: {
    background: {
      primary: '#000000',
      secondary: 'rgba(255, 255, 255, 0.03)',
      elevated: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
    },
    brand: {
      purple: '#6750A4',
      blue: '#4A90E2',
      green: '#4CAF50',
      orange: '#FF6F00',
      coral: '#FF6B6B',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
      success: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
      brand: 'linear-gradient(135deg, #FF6B6B 0%, #6750A4 100%)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  animation: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
    md: '0 4px 20px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.4)',
    xl: '0 12px 40px rgba(0, 0, 0, 0.5)',
    glow: '0 0 40px rgba(103, 80, 164, 0.4)',
  },
}
```

## Summary

The Blipee OS design system creates a cohesive, futuristic interface that:
1. Emphasizes AI intelligence through visual metaphors
2. Uses dark themes to reduce eye strain during extended use
3. Implements glassmorphism for depth and hierarchy
4. Employs dynamic gradients to show system intelligence
5. Maintains accessibility while pushing visual boundaries

This design system positions Blipee OS as a next-generation AI platform that's both powerful and approachable, perfect for enterprise users who demand sophistication and functionality.