'use client';

import { Box, Typography, Stack, Breadcrumbs, Link } from '@mui/material';
import NextLink from 'next/link';
import { DeviceForm } from '@/components/devices/DeviceForm';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

export default function NewDevicePage() {
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
        <Typography color="text.primary">Add Device</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Stack mb={3}>
        <Typography variant="h4" fontWeight="medium">
          Add New Device
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Connect a new Shelly device to your monitoring system
        </Typography>
      </Stack>

      {/* Form */}
      <Box maxWidth={800}>
        <DeviceForm />
      </Box>
    </Box>
  );
}