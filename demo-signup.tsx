import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
// MD3 Components - same as login page
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
  CheckCircle,
  Rocket,
  TrendingUp,
  Speed,
  Psychology as AIIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  WorkOutline as RoleIcon,
  CategoryOutlined as IndustryIcon,
  AutoAwesome,
  Groups,
} from '@mui/icons-material';

const DemoSignupPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    role: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/demo-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create demo account');
      }
      
      if (data.magicLink) {
        window.location.href = data.magicLink;
      } else {
        router.push('/demo-dashboard-new?new_user=true');
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to create demo account');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.companyName;

  const roleOptions = [
    { value: '', label: 'Select role' },
    { value: 'ceo', label: 'CEO' },
    { value: 'sustainability_director', label: 'Sustainability Director' },
    { value: 'operations_manager', label: 'Operations Manager' },
    { value: 'facility_manager', label: 'Facility Manager' },
    { value: 'analyst', label: 'Data Analyst' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'other', label: 'Other' },
  ];

  const industryOptions = [
    { value: '', label: 'Select industry' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'financial_services', label: 'Financial Services' },
    { value: 'retail', label: 'Retail' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'education', label: 'Education' },
    { value: 'government', label: 'Government' },
    { value: 'other', label: 'Other' },
  ];

  const features = [
    {
      icon: <AIIcon />,
      title: 'Autonomous Compliance Engine',
      description: 'AI monitors 15+ frameworks, prevents violations before they happen.',
    },
    {
      icon: <Speed />,
      title: 'Predictive Risk Detection',
      description: '70% of sustainability issues caught before they impact operations.',
    },
    {
      icon: <TrendingUp />,
      title: 'A+++ Impact Simulator',
      description: 'Model complex scenarios with 20+ parameters across 7 categories.',
    },
    {
      icon: <Groups />,
      title: 'Executive AI Advisor',
      description: 'Strategic insights and recommendations for C-suite decisions.',
    },
  ];

  return (
    <>
      <Head>
        <title>Join 10,000+ Companies Ditching Forms Forever | blipee Demo</title>
        <meta name="description" content="While your competitors waste 30 minutes per data entry, you'll be done in 30 seconds. See why Fortune 500s are switching. 60-second setup. Zero BS." />
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
        {/* Dynamic gradient background - same as login */}
        <MD3Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 111, 0, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.05) 0%, transparent 50%),
              #000000
            `,
            transition: 'background 0.3s ease',
            zIndex: 0,
          }}
        />

        {/* Animated background elements - same as login */}
        <MD3Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(255, 111, 0, 0.1) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.1) 0%, transparent 70%))',
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
                      background: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(255, 111, 0, 0.3)',
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
                  Stop Managing Data.
                  <br />
                  <MD3Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 50%, #6750A4 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    Start Having Conversations
                  </MD3Box>
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
                  While others click through 47 screens to add one data point, 
                  you'll say "Track our Miami fleet emissions" and move on with your life.
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
                          background: 'rgba(255, 111, 0, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {React.cloneElement(feature.icon, { 
                          sx: { color: '#FF9800', fontSize: 24 } 
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

              </MD3Box>

              {/* Right Side - Registration Form */}
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
                      60 Seconds to Revolution
                    </MD3Typography>
                    <MD3Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Join 10,000+ companies who said "never again" to forms
                    </MD3Typography>
                  </MD3Box>

                  {/* Error Message */}
                  {error && (
                    <MD3Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
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
                    <MD3Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Name fields row */}
                      <MD3Box sx={{ display: 'flex', gap: 2 }}>
                        <MD3TextField
                          fullWidth
                          label="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange('firstName')}
                          required
                          disabled={loading}
                          startAdornment={<PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                          autoComplete="given-name"
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
                              borderColor: '#FF6F00',
                            },
                            '& .MuiFormHelperText-root': {
                              color: 'rgba(255, 255, 255, 0.6)',
                            },
                          }}
                        />
                        
                        <MD3TextField
                          fullWidth
                          label="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange('lastName')}
                          required
                          disabled={loading}
                          autoComplete="family-name"
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
                              borderColor: '#FF6F00',
                            },
                            '& .MuiFormHelperText-root': {
                              color: 'rgba(255, 255, 255, 0.6)',
                            },
                          }}
                        />
                      </MD3Box>
                      
                      <MD3TextField
                        fullWidth
                        type="email"
                        label="Work Email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                        disabled={loading}
                        startAdornment={<EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                        autoComplete="email"
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
                        label="Company Name"
                        value={formData.companyName}
                        onChange={handleInputChange('companyName')}
                        required
                        disabled={loading}
                        startAdornment={<BusinessIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                        autoComplete="organization"
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
                      
                      {/* Role and Industry row */}
                      <MD3Box sx={{ display: 'flex', gap: 2 }}>
                        <MD3TextField
                          select
                          fullWidth
                          label="Your Role"
                          value={formData.role}
                          onChange={handleInputChange('role')}
                          disabled={loading}
                          startAdornment={<RoleIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                          SelectProps={{
                            native: true,
                          }}
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
                              borderColor: '#FF6F00',
                            },
                            '& .MuiSelect-icon': {
                              color: 'rgba(255, 255, 255, 0.5)',
                            },
                          }}
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </MD3TextField>
                        
                        <MD3TextField
                          select
                          fullWidth
                          label="Industry"
                          value={formData.industry}
                          onChange={handleInputChange('industry')}
                          disabled={loading}
                          startAdornment={<IndustryIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />}
                          SelectProps={{
                            native: true,
                          }}
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
                              borderColor: '#FF6F00',
                            },
                            '& .MuiSelect-icon': {
                              color: 'rgba(255, 255, 255, 0.5)',
                            },
                          }}
                        >
                          {industryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </MD3TextField>
                      </MD3Box>

                      <MD3Button
                        type="submit"
                        variant="filled"
                        fullWidth
                        disabled={!isFormValid || loading}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #FF6F00 0%, #6750A4 100%)',
                          boxShadow: '0 4px 20px rgba(255, 111, 0, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 30px rgba(255, 111, 0, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        {loading ? (
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
                            Creating your future...
                          </MD3Box>
                        ) : (
                          <>Start My Revolution <Rocket sx={{ ml: 1 }} /></>
                        )}
                      </MD3Button>

                      {/* Benefits */}
                      <MD3Box sx={{ textAlign: 'center' }}>
                        <MD3Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#FF6F00' }} />
                          <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Live data in 60 seconds (we timed it)
                          </MD3Typography>
                        </MD3Box>
                        <MD3Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#FF6F00' }} />
                          <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Full platform access (yes, everything)
                          </MD3Typography>
                        </MD3Box>
                        <MD3Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#FF6F00' }} />
                          <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Zero spam. Zero calls. Zero BS.
                          </MD3Typography>
                        </MD3Box>
                      </MD3Box>
                    </MD3Box>
                  </form>

                  {/* Footer */}
                  <MD3Box sx={{ mt: 4, textAlign: 'center' }}>
                    <MD3Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Ready to go all-in?{' '}
                      <MD3Button
                        variant="text"
                        onClick={() => router.push('/signup')}
                        sx={{
                          color: '#FF9800',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            color: '#FFB74D',
                          }
                        }}
                      >
                        Get the full experience
                      </MD3Button>
                    </MD3Typography>
                  </MD3Box>

                  {/* Security Note */}
                  <MD3Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                    <MD3Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        display: 'block',
                        textAlign: 'center',
                        lineHeight: 1.6,
                      }}
                    >
                      Your CFO will love us: SOC 2, GDPR, ISO 27001. 
                      <br />
                      Your IT team will too: Zero integration headaches.
                    </MD3Typography>
                  </MD3Box>
                </MD3Card>
              </MD3Box>
            </MD3Box>
          </MD3Box>
        </MD3Container>

        {/* Animations and Global Styles - same as login page */}
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
          
          /* Dark mode for select dropdowns */
          select option {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
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
            border-color: #FF6F00 !important;
          }
        `}</style>
      </MD3Box>
    </>
  );
};

export default DemoSignupPage;