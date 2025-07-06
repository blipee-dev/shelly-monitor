'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Stack, 
  Breadcrumbs, 
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import NextLink from 'next/link';
import { DeviceForm } from '@/components/devices/DeviceForm';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { deviceApi } from '@/lib/api/devices';
import { Device } from '@/types/device';

interface EditDevicePageProps {
  params: {
    id: string;
  };
}

export default function EditDevicePage({ params }: EditDevicePageProps) {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDevice();
  }, [params.id]);

  const loadDevice = async () => {
    try {
      setLoading(true);
      const response = await deviceApi.get(params.id);
      setDevice(response.device);
    } catch (error) {
      console.error('Failed to load device:', error);
      setError('Failed to load device');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !device) {
    return (
      <Box>
        <Alert severity="error">
          {error || 'Device not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          href="/devices"
          color="inherit"
          underline="hover"
        >
          Devices
        </Link>
        <Link
          href={`/devices/${device.id}`}
          color="inherit"
          underline="hover"
        >
          {device.name}
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Stack mb={3}>
        <Typography variant="h4" fontWeight="medium">
          Edit Device
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Update device configuration and settings
        </Typography>
      </Stack>

      {/* Form */}
      <Box maxWidth={800}>
        <DeviceForm device={device} />
      </Box>
    </Box>
  );
}