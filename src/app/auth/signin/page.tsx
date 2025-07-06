'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Divider,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { signInSchema, type SignInFormData } from '@/lib/auth/validation';
import { useAuth, useRequireNoAuth } from '@/lib/auth/hooks';
import { useTranslation } from '@/lib/i18n';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if already authenticated
  useRequireNoAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    
    try {
      await signIn(data.email, data.password);
      router.push(redirect as any);
    } catch (err: any) {
      if (err.message?.includes('Invalid login credentials')) {
        setError(t('auth.signin.errors.invalidCredentials'));
      } else {
        setError(err.message || t('errors.generic'));
      }
    }
  };

  return (
    <AuthLayout
      title={t('auth.signin.title')}
      subtitle={t('auth.signin.subtitle')}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t('auth.signin.email')}
              type="email"
              autoComplete="email"
              autoFocus
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
              label={t('auth.signin.password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={t('auth.signin.rememberMe')}
              />
            )}
          />
          
          <Link href="/auth/reset-password" passHref>
            <Typography
              variant="bodyMedium"
              color="primary"
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('auth.signin.forgotPassword')}
            </Typography>
          </Link>
        </Box>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : (
            t('auth.signin.submit')
          )}
        </Button>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="bodySmall" color="text.secondary">
            {t('auth.signin.orContinueWith')}
          </Typography>
        </Divider>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            disabled
            sx={{ textTransform: 'none' }}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            disabled
            sx={{ textTransform: 'none' }}
          >
            GitHub
          </Button>
        </Box>
        
        <Typography variant="bodyMedium" align="center">
          {t('auth.signin.noAccount')}{' '}
          <Link href="/auth/signup" passHref>
            <Typography
              component="span"
              color="primary"
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('auth.signin.signupLink')}
            </Typography>
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}