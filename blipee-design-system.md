# Blipee OS Design System Documentation

## Overview
The Blipee OS platform implements a sophisticated dark-first design system with optional light mode, emphasizing AI-driven sustainability management through conversational interfaces. The design philosophy centers on futuristic aesthetics, fluid interactions, and data-driven decision making.

## Core Design Principles

### 1. Visual Identity
- **Primary Focus**: Dark theme with vibrant accent colors
- **Design Philosophy**: Futuristic, AI-centric, sustainability-focused
- **User Experience**: Conversational, intelligent, proactive

### 2. Brand Personality
- Revolutionary approach to sustainability
- AI-powered intelligence
- Zero-friction user experience
- Enterprise-grade professionalism

## Color System

### Primary Colors
```css
/* Brand Colors */
--primary-purple: #6750A4;
--primary-blue: #4A90E2;
--primary-orange: #FF6F00;
--primary-red: #FF6B6B;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #6750A4 0%, #4A90E2 100%);
--gradient-brand: linear-gradient(135deg, #FF6F00 0%, #6750A4 100%);
--gradient-success: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
--gradient-warning: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
--gradient-error: linear-gradient(135deg, #F44336 0%, #FF6B6B 100%);
```

### Dark Theme Colors
```css
/* Background Colors */
--bg-primary: #000000;
--bg-secondary: rgba(255, 255, 255, 0.02);
--bg-elevated: rgba(255, 255, 255, 0.03);
--bg-overlay: rgba(255, 255, 255, 0.05);

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.7);
--text-tertiary: rgba(255, 255, 255, 0.5);
--text-disabled: rgba(255, 255, 255, 0.3);

/* Border Colors */
--border-default: rgba(255, 255, 255, 0.08);
--border-hover: rgba(255, 255, 255, 0.2);
--border-focus: rgba(255, 255, 255, 0.3);
```

### Light Theme Colors
```css
/* Background Colors */
--bg-primary-light: #f5f5f5;
--bg-secondary-light: rgba(255, 255, 255, 0.6);
--bg-elevated-light: rgba(255, 255, 255, 0.8);
--bg-overlay-light: rgba(0, 0, 0, 0.04);

/* Text Colors */
--text-primary-light: #1a1a1a;
--text-secondary-light: rgba(0, 0, 0, 0.7);
--text-tertiary-light: rgba(0, 0, 0, 0.5);
--text-disabled-light: rgba(0, 0, 0, 0.3);

/* Border Colors */
--border-default-light: rgba(0, 0, 0, 0.08);
--border-hover-light: rgba(0, 0, 0, 0.16);
--border-focus-light: rgba(0, 0, 0, 0.24);
```

### Semantic Colors
```css
/* Status Colors */
--success: #4CAF50;
--warning: #FFB74D;
--error: #F44336;
--info: #42A5F5;

/* Chart Colors */
--chart-1: #6750A4;
--chart-2: #42A5F5;
--chart-3: #4CAF50;
--chart-4: #FFB74D;
--chart-5: #FF6B6B;
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale
```css
/* Headlines */
--h1: 2.5rem;       /* 40px */
--h2: 2rem;         /* 32px */
--h3: 1.5rem;       /* 24px */
--h4: 1.25rem;      /* 20px */
--h5: 1.125rem;     /* 18px */
--h6: 1rem;         /* 16px */

/* Body Text */
--body-large: 1.125rem;  /* 18px */
--body-medium: 1rem;     /* 16px */
--body-small: 0.875rem;  /* 14px */
--caption: 0.75rem;      /* 12px */

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.6;
--line-height-relaxed: 1.8;

/* Letter Spacing */
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.05em;
```

## Spacing System

### Base Unit: 8px
```css
/* Spacing Scale */
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
--space-4xl: 6rem;      /* 96px */
```

## Effects & Animations

### Shadows
```css
/* Elevation Shadows */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 20px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.3);

/* Colored Shadows */
--shadow-primary: 0 8px 32px rgba(103, 80, 164, 0.3);
--shadow-success: 0 8px 24px rgba(76, 175, 80, 0.3);
--shadow-error: 0 8px 32px rgba(244, 67, 54, 0.3);
```

### Animations
```css
/* Transitions */
--transition-fast: all 0.2s ease;
--transition-medium: all 0.3s ease;
--transition-slow: all 0.5s ease;

/* Common Animations */
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
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
}
```

### Glassmorphism Effects
```css
/* Glass Background */
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## Layout System

### Grid System
```css
/* Dashboard Grid */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 1.5rem;

/* Responsive Breakpoints */
--breakpoint-xs: 0;
--breakpoint-sm: 600px;
--breakpoint-md: 960px;
--breakpoint-lg: 1280px;
--breakpoint-xl: 1920px;
```

### Container Widths
```css
--container-sm: 600px;
--container-md: 960px;
--container-lg: 1280px;
--container-xl: 1600px;
```

## Component Patterns

### Cards
```css
.card {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
}

.card:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

### Buttons
```css
/* Primary Button */
.button-primary {
    background: linear-gradient(135deg, #6750A4 0%, #4A90E2 100%);
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    border-radius: 100px;
    font-weight: 600;
    transition: all 0.2s ease;
}

/* Secondary Button */
.button-secondary {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
}

/* Text Button */
.button-text {
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
}
```

### Input Fields
```css
.input-field {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 0.75rem 1.25rem;
    color: #ffffff;
    transition: all 0.2s ease;
}

.input-field:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: #6750A4;
    outline: none;
}
```

### Navigation Rail
```css
.nav-rail {
    width: 80px;
    background: linear-gradient(180deg, rgba(255, 107, 107, 0.1) 0%, rgba(103, 80, 164, 0.1) 100%);
    backdrop-filter: blur(20px);
}

.nav-item {
    width: 100%;
    height: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    width: 3px;
    height: 32px;
    background: #FF6B6B;
    border-radius: 0 3px 3px 0;
}
```

## Interactive Elements

### Dynamic Backgrounds
```javascript
// Mouse-following gradient
background: `
    radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(103, 80, 164, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
    #000000
`;
```

### Live Status Indicators
```css
.live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.live-dot {
    width: 8px;
    height: 8px;
    background: #4CAF50;
    border-radius: 50%;
    animation: pulse 2s infinite;
}
```

### Progress Indicators
```css
/* Linear Progress */
.progress-linear {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(to right, #6750A4, #4A90E2);
    transition: width 0.3s ease;
}
```

## AI-Specific Components

### AI Assistant FAB (Floating Action Button)
```css
.ai-assistant-fab {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #6750A4 0%, #4A90E2 100%);
    border-radius: 50%;
    box-shadow: 0 8px 24px rgba(103, 80, 164, 0.4);
    position: fixed;
    bottom: 2rem;
    right: 2rem;
}
```

### AI Chat Window
```css
.ai-chat-window {
    width: 400px;
    height: 600px;
    background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}
```

### AI Recommendations
```css
.ai-recommendation {
    background: rgba(255, 255, 255, 0.08);
    padding: 0.5rem 1rem;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}
```

## Accessibility

### Focus States
```css
/* Keyboard Focus */
:focus-visible {
    outline: 2px solid #6750A4;
    outline-offset: 2px;
    border-radius: 4px;
}
```

### Color Contrast
- Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- Test with color blindness simulators
- Provide alternative indicators beyond color

### Screen Reader Support
```css
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

## Implementation Guidelines

### Component Architecture
1. Use Material Design 3 (MD3) components as base
2. Apply Blipee-specific styling overrides
3. Maintain consistency across all touchpoints
4. Prioritize performance and accessibility

### Best Practices
1. **Dark Mode First**: Design for dark theme, adapt for light
2. **Glassmorphism**: Use subtle transparency and blur effects
3. **Gradient Accents**: Apply gradients to key interactive elements
4. **Micro-interactions**: Add subtle animations to enhance UX
5. **AI Integration**: Design for conversational interfaces
6. **Data Visualization**: Use consistent chart colors and styles

### Performance Considerations
1. Debounce mouse-tracking animations
2. Use CSS transforms for animations
3. Lazy load heavy components
4. Optimize backdrop-filter usage
5. Minimize DOM manipulations

## Usage Examples

### Creating a Dashboard Card
```jsx
<MD3Card
  variant="elevated"
  sx={{
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    p: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.04)',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    }
  }}
>
  {/* Card content */}
</MD3Card>
```

### Implementing Gradient Text
```jsx
<MD3Typography
  variant="h2"
  sx={{
    background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 50%, #4CAF50 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  Gradient Heading
</MD3Typography>
```

### Creating an AI Action Button
```jsx
<MD3Button
  variant="filled"
  startIcon={<AutoAwesome />}
  sx={{
    background: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
    boxShadow: '0 4px 20px rgba(255, 111, 0, 0.3)',
    '&:hover': {
      boxShadow: '0 6px 30px rgba(255, 111, 0, 0.4)',
    }
  }}
>
  AI Optimize Now
</MD3Button>
```

## Conclusion

The Blipee OS design system represents a forward-thinking approach to enterprise sustainability software, combining sophisticated visual design with AI-powered functionality. By following these guidelines, teams can create consistent, engaging, and accessible interfaces that embody the revolutionary spirit of the Blipee platform.