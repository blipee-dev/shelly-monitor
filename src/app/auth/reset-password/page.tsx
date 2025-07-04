'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/auth/validation';
import { useAuth, useRequireNoAuth } from '@/lib/auth/hooks';
import { useTranslation } from '@/lib/i18n';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Redirect if already authenticated
  useRequireNoAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    
    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('errors.generic'));
    }
  };

  if (success) {
    return (
      <AuthLayout
        title={t('auth.resetPassword.success.title')}
        subtitle={t('auth.resetPassword.success.message')}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.location.href = '/auth/signin'}
            sx={{ mt: 2 }}
          >
            {t('auth.resetPassword.backToLogin')}
          </Button>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('auth.resetPassword.title')}
      subtitle={t('auth.resetPassword.subtitle')}
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
              label={t('auth.resetPassword.email')}
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
              sx={{ mb: 3 }}
            />
          )}
        />
        
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
            t('auth.resetPassword.submit')
          )}
        </Button>
        
        <Link href="/auth/signin" passHref>
          <Button
            fullWidth
            variant="text"
            startIcon={<ArrowBackIcon />}
          >
            {t('auth.resetPassword.backToLogin')}
          </Button>
        </Link>
      </Box>
    </AuthLayout>
  );
}