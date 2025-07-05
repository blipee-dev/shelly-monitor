import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthContext } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase';
// MD3 Components
import MD3Box from '@/components/md3/MD3Box';
import MD3Container from '@/components/md3/MD3Container';
import MD3Typography from '@/components/md3/MD3Typography';
import { MD3Button } from '@/components/md3/MD3Button';
import { MD3Card } from '@/components/md3/MD3Card';
import MD3TextField from '@/components/md3/MD3TextField';
import MD3Chip from '@/components/md3/MD3Chip';
import MD3LinearProgress from '@/components/md3/MD3LinearProgress';
// Icons
import {
  Psychology as AIIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  CheckCircle,
  AutoAwesome,
  Speed,
  TrendingUp,
  Rocket,
} from '@mui/icons-material';

const LoginPage: NextPage = () => {
  const { user, loading, signIn, signInWithGoogle, error: authError, clearError } = useAuthContext();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [fadeIn, setFadeIn] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for gradient effect - debounced to prevent performance issues
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // Only update if mouse moved significantly (more than 2%)
      if (Math.abs(x - lastX) > 2 || Math.abs(y - lastY) > 2) {
        lastX = x;
        lastY = y;
        
        // Clear existing timeout
        clearTimeout(timeoutId);
        
        // Debounce the state update
        timeoutId = setTimeout(() => {
          setMousePosition({ x, y });
        }, 50); // Update at most every 50ms
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setFadeIn(true);
    if (user && !loading) {
      // Check if user is a demo account before redirecting
      const checkUserType = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.account_type === 'demo') {
          router.push('/demo-dashboard');
        } else {
          router.push('/dashboard');
        }
      };
      checkUserType();
    }

    // Check for signup success message
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'success') {
      setSignupSuccess(true);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, clearError]);

  const validateForm = () => {
    const errors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <AutoAwesome />,
      title: 'Predictive Intelligence',
      description: 'AI forecasts trends and risks.',
    },
    {
      icon: <Speed />,
      title: 'Scenario Modeling',
      description: 'Interactive impact simulation.',
    },
    {
      icon: <TrendingUp />,
      title: 'Autonomous Operations',
      description: 'Self-managing compliance.',
    },
  ];

  return (
    <>
      <Head>
        <title>Sign In - blipee | The Future of Sustainability</title>
        <meta name="description" content="Access the world's first conversational sustainability platform. No forms, just results." />
      </Head>

      <MD3Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic gradient background */}
        <MD3Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(103, 80, 164, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
              #000000
            `,
            transition: 'background 0.3s ease',
            zIndex: 0,
          }}
        />

        {/* Animated background elements */}
        <MD3Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(103, 80, 164, 0.2) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
            zIndex: 0,
          }}
        />
        <MD3Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.2) 0%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
            zIndex: 0,
          }}
        />

        <MD3Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          <MD3Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
            <MD3Box sx={{ display: 'flex', width: '100%', gap: 8, alignItems: 'center' }}>
              
              {/* Left Side - Branding & Features */}
              <MD3Box
                sx={{
                  flex: 1,
                  display: { xs: 'none', lg: 'block' },
                  animation: 'fadeInUp 1s ease-out',
                }}
              >
                {/* Logo */}
                <MD3Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 6,
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push('/')}
                >
                  <MD3Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(103, 80, 164, 0.3)',
                    }}
                  >
                    <AIIcon sx={{ fontSize: 36, color: '#ffffff' }} />
                  </MD3Box>
                  <MD3Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    blipee
                  </MD3Typography>
                </MD3Box>

                {/* Headline */}
                <MD3Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { lg: '3rem', xl: '3.5rem' },
                    lineHeight: 1.2,
                    mb: 3,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome to the
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 50%, #4CAF50 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Future of Sustainability
                  </span>
                </MD3Typography>

                <MD3Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 400,
                    mb: 6,
                    lineHeight: 1.6,
                  }}
                >
                  The only platform where you can manage your entire sustainability program through conversation. No forms. No training. Just results.
                </MD3Typography>

                {/* Features */}
                <MD3Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {features.map((feature, index) => (
                    <MD3Box
                      key={index}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        animation: `fadeInUp 1s ease-out ${0.2 + index * 0.1}s`,
                        animationFillMode: 'backwards',
                      }}
                    >
                      <MD3Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'rgba(103, 80, 164, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {React.cloneElement(feature.icon, { 
                          sx: { color: '#B794F4', fontSize: 24 } 
                        })}
                      </MD3Box>
                      <MD3Box>
                        <MD3Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {feature.title}
                        </MD3Typography>
                        <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {feature.description}
                        </MD3Typography>
                      </MD3Box>
                    </MD3Box>
                  ))}
                </MD3Box>

                {/* Stats */}
                <MD3Box sx={{ mt: 6, display: 'flex', gap: 4 }}>
                  <MD3Box>
                    <MD3Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      10k+
                    </MD3Typography>
                    <MD3Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Active Users
                    </MD3Typography>
                  </MD3Box>
                  <MD3Box>
                    <MD3Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      96%
                    </MD3Typography>
                    <MD3Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Accuracy
                    </MD3Typography>
                  </MD3Box>
                  <MD3Box>
                    <MD3Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      30s
                    </MD3Typography>
                    <MD3Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Reports
                    </MD3Typography>
                  </MD3Box>
                </MD3Box>
              </MD3Box>

              {/* Right Side - Login Form */}
              <MD3Box sx={{ flex: '0 0 auto', width: { xs: '100%', lg: '480px' } }}>
                <MD3Card
                  variant="elevated"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    p: { xs: 4, sm: 6 },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    animation: 'fadeInUp 1s ease-out 0.3s',
                    animationFillMode: 'backwards',
                  }}
                >
                  {/* Header */}
                  <MD3Box sx={{ textAlign: 'center', mb: 4 }}>
                    <MD3Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Welcome Back
                    </MD3Typography>
                    <MD3Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Sign in to continue to the future
                    </MD3Typography>
                  </MD3Box>

                  {/* Success Message */}
                  {signupSuccess && (
                    <MD3Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                      }}
                    >
                      <MD3Typography
                        variant="body2"
                        sx={{
                          color: '#4CAF50',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 20 }} />
                        Account created successfully! Please sign in.
                      </MD3Typography>
                    </MD3Box>
                  )}

                  {/* Error Message */}
                  {authError && (
                    <MD3Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                      }}
                    >
                      <MD3Typography variant="body2" sx={{ color: '#f44336' }}>
                        {authError}
                      </MD3Typography>
                    </MD3Box>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <MD3Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <MD3TextField
                        fullWidth
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        disabled={isSubmitting}
                        startAdornment={<EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
                            color: '#ffffff',
                          },
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
                          },
                          '& .MuiInputBase-input': {
                            color: '#ffffff',
                            '&:-webkit-autofill': {
                              WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.05) inset',
                              WebkitTextFillColor: '#ffffff',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6750A4',
                          },
                          '& .MuiFormHelperText-root': {
                            color: 'rgba(255, 255, 255, 0.6)',
                          },
                        }}
                      />

                      <MD3TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        disabled={isSubmitting}
                        startAdornment={<LockIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                        endAdornment={
                          <MD3Box
                            component="button"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{
                              background: 'none',
                              border: 'none',
                              p: 0,
                              cursor: 'pointer',
                              color: 'rgba(255, 255, 255, 0.5)',
                              '&:hover': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </MD3Box>
                        }
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
                            color: '#ffffff',
                          },
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
                          },
                          '& .MuiInputBase-input': {
                            color: '#ffffff',
                            '&:-webkit-autofill': {
                              WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.05) inset',
                              WebkitTextFillColor: '#ffffff',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6750A4',
                          },
                          '& .MuiFormHelperText-root': {
                            color: 'rgba(255, 255, 255, 0.6)',
                          },
                        }}
                      />

                      <MD3Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <MD3Button
                          variant="text"
                          onClick={() => router.push('/forgot-password')}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            textTransform: 'none',
                            '&:hover': {
                              color: '#ffffff',
                              background: 'transparent',
                            }
                          }}
                        >
                          Forgot password?
                        </MD3Button>
                      </MD3Box>

                      <MD3Button
                        type="submit"
                        variant="filled"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 100%)',
                          boxShadow: '0 4px 20px rgba(103, 80, 164, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 30px rgba(103, 80, 164, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        {isSubmitting ? (
                          <MD3Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <MD3LinearProgress
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                              }}
                            />
                            Signing in...
                          </MD3Box>
                        ) : (
                          'Sign In'
                        )}
                      </MD3Button>

                      <MD3Box sx={{ position: 'relative', textAlign: 'center' }}>
                        <MD3Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            right: 0,
                            height: '1px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-50%)',
                          }}
                        />
                        <MD3Typography
                          variant="body2"
                          sx={{
                            position: 'relative',
                            display: 'inline-block',
                            px: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          or continue with
                        </MD3Typography>
                      </MD3Box>

                      <MD3Button
                        variant="outlined"
                        fullWidth
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                        startIcon={<GoogleIcon />}
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      >
                        Continue with Google
                      </MD3Button>

                      <MD3Button
                        variant="outlined"
                        fullWidth
                        disabled
                        startIcon={<BusinessIcon />}
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        Enterprise SSO (Coming Soon)
                      </MD3Button>
                    </MD3Box>
                  </form>

                  {/* Footer */}
                  <MD3Box sx={{ mt: 4, textAlign: 'center' }}>
                    <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Don't have an account?{' '}
                      <MD3Button
                        variant="text"
                        onClick={() => router.push('/signup')}
                        sx={{
                          color: '#B794F4',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            color: '#D6BCFA',
                          }
                        }}
                      >
                        Sign up for free
                      </MD3Button>
                    </MD3Typography>
                    
                    <MD3Box sx={{ mt: 2 }}>
                      <MD3Button
                        variant="text"
                        onClick={() => router.push('/demo-signup')}
                        startIcon={<Rocket />}
                        sx={{
                          color: '#4CAF50',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            color: '#66BB6A',
                          }
                        }}
                      >
                        Try Free Demo Instead
                      </MD3Button>
                    </MD3Box>
                  </MD3Box>

                  {/* Security Badge */}
                  <MD3Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <MD3Chip
                      icon={<SecurityIcon />}
                      label="SOC 2 Compliant"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4CAF50',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                      }}
                    />
                    <MD3Chip
                      icon={<CheckCircle />}
                      label="GDPR"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        color: '#2196F3',
                        border: '1px solid rgba(33, 150, 243, 0.3)',
                      }}
                    />
                  </MD3Box>
                </MD3Card>
              </MD3Box>
            </MD3Box>
          </MD3Box>
        </MD3Container>

        {/* Animations and Autofill Override */}
        <style jsx global>{`
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
          
          /* Force override browser autofill styling */
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
            -webkit-text-fill-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          
          /* Style the entire field when autofilled */
          .MuiTextField-root:has(input:-webkit-autofill) .MuiOutlinedInput-root {
            background-color: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
          }
          
          /* Additional autofill overrides for different browsers */
          input:autofill {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: #ffffff !important;
          }
          
          /* Force dark mode for all text fields on this page */
          .MuiTextField-root .MuiOutlinedInput-root {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          
          .MuiTextField-root .MuiOutlinedInput-root input {
            color: #ffffff !important;
          }
          
          .MuiTextField-root .MuiInputLabel-root {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          
          .MuiTextField-root .MuiOutlinedInput-root fieldset {
            border-color: rgba(255, 255, 255, 0.2) !important;
          }
          
          .MuiTextField-root .MuiOutlinedInput-root:hover fieldset {
            border-color: rgba(255, 255, 255, 0.3) !important;
          }
          
          .MuiTextField-root .MuiOutlinedInput-root.Mui-focused fieldset {
            border-color: #6750A4 !important;
          }
        `}</style>
      </MD3Box>
    </>
  );
};

export default LoginPage;