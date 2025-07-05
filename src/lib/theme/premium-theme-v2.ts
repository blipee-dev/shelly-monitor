// Premium Theme Configuration for Blipee OS v2
// Supports both dark and light modes with sophisticated design

export type ThemeMode = 'dark' | 'light';

// Theme configuration interface
interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    background: {
      primary: string;
      secondary: string;
      elevated: string;
      glass: string;
      glassHover: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
    };
    brand: {
      orange: string;
      purple: string;
      blue: string;
      coral: string;
      green: string;
    };
    gradients: {
      primary: string;
      primaryReverse: string;
      blue: string;
      success: string;
      coral: string;
      brand: string;
      error: string;
      textPrimary: string;
      textBrand: string;
      textMulti: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
      successBg: string;
      warningBg: string;
      errorBg: string;
      infoBg: string;
    };
  };
  effects: {
    glass: {
      background: string;
      backdropFilter: string;
      border: string;
    };
    glassElevated: {
      background: string;
      backdropFilter: string;
      border: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      orange: string;
      orangeHover: string;
      purple: string;
      purpleHover: string;
      glow: string;
      card: string;
      cardHover: string;
      button: string;
      buttonHover: string;
    };
  };
}

// Dark theme configuration
const darkTheme: ThemeConfig = {
  mode: 'dark',
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
    brand: {
      orange: '#FF6F00',
      purple: '#6750A4',
      blue: '#4A90E2',
      coral: '#FF6B6B',
      green: '#4CAF50',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
      primaryReverse: 'linear-gradient(135deg, #6750A4 0%, #FF6F00 100%)',
      blue: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
      success: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
      coral: 'linear-gradient(135deg, #FF6B6B 0%, #6750A4 100%)',
      brand: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 50%, #6750A4 100%)',
      error: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)',
      textPrimary: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
      textBrand: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
      textMulti: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 50%, #4CAF50 100%)',
    },
    status: {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
      successBg: 'rgba(76, 175, 80, 0.1)',
      warningBg: 'rgba(255, 152, 0, 0.1)',
      errorBg: 'rgba(244, 67, 54, 0.1)',
      infoBg: 'rgba(33, 150, 243, 0.1)',
    },
  },
  effects: {
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
    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
      md: '0 4px 20px rgba(0, 0, 0, 0.3)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 60px rgba(0, 0, 0, 0.5)',
      xxl: '0 20px 60px rgba(0, 0, 0, 0.8)',
      orange: '0 4px 20px rgba(255, 111, 0, 0.3)',
      orangeHover: '0 6px 30px rgba(255, 111, 0, 0.4)',
      purple: '0 4px 20px rgba(103, 80, 164, 0.3)',
      purpleHover: '0 6px 30px rgba(103, 80, 164, 0.4)',
      glow: '0 0 40px rgba(103, 80, 164, 0.4)',
      card: '0 8px 32px rgba(0, 0, 0, 0.4)',
      cardHover: '0 12px 40px rgba(103, 80, 164, 0.3)',
      button: '0 4px 20px rgba(255, 111, 0, 0.3)',
      buttonHover: '0 6px 30px rgba(255, 111, 0, 0.4)',
    },
  },
};

// Light theme configuration
const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    background: {
      primary: '#FAFAFA',
      secondary: '#FFFFFF',
      elevated: 'rgba(255, 255, 255, 0.95)',
      glass: 'rgba(255, 255, 255, 0.8)',
      glassHover: 'rgba(255, 255, 255, 0.9)',
      overlay: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      tertiary: 'rgba(0, 0, 0, 0.38)',
      disabled: 'rgba(0, 0, 0, 0.26)',
    },
    brand: {
      orange: '#F57C00',
      purple: '#5E35B1',
      blue: '#1976D2',
      coral: '#E64A19',
      green: '#388E3C',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #F57C00 0%, #5E35B1 100%)',
      primaryReverse: 'linear-gradient(135deg, #5E35B1 0%, #F57C00 100%)',
      blue: 'linear-gradient(135deg, #5E35B1 0%, #1976D2 100%)',
      success: 'linear-gradient(135deg, #388E3C 0%, #66BB6A 100%)',
      coral: 'linear-gradient(135deg, #E64A19 0%, #5E35B1 100%)',
      brand: 'linear-gradient(135deg, #F57C00 0%, #FF9800 50%, #5E35B1 100%)',
      error: 'linear-gradient(135deg, #D32F2F 0%, #C2185B 100%)',
      textPrimary: 'linear-gradient(135deg, rgba(0, 0, 0, 0.87) 0%, rgba(0, 0, 0, 0.6) 100%)',
      textBrand: 'linear-gradient(135deg, #F57C00 0%, #5E35B1 100%)',
      textMulti: 'linear-gradient(135deg, #5E35B1 0%, #1976D2 50%, #388E3C 100%)',
    },
    status: {
      success: '#2E7D32',
      warning: '#F57C00',
      error: '#C62828',
      info: '#0288D1',
      successBg: 'rgba(46, 125, 50, 0.08)',
      warningBg: 'rgba(245, 124, 0, 0.08)',
      errorBg: 'rgba(198, 40, 40, 0.08)',
      infoBg: 'rgba(2, 136, 209, 0.08)',
    },
  },
  effects: {
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
    },
    glassElevated: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
    },
    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
      md: '0 4px 20px rgba(0, 0, 0, 0.1)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
      xl: '0 20px 60px rgba(0, 0, 0, 0.15)',
      xxl: '0 20px 60px rgba(0, 0, 0, 0.2)',
      orange: '0 4px 20px rgba(245, 124, 0, 0.2)',
      orangeHover: '0 6px 30px rgba(245, 124, 0, 0.3)',
      purple: '0 4px 20px rgba(94, 53, 177, 0.2)',
      purpleHover: '0 6px 30px rgba(94, 53, 177, 0.3)',
      glow: '0 0 40px rgba(94, 53, 177, 0.2)',
      card: '0 8px 32px rgba(0, 0, 0, 0.08)',
      cardHover: '0 12px 40px rgba(94, 53, 177, 0.15)',
      button: '0 4px 20px rgba(245, 124, 0, 0.2)',
      buttonHover: '0 6px 30px rgba(245, 124, 0, 0.3)',
    },
  },
};

// Shared theme properties (same for both modes)
const sharedTheme = {
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
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
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
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
  effects: {
    transitions: {
      fast: 'all 0.2s ease',
      normal: 'all 0.3s ease',
      slow: 'all 0.5s ease',
    },
    hover: {
      transform: 'translateY(-2px)',
      transformScale: 'scale(1.05)',
    },
    active: {
      transform: 'scale(0.98)',
    },
  },
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
};

// Create theme function
export const createPremiumTheme = (mode: ThemeMode = 'dark') => {
  const themeConfig = mode === 'dark' ? darkTheme : lightTheme;
  
  return {
    ...sharedTheme,
    ...themeConfig,
    // Merge effects properly
    effects: {
      ...sharedTheme.effects,
      ...themeConfig.effects,
    },
    components: {
      button: {
        primary: {
          background: themeConfig.colors.gradients.primary,
          color: mode === 'dark' ? '#ffffff' : '#ffffff',
          boxShadow: themeConfig.effects.shadows.button,
          '&:hover': {
            boxShadow: themeConfig.effects.shadows.buttonHover,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        outlined: {
          background: 'transparent',
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)'}`,
          color: themeConfig.colors.text.primary,
          '&:hover': {
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          },
        },
        text: {
          background: 'transparent',
          color: themeConfig.colors.text.secondary,
          '&:hover': {
            color: themeConfig.colors.text.primary,
            backgroundColor: 'transparent',
          },
        },
      },
      textField: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
            },
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.04)',
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
              },
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
              '& fieldset': {
                borderColor: themeConfig.colors.brand.orange,
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: themeConfig.colors.text.secondary,
            '&.Mui-focused': {
              color: themeConfig.colors.brand.orange,
            },
          },
          '& .MuiInputBase-input': {
            color: themeConfig.colors.text.primary,
            '&:-webkit-autofill': {
              WebkitBoxShadow: mode === 'dark' 
                ? '0 0 0 100px rgba(255, 255, 255, 0.05) inset'
                : '0 0 0 100px rgba(0, 0, 0, 0.02) inset',
              WebkitTextFillColor: themeConfig.colors.text.primary,
            },
          },
          '& .MuiFormHelperText-root': {
            color: themeConfig.colors.text.tertiary,
          },
        },
      },
    },
  };
};

// Export default dark theme for backward compatibility
export const premiumTheme = createPremiumTheme('dark');

// Dynamic background gradient functions
export const getDynamicBackground = (mouseX: number, mouseY: number, mode: ThemeMode = 'dark') => {
  if (mode === 'dark') {
    return `
      radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255, 111, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.05) 0%, transparent 50%),
      #000000
    `;
  } else {
    return `
      radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(245, 124, 0, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(25, 118, 210, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(56, 142, 60, 0.04) 0%, transparent 50%),
      #FAFAFA
    `;
  }
};

// Helper function to apply gradient text
export const gradientText = (gradient: string) => ({
  background: gradient,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
});

// Glass effect helper
export const glassEffect = (blur = 20, opacity = 0.03, mode: ThemeMode = 'dark') => {
  if (mode === 'dark') {
    return {
      background: `rgba(255, 255, 255, ${opacity})`,
      backdropFilter: `blur(${blur}px)`,
      border: '1px solid rgba(255, 255, 255, 0.1)',
    };
  } else {
    return {
      background: `rgba(255, 255, 255, ${opacity > 0.5 ? opacity : 0.7})`,
      backdropFilter: `blur(${blur}px) saturate(180%)`,
      border: '1px solid rgba(0, 0, 0, 0.08)',
    };
  }
};