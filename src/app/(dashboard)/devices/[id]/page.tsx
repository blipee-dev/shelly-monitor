'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Paper,
  Grid,
} from '@mui/material';
import NextLink from 'next/link';
import {
  NavigateNext as NavigateNextIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Power as PowerIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  NetworkCheck as NetworkIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';
import { deviceApi } from '@/lib/api/devices';
import { Device, DeviceData } from '@/types/device';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { STATUS_COLORS, DEVICE_TYPE_NAMES } from '@/lib/devices/constants';
import { formatUptime, isPlus2PMData, isPlus1PMData, isDimmer2Data } from '@/lib/devices/utils';
import { RelayControl } from '@/components/devices/controls/RelayControl';
import { DimmerControl } from '@/components/devices/controls/DimmerControl';
import { MotionSensor } from '@/components/devices/sensors/MotionSensor';
import { DeviceChart } from '@/components/devices/DeviceChart';
import { enqueueSnackbar } from 'notistack';
import { useDeviceRealtime } from '@/lib/hooks/useDeviceRealtime';

interface DeviceDetailPageProps {
  params: {
    id: string;
  };
}

export default function DeviceDetailPage({ params }: DeviceDetailPageProps) {
  const router = useRouter();
  const { removeDevice, setDeviceData } = useDeviceStore();
  const [device, setDevice] = useState<Device | null>(null);
  const [deviceData, setLocalDeviceData] = useState<DeviceData | null>(null);
  const [recentData, setRecentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadDevice();
  }, [params.id]);

  // Subscribe to real-time updates
  useDeviceRealtime({
    deviceId: params.id,
    onUpdate: (event) => {
      if (event.type === 'data') {
        setLocalDeviceData(event.data as DeviceData);
        setDeviceData(event.device_id, event.data as DeviceData);
      } else if (event.type === 'status') {
        setDevice((prev) => 
          prev ? { ...prev, ...(event.data as Partial<Device>) } : prev
        );
      }
    },
  });

  const loadDevice = async () => {
    try {
      setLoading(true);
      const response = await deviceApi.get(params.id);
      setDevice(response.device);
      setLocalDeviceData(response.data);
      setRecentData(response.recent_data || []);
      
      // Update global store
      setDeviceData(params.id, response.data);
    } catch (error) {
      console.error('Failed to load device:', error);
      setError('Failed to load device');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!device) return;
    
    try {
      setRefreshing(true);
      
      // Fetch latest status from device
      const status = await deviceApi.fetchStatus(device.id);
      
      // Reload device data
      await loadDevice();
      
      enqueueSnackbar('Device data refreshed', { variant: 'success' });
    } catch (error) {
      console.error('Failed to refresh device:', error);
      enqueueSnackbar('Failed to refresh device', { variant: 'error' });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!device) return;

    if (confirm(`Are you sure you want to delete ${device.name}?`)) {
      try {
        await deviceApi.delete(device.id);
        removeDevice(device.id);
        enqueueSnackbar('Device deleted successfully', { variant: 'success' });
        router.push('/devices');
      } catch (error) {
        console.error('Failed to delete device:', error);
        enqueueSnackbar('Failed to delete device', { variant: 'error' });
      }
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

  const renderControls = () => {
    if (!deviceData) return null;

    if (isPlus2PMData(deviceData)) {
      return (
        <Grid container spacing={2}>
          {deviceData.relays.map((relay, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <RelayControl
                device={device}
                relay={relay}
                relayIndex={index}
                data={deviceData}
                onUpdate={loadDevice}
              />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (isPlus1PMData(deviceData)) {
      return (
        <RelayControl
          device={device}
          relay={deviceData.relay}
          relayIndex={0}
          data={deviceData}
          onUpdate={loadDevice}
        />
      );
    }

    if (isDimmer2Data(deviceData)) {
      return (
        <DimmerControl
          device={device}
          data={deviceData}
          onUpdate={loadDevice}
        />
      );
    }

    return (
      <MotionSensor
        device={device}
        data={deviceData}
      />
    );
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          component={NextLink}
          href="/devices"
          color="inherit"
          underline="hover"
        >
          Devices
        </Link>
        <Typography color="text.primary">{device.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >
        <Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <PowerIcon
              sx={{
                fontSize: 32,
                color: STATUS_COLORS[device.status],
              }}
            />
            <Typography variant="h4" fontWeight="medium">
              {device.name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} mt={1}>
            <Chip
              label={DEVICE_TYPE_NAMES[device.type]}
              size="small"
              variant="outlined"
            />
            <Chip
              label={device.status}
              size="small"
              sx={{
                backgroundColor: `${STATUS_COLORS[device.status]}20`,
                color: STATUS_COLORS[device.status],
                fontWeight: 'medium',
              }}
            />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/devices/${device.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Overview" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Device Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Device Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <NetworkIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        IP Address
                      </Typography>
                    </Stack>
                    <Typography>{device.ip_address}</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MemoryIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        MAC Address
                      </Typography>
                    </Stack>
                    <Typography>{device.mac_address}</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                    </Stack>
                    <Typography>{device.location || '-'}</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Last Seen
                      </Typography>
                    </Stack>
                    <Typography>{formatUptime(device.last_seen)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Controls */}
          <Grid size={{ xs: 12, md: 8 }}>
            {renderControls()}
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <DeviceChart
          device={device}
          data={recentData}
        />
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Device Settings
            </Typography>
            <Typography color="text.secondary">
              Device settings and configuration options will be available here.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}