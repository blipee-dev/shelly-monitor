'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  NetworkCheck as NetworkCheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Device, DeviceFormData, DeviceType } from '@/types/device';
import { DEVICE_TYPE_NAMES, DEVICE_TYPE_DESCRIPTIONS } from '@/lib/devices/constants';
import { deviceApi } from '@/lib/api/devices';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { enqueueSnackbar } from 'notistack';

// Validation schema
const deviceSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  type: z.enum(['plus2pm', 'plus1pm', 'dimmer2', 'motion2', 'blu_motion'] as const),
  ip_address: z
    .string()
    .min(1, 'IP address is required')
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address'
    ),
  mac_address: z
    .string()
    .min(1, 'MAC address is required')
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      'Invalid MAC address'
    ),
  location: z.string().optional(),
  group_id: z.string().optional(),
});

type DeviceFormSchema = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
  device?: Device;
  onSuccess?: () => void;
}

export function DeviceForm({ device, onSuccess }: DeviceFormProps) {
  const router = useRouter();
  const { groups, addDevice, updateDevice, setGroups } = useDeviceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const isEdit = !!device;

  // Load groups on mount
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const groupList = await deviceGroupApi.list();
      setGroups(groupList);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DeviceFormSchema>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: device?.name || '',
      type: device?.type || 'plus2pm',
      ip_address: device?.ip_address || '',
      mac_address: device?.mac_address || '',
      location: device?.location || '',
      group_id: device?.group_id || '',
    },
  });

  const watchedIpAddress = watch('ip_address');
  const watchedType = watch('type');

  const onSubmit = async (data: DeviceFormSchema) => {
    try {
      setIsSubmitting(true);

      if (isEdit) {
        const updated = await deviceApi.update(device.id, data);
        updateDevice(device.id, updated);
        enqueueSnackbar('Device updated successfully', { variant: 'success' });
      } else {
        const created = await deviceApi.create(data);
        addDevice(created);
        enqueueSnackbar('Device added successfully', { variant: 'success' });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/devices');
      }
    } catch (error) {
      console.error('Failed to save device:', error);
      enqueueSnackbar(
        isEdit ? 'Failed to update device' : 'Failed to add device',
        { variant: 'error' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async () => {
    if (!watchedIpAddress) {
      setTestResult({
        success: false,
        message: 'Please enter an IP address',
      });
      return;
    }

    try {
      setIsTesting(true);
      setTestResult(null);

      // Try to fetch device status
      const response = await fetch(`http://${watchedIpAddress}/status`, {
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Try to auto-detect device info
        if (data.sys?.device) {
          setValue('name', data.sys.device.name || '');
          setValue('mac_address', data.sys.mac || '');
        }

        setTestResult({
          success: true,
          message: 'Connection successful! Device is online.',
        });
      } else {
        setTestResult({
          success: false,
          message: `Connection failed: ${response.statusText}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection failed. Please check the IP address and ensure the device is online.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Device Type */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Device Type</InputLabel>
                  <Select {...field} label="Device Type">
                    {Object.entries(DEVICE_TYPE_NAMES).map(([key, name]) => (
                      <MenuItem key={key} value={key}>
                        <Stack>
                          <Typography variant="body2">{name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {DEVICE_TYPE_DESCRIPTIONS[key as DeviceType]}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && (
                    <FormHelperText>{errors.type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Device Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Device Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* IP Address */}
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Controller
                name="ip_address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="IP Address"
                    fullWidth
                    error={!!errors.ip_address}
                    helperText={errors.ip_address?.message}
                    placeholder="192.168.1.100"
                  />
                )}
              />
              <Tooltip title="Test connection">
                <span>
                  <IconButton
                    onClick={handleTestConnection}
                    disabled={!watchedIpAddress || isTesting}
                    sx={{ mt: 1 }}
                  >
                    {isTesting ? (
                      <CircularProgress size={24} />
                    ) : (
                      <NetworkCheckIcon />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            {/* Test Result */}
            {testResult && (
              <Alert severity={testResult.success ? 'success' : 'error'}>
                {testResult.message}
              </Alert>
            )}

            {/* MAC Address */}
            <Controller
              name="mac_address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="MAC Address"
                  fullWidth
                  error={!!errors.mac_address}
                  helperText={errors.mac_address?.message}
                  placeholder="AA:BB:CC:DD:EE:FF"
                  onChange={(e) => {
                    // Auto-format MAC address
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-F0-9]/g, '')
                      .match(/.{1,2}/g)
                      ?.join(':') || '';
                    field.onChange(value.substring(0, 17));
                  }}
                />
              )}
            />

            {/* Location */}
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location (optional)"
                  fullWidth
                  placeholder="Living Room, Kitchen, etc."
                />
              )}
            />

            {/* Group */}
            {groups.length > 0 && (
              <Controller
                name="group_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Group (optional)</InputLabel>
                    <Select {...field} label="Group (optional)">
                      <MenuItem value="">
                        <em>No group</em>
                      </MenuItem>
                      {groups.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => router.push('/devices')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add'} Device
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}