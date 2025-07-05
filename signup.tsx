import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthContext } from '@/lib/context/AuthContext';
import { completeSignup } from '@/lib/services/signupService';
// MD3 Components
import MD3Box from '@/components/md3/MD3Box';
import MD3Container from '@/components/md3/MD3Container';
import MD3Typography from '@/components/md3/MD3Typography';
import { MD3Button } from '@/components/md3/MD3Button';
import { MD3Card } from '@/components/md3/MD3Card';
import MD3TextField from '@/components/md3/MD3TextField';
import MD3Chip from '@/components/md3/MD3Chip';
import MD3LinearProgress from '@/components/md3/MD3LinearProgress';
import MD3Checkbox from '@/components/md3/pure/MD3Checkbox';
// Icons
import {
  Psychology as AIIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Security as SecurityIcon,
  CheckCircle,
  AutoAwesome,
  Speed,
  TrendingUp,
  Rocket,
  EmojiEvents,
} from '@mui/icons-material';

const SignupPage: NextPage = () => {
  const { user, loading, signInWithGoogle } = useAuthContext();
  const router = useRouter();
  
  // Dark theme text field styles
  const darkTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
      color: '#ffffff !important',
      
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2) !important',
        borderWidth: '1px !important',
      },
      
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3) !important',
      },
      
      '&.Mui-focused fieldset': {
        borderColor: '#6750A4 !important',
        borderWidth: '2px !important',
      },
      
      '& input': {
        color: '#ffffff !important',
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.05) inset !important',
          WebkitTextFillColor: '#ffffff !important',
        },
      },
    },
    
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7) !important',
      
      '&.Mui-focused': {
        color: '#B794F4 !important',
      },
    },
    
    '& .MuiFormHelperText-root': {
      color: 'rgba(255, 255, 255, 0.6) !important',
    },
  };
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    agreeToTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    agreeToTerms: '',
  });
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
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
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const passwordRequirements = [
    { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
    { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
    { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
  ];

  const validateForm = () => {
    const errors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
      agreeToTerms: '',
    };
    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!passwordRequirements.every(req => req.test(formData.password))) {
      errors.password = 'Password does not meet requirements';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.organizationName.trim()) {
      errors.organizationName = 'Organization name is required';
      isValid = false;
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: field === 'agreeToTerms' ? event.target.checked : event.target.value,
    });
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await completeSignup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        organizationName: formData.organizationName,
      });

      if (result.success) {
        router.push('/login?signup=success');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign up error:', error);
      setError('Failed to sign up with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <AutoAwesome />,
      title: '5-Minute Setup',
      description: 'AI guides you through everything',
    },
    {
      icon: <Speed />,
      title: 'Zero Learning Curve',
      description: 'If you can type, you can use it',
    },
    {
      icon: <TrendingUp />,
      title: 'Instant Value',
      description: 'See results from day one',
    },
    {
      icon: <EmojiEvents />,
      title: 'Industry Leading',
      description: 'Join the sustainability revolution',
    },
  ];

  return (
    <>
      <Head>
        <title>Sign Up - blipee | Join the Sustainability Revolution</title>
        <meta name="description" content="Create your free account and experience the world's first conversational sustainability platform." />
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
              radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
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
            top: '20%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.2) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
            zIndex: 0,
          }}
        />
        <MD3Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(103, 80, 164, 0.2) 0%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
            zIndex: 0,
          }}
        />

        <MD3Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          <MD3Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
            <MD3Box sx={{ display: 'flex', width: '100%', gap: 8, alignItems: 'center' }}>
              
              {/* Left Side - Benefits & Branding */}
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
                  Join the
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #6750A4 0%, #4A90E2 50%, #4CAF50 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Sustainability Revolution
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
                  Be part of the paradigm shift. No forms to fill, no manuals to read. 
                  Just conversation and results.
                </MD3Typography>

                {/* Benefits */}
                <MD3Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 6 }}>
                  {benefits.map((benefit, index) => (
                    <MD3Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
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
                        }}
                      >
                        {React.cloneElement(benefit.icon, { 
                          sx: { color: '#B794F4', fontSize: 24 } 
                        })}
                      </MD3Box>
                      <MD3Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {benefit.title}
                      </MD3Typography>
                      <MD3Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {benefit.description}
                      </MD3Typography>
                    </MD3Box>
                  ))}
                </MD3Box>

                {/* Testimonial */}
                <MD3Card
                  variant="outlined"
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                  }}
                >
                  <MD3Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 2,
                    }}
                  >
                    "We replaced our entire sustainability reporting team's workflow with blipee. 
                    What took weeks now takes minutes. It's not an improvement - it's a revolution."
                  </MD3Typography>
                  <MD3Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MD3Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                      }}
                    />
                    <MD3Box>
                      <MD3Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Sarah Chen
                      </MD3Typography>
                      <MD3Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Head of Sustainability, TechCorp
                      </MD3Typography>
                    </MD3Box>
                  </MD3Box>
                </MD3Card>
              </MD3Box>

              {/* Right Side - Signup Form */}
              <MD3Box sx={{ flex: '0 0 auto', width: { xs: '100%', lg: '480px' } }}>
                <MD3Card
                  variant="elevated"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    p: { xs: 4, sm: 5 },
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
                      Create Your Account
                    </MD3Typography>
                    <MD3Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Join thousands already living in 2030
                    </MD3Typography>
                  </MD3Box>

                  {/* Google Signup */}
                  <MD3Button
                    variant="outlined"
                    fullWidth
                    onClick={handleGoogleSignup}
                    disabled={isSubmitting}
                    startIcon={<GoogleIcon />}
                    sx={{
                      py: 1.5,
                      mb: 3,
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

                  <MD3Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
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
                      or sign up with email
                    </MD3Typography>
                  </MD3Box>

                  {/* Error Message */}
                  {error && (
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
                        {error}
                      </MD3Typography>
                    </MD3Box>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <MD3Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <MD3TextField
                        fullWidth
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange('fullName')}
                        error={!!formErrors.fullName}
                        helperText={formErrors.fullName}
                        disabled={isSubmitting}
                        startAdornment={<PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
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
                        type="email"
                        label="Work Email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        disabled={isSubmitting}
                        startAdornment={<EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                        InputProps={{
                          sx: {
                            backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
                            color: '#ffffff !important',
                            '& input': {
                              color: '#ffffff !important',
                            }
                          }
                        }}
                        sx={darkTextFieldStyles}
                      />

                      <MD3TextField
                        fullWidth
                        label="Organization Name"
                        value={formData.organizationName}
                        onChange={handleInputChange('organizationName')}
                        error={!!formErrors.organizationName}
                        helperText={formErrors.organizationName}
                        disabled={isSubmitting}
                        startAdornment={<BusinessIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
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
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        disabled={isSubmitting}
                        autoComplete="new-password"
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

                      {/* Password Requirements */}
                      {formData.password && (
                        <MD3Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                          {passwordRequirements.map((req, index) => (
                            <MD3Chip
                              key={index}
                              label={req.label}
                              size="small"
                              icon={req.test(formData.password) ? <CheckCircle /> : undefined}
                              sx={{
                                backgroundColor: req.test(formData.password)
                                  ? 'rgba(76, 175, 80, 0.1)'
                                  : 'rgba(255, 255, 255, 0.05)',
                                color: req.test(formData.password)
                                  ? '#4CAF50'
                                  : 'rgba(255, 255, 255, 0.5)',
                                border: `1px solid ${
                                  req.test(formData.password)
                                    ? 'rgba(76, 175, 80, 0.3)'
                                    : 'rgba(255, 255, 255, 0.1)'
                                }`,
                              }}
                            />
                          ))}
                        </MD3Box>
                      )}

                      <MD3TextField
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        startAdornment={<LockIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                        endAdornment={
                          <MD3Box
                            component="button"
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                      <MD3Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MD3Checkbox
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange('agreeToTerms')}
                          disabled={isSubmitting}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6750A4',
                            }
                          }}
                        />
                        <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          I agree to the{' '}
                          <MD3Button
                            variant="text"
                            sx={{
                              color: '#B794F4',
                              textTransform: 'none',
                              p: 0,
                              minWidth: 'auto',
                              '&:hover': {
                                color: '#D6BCFA',
                                background: 'transparent',
                              }
                            }}
                          >
                            Terms of Service
                          </MD3Button>
                          {' '}and{' '}
                          <MD3Button
                            variant="text"
                            sx={{
                              color: '#B794F4',
                              textTransform: 'none',
                              p: 0,
                              minWidth: 'auto',
                              '&:hover': {
                                color: '#D6BCFA',
                                background: 'transparent',
                              }
                            }}
                          >
                            Privacy Policy
                          </MD3Button>
                        </MD3Typography>
                      </MD3Box>
                      {formErrors.agreeToTerms && (
                        <MD3Typography variant="caption" sx={{ color: '#f44336', mt: -1 }}>
                          {formErrors.agreeToTerms}
                        </MD3Typography>
                      )}

                      <MD3Button
                        type="submit"
                        variant="filled"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{
                          py: 1.5,
                          mt: 2,
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
                            Creating your account...
                          </MD3Box>
                        ) : (
                          'Create Account'
                        )}
                      </MD3Button>
                    </MD3Box>
                  </form>

                  {/* Footer */}
                  <MD3Box sx={{ mt: 4, textAlign: 'center' }}>
                    <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Already have an account?{' '}
                      <MD3Button
                        variant="text"
                        onClick={() => router.push('/login')}
                        sx={{
                          color: '#B794F4',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            color: '#D6BCFA',
                          }
                        }}
                      >
                        Sign in
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
                      label="Enterprise Security"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4CAF50',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                      }}
                    />
                    <MD3Chip
                      icon={<CheckCircle />}
                      label="SOC 2 Type II"
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

        {/* Animations and Dark Mode Overrides */}
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

export default SignupPage;