'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { signUpSchema, type SignUpFormData } from '@/lib/auth/validation';
import { useAuth, useRequireNoAuth } from '@/lib/auth/hooks';
import { useTranslation } from '@/lib/i18n';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Redirect if already authenticated
  useRequireNoAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    
    try {
      await signUp(data.email, data.password, {
        name: data.name,
      });
      setSuccess(true);
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError(t('auth.signup.errors.emailExists'));
      } else {
        setError(err.message || t('errors.generic'));
      }
    }
  };

  if (success) {
    return (
      <AuthLayout
        title={t('auth.signup.success.title')}
        subtitle={t('auth.signup.success.message')}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/auth/signin')}
            sx={{ mt: 2 }}
          >
            {t('auth.signin.title')}
          </Button>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('auth.signup.title')}
      subtitle={t('auth.signup.subtitle')}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t('auth.signup.name')}
              autoComplete="name"
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}
        />
        
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t('auth.signup.email')}
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}
        />
        
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t('auth.signup.password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}
        />
        
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t('auth.signup.confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}
        />
        
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox 
                  {...field} 
                  checked={field.value}
                  color={errors.acceptTerms ? 'error' : 'primary'}
                />
              }
              label={
                <Typography variant="bodyMedium">
                  {t('auth.signup.terms')}
                </Typography>
              }
              sx={{ mb: 1 }}
            />
          )}
        />
        {errors.acceptTerms && (
          <FormHelperText error sx={{ mb: 2 }}>
            {errors.acceptTerms.message}
          </FormHelperText>
        )}
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mb: 3 }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : (
            t('auth.signup.submit')
          )}
        </Button>
        
        <Typography variant="bodyMedium" align="center">
          {t('auth.signup.hasAccount')}{' '}
          <Link href="/auth/signin" passHref>
            <Typography
              component="span"
              color="primary"
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('auth.signup.signinLink')}
            </Typography>
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}