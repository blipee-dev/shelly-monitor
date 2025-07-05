'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Skeleton,
  Alert,
  Button,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Refresh,
  DeviceThermostat,
  PowerSettingsNew,
  MotionPhotosAuto,
  ElectricBolt,
  TrendingUp,
  TrendingDown,
  WaterDrop,
  Add,
  Settings,
  Lightbulb,
  Home,
  Security,
  Schedule,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRequireAuth } from '@/lib/auth/hooks';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { useDeviceRealtime } from '@/lib/hooks/useDeviceRealtime';
import { format } from 'date-fns';

interface StatCard {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export default function DashboardPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();
  const { devices, fetchDevices, isLoading, error } = useDeviceStore();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Enable real-time subscriptions
  useDeviceRealtime();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (!authLoading && user) {
      fetchDevices();
    }
  }, [fetchDevices, authLoading, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDevices();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate statistics from devices
  const calculateStats = () => {
    const activeDevices = devices.filter(d => d.is_online).length;
    const totalPower = devices.reduce((sum, device) => {
      if (device.status?.power) {
        return sum + (device.status.power || 0);
      }
      return sum;
    }, 0);
    const totalEnergy = devices.reduce((sum, device) => {
      if (device.status?.energy) {
        return sum + (device.status.energy || 0);
      }
      return sum;
    }, 0);
    const motionDetected = devices.some(d => 
      d.device_type === 'motion' && d.status?.motion
    );
    const avgTemperature = devices.reduce((sum, device, _, arr) => {
      if (device.status?.temperature !== undefined) {
        return sum + (device.status.temperature / arr.length);
      }
      return sum;
    }, 0);

    return {
      activeDevices,
      totalPower,
      totalEnergy,
      motionDetected,
      avgTemperature,
    };
  };

  const stats = calculateStats();

  const statCards: StatCard[] = [
    {
      title: 'Active Devices',
      value: stats.activeDevices,
      unit: `of ${devices.length}`,
      icon: <PowerSettingsNew />,
      color: theme.palette.success.main,
      trend: { value: 12, direction: 'up' },
    },
    {
      title: 'Current Power',
      value: stats.totalPower.toFixed(1),
      unit: 'W',
      icon: <ElectricBolt />,
      color: theme.palette.warning.main,
      trend: { value: 5, direction: 'down' },
    },
    {
      title: 'Energy Today',
      value: (stats.totalEnergy / 1000).toFixed(2),
      unit: 'kWh',
      icon: <TrendingUp />,
      color: theme.palette.info.main,
      trend: { value: 8, direction: 'up' },
    },
    {
      title: 'Temperature',
      value: stats.avgTemperature.toFixed(1),
      unit: '°C',
      icon: <DeviceThermostat />,
      color: theme.palette.error.main,
    },
  ];

  // Group devices by room/location
  const devicesByRoom = devices.reduce((acc, device) => {
    const room = device.room || 'Unassigned';
    if (!acc[room]) acc[room] = [];
    acc[room].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  const renderDeviceCard = (device: typeof devices[0]) => {
    const isOnline = device.is_online;
    const isPowerDevice = ['plus_2pm', 'plus_1pm', 'dimmer_2'].includes(device.device_type);
    const isMotionDevice = ['motion_2', 'blu_motion'].includes(device.device_type);
    
    return (
      <Card
        key={device.id}
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
            borderColor: theme.palette.primary.main,
          },
        }}
        onClick={() => router.push(`/devices/${device.id}`)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isPowerDevice && <Lightbulb color={isOnline ? 'primary' : 'disabled'} />}
              {isMotionDevice && <MotionPhotosAuto color={isOnline ? 'primary' : 'disabled'} />}
              {!isPowerDevice && !isMotionDevice && <Home color={isOnline ? 'primary' : 'disabled'} />}
              <Typography variant="h6" noWrap sx={{ maxWidth: 150 }}>
                {device.name}
              </Typography>
            </Box>
            <Chip
              label={isOnline ? 'Online' : 'Offline'}
              size="small"
              color={isOnline ? 'success' : 'default'}
              variant={isOnline ? 'filled' : 'outlined'}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {device.room || 'No room assigned'}
          </Typography>

          {isOnline && device.status && (
            <Box sx={{ mt: 2 }}>
              {isPowerDevice && device.status.switches && (
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  {device.status.switches.map((sw, idx) => (
                    <Chip
                      key={idx}
                      label={`CH${idx + 1}: ${sw.output ? 'ON' : 'OFF'}`}
                      size="small"
                      color={sw.output ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              
              {device.status.power !== undefined && (
                <Typography variant="body2">
                  Power: {device.status.power.toFixed(1)} W
                </Typography>
              )}
              
              {device.status.temperature !== undefined && (
                <Typography variant="body2">
                  Temp: {device.status.temperature.toFixed(1)}°C
                </Typography>
              )}
              
              {isMotionDevice && (
                <Typography variant="body2">
                  Motion: {device.status.motion ? 'Detected' : 'Clear'}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (authLoading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, {user?.user_metadata?.name || user?.email}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(currentTime, 'EEEE, MMMM d, yyyy • h:mm a')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{ 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/devices/new')}
            >
              Add Device
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Skeleton variant="rounded" height={140} />
              </Grid>
            ))
          ) : (
            statCards.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    background: alpha(stat.color, 0.05),
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    {stat.trend && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {stat.trend.direction === 'up' ? (
                          <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        ) : (
                          <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 20 }} />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {stat.trend.value}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: stat.color }}>
                    {stat.value}
                    {stat.unit && (
                      <Typography component="span" variant="h6" sx={{ ml: 0.5, fontWeight: 400 }}>
                        {stat.unit}
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Schedule />}
                    onClick={() => router.push('/automations')}
                    sx={{ py: 2 }}
                  >
                    Automations
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TrendingUp />}
                    onClick={() => router.push('/analytics')}
                    sx={{ py: 2 }}
                  >
                    Analytics
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={() => router.push('/alerts')}
                    sx={{ py: 2 }}
                  >
                    Alerts
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Settings />}
                    onClick={() => router.push('/settings')}
                    sx={{ py: 2 }}
                  >
                    Settings
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">API Health</Typography>
                    <Chip label="Operational" size="small" color="success" />
                  </Box>
                  <LinearProgress variant="determinate" value={100} color="success" />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Device Sync</Typography>
                    <Typography variant="body2">Last: 2 min ago</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={85} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Devices Grid */}
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Devices by Room
        </Typography>
        
        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Skeleton variant="rounded" height={180} />
              </Grid>
            ))}
          </Grid>
        ) : devices.length === 0 ? (
          // Empty state
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Home sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No devices connected
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add your first Shelly device to start monitoring and controlling your smart home
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/devices/new')}
              size="large"
            >
              Add Your First Device
            </Button>
          </Paper>
        ) : (
          Object.entries(devicesByRoom).map(([room, roomDevices]) => (
            <Box key={room} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                {room} ({roomDevices.length} devices)
              </Typography>
              <Grid container spacing={3}>
                {roomDevices.map(device => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={device.id}>
                    {renderDeviceCard(device)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}

        {/* CSS for rotation animation */}
        <style jsx global>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Box>
    </DashboardLayout>
  );
}