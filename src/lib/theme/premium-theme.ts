// Premium Theme Configuration for Blipee OS
// Based on the sophisticated design from demo-signup.tsx

export const premiumTheme = {
  // Core Colors
  colors: {
    background: {
      primary: '#000000',
      secondary: 'rgba(255, 255, 255, 0.02)',
      elevated: 'rgba(255, 255, 255, 0.03)',
      glass: 'rgba(255, 255, 255, 0.03)',
      glassHover: 'rgba(255, 255, 255, 0.05)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },
    
    // Brand Colors
    brand: {
      orange: '#FF6F00',
      purple: '#6750A4',
      blue: '#4A90E2',
      coral: '#FF6B6B',
      green: '#4CAF50',
    },
    
    // Gradients (the magic sauce!)
    gradients: {
      primary: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
      primaryReverse: 'linear-gradient(135deg, #6750A4 0%, #FF6F00 100%)',
      blue: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
      success: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
      coral: 'linear-gradient(135deg, #FF6B6B 0%, #6750A4 100%)',
      brand: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 50%, #6750A4 100%)',
      
      // Text gradients
      textPrimary: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
      textBrand: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
      textMulti: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 50%, #4CAF50 100%)',
    },
    
    // Status Colors
    status: {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
      
      // With backgrounds
      successBg: 'rgba(76, 175, 80, 0.1)',
      warningBg: 'rgba(255, 152, 0, 0.1)',
      errorBg: 'rgba(244, 67, 54, 0.1)',
      infoBg: 'rgba(33, 150, 243, 0.1)',
    },
  },
  
  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // Weights
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    // Sizes with complete specs
    sizes: {
      displayLarge: { 
        size: '3.5rem', 
        weight: 800, 
        letterSpacing: '-0.02em', 
        lineHeight: 1.2 
      },
      displayMedium: { 
        size: '3rem', 
        weight: 700, 
        letterSpacing: '-0.02em', 
        lineHeight: 1.2 
      },
      displaySmall: { 
        size: '2.5rem', 
        weight: 300, 
        letterSpacing: '-0.02em', 
        lineHeight: 1.3 
      },
      
      h1: { 
        size: '2.5rem', 
        weight: 300, 
        letterSpacing: '-0.02em',
        lineHeight: 1.3
      },
      h2: { 
        size: '2rem', 
        weight: 400, 
        letterSpacing: '-0.01em',
        lineHeight: 1.4
      },
      h3: { 
        size: '1.5rem', 
        weight: 500,
        lineHeight: 1.5
      },
      h4: { 
        size: '1.25rem', 
        weight: 500,
        lineHeight: 1.5
      },
      h5: { 
        size: '1.125rem', 
        weight: 600,
        lineHeight: 1.5
      },
      h6: { 
        size: '1rem', 
        weight: 600,
        lineHeight: 1.5
      },
      
      body1: { 
        size: '1rem', 
        weight: 400, 
        lineHeight: 1.6 
      },
      body2: { 
        size: '0.875rem', 
        weight: 400, 
        lineHeight: 1.5 
      },
      caption: { 
        size: '0.75rem', 
        weight: 400,
        lineHeight: 1.4
      },
      label: {
        size: '0.875rem',
        weight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
      }
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  
  // Border Radius
  borderRadius: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    xxl: '28px',
    pill: '100px',
    circle: '50%',
  },
  
  // Effects
  effects: {
    // Glass morphism
    glass: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    
    glassElevated: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    
    // Shadows
    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
      md: '0 4px 20px rgba(0, 0, 0, 0.3)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 60px rgba(0, 0, 0, 0.5)',
      xxl: '0 20px 60px rgba(0, 0, 0, 0.8)',
      
      // Colored shadows
      orange: '0 4px 20px rgba(255, 111, 0, 0.3)',
      orangeHover: '0 6px 30px rgba(255, 111, 0, 0.4)',
      purple: '0 4px 20px rgba(103, 80, 164, 0.3)',
      purpleHover: '0 6px 30px rgba(103, 80, 164, 0.4)',
      glow: '0 0 40px rgba(103, 80, 164, 0.4)',
      
      // Specific shadows
      card: '0 8px 32px rgba(0, 0, 0, 0.4)',
      cardHover: '0 12px 40px rgba(103, 80, 164, 0.3)',
      button: '0 4px 20px rgba(255, 111, 0, 0.3)',
      buttonHover: '0 6px 30px rgba(255, 111, 0, 0.4)',
    },
    
    // Transitions
    transitions: {
      fast: 'all 0.2s ease',
      normal: 'all 0.3s ease',
      slow: 'all 0.5s ease',
    },
    
    // Hover states
    hover: {
      transform: 'translateY(-2px)',
      transformScale: 'scale(1.05)',
      glassBackground: 'rgba(255, 255, 255, 0.05)',
    },
    
    // Active states
    active: {
      transform: 'scale(0.98)',
    },
  },
  
  // Animations
  animations: {
    fadeInUp: `
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
    `,
    
    slideInFromRight: `
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
    `,
    
    float: `
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
    `,
    
    pulse: `
      @keyframes pulse {
        0% { 
          opacity: 1; 
          transform: scale(1); 
        }
        50% { 
          opacity: 0.6; 
          transform: scale(1.2); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
    `,
  },
  
  // Component specific styles
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 20px rgba(255, 111, 0, 0.3)',
        '&:hover': {
          boxShadow: '0 6px 30px rgba(255, 111, 0, 0.4)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
      },
      
      outlined: {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
      
      text: {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover': {
          color: '#ffffff',
          backgroundColor: 'transparent',
        },
      },
    },
    
    textField: {
      root: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          transition: 'all 0.2s ease',
          
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
          
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '& fieldset': {
              borderColor: '#FF6F00',
              borderWidth: '2px',
            },
          },
        },
        
        '& .MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.7)',
          
          '&.Mui-focused': {
            color: '#FF6F00',
          },
        },
        
        '& .MuiInputBase-input': {
          color: '#ffffff',
          
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.05) inset',
            WebkitTextFillColor: '#ffffff',
          },
        },
        
        '& .MuiFormHelperText-root': {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
  },
};

// Dynamic background gradient function
export const getDynamicBackground = (mouseX: number, mouseY: number) => `
  radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255, 111, 0, 0.08) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.05) 0%, transparent 50%),
  radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.05) 0%, transparent 50%),
  #000000
`;

// Helper function to apply gradient text
export const gradientText = (gradient: string) => ({
  background: gradient,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
});

// Glass effect helper
export const glassEffect = (blur = 20, opacity = 0.03) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: `blur(${blur}px)`,
  border: '1px solid rgba(255, 255, 255, 0.1)',
});