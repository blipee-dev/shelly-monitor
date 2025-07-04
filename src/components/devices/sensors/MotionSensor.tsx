'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  Avatar,
  Grid,
} from '@mui/material';
import {
  DirectionsWalk as MotionIcon,
  LightMode as LightIcon,
  Battery90 as BatteryIcon,
  Thermostat as TempIcon,
  Water as HumidityIcon,
  Vibration as VibrationIcon,
  Bluetooth as BluetoothIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { Device, Motion2Data, BluMotionData } from '@/types/device';
import { formatTemperature, formatBattery, getBatteryStatus, isMotion2Data, isBluMotionData } from '@/lib/devices/utils';

interface MotionSensorProps {
  device: Device;
  data: Motion2Data | BluMotionData;
}

export function MotionSensor({ device, data }: MotionSensorProps) {
  const batteryStatus = getBatteryStatus(data.battery);
  const batteryColors = {
    full: '#4caf50',
    good: '#8bc34a',
    low: '#ff9800',
    critical: '#f44336',
  };

  return (
    <Grid container spacing={2}>
      {/* Motion Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" gutterBottom>
                Motion Detection
              </Typography>
              
              <Box textAlign="center" py={2}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    bgcolor: data.motion ? 'error.main' : 'action.disabled',
                  }}
                >
                  <MotionIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" mt={2}>
                  {data.motion ? 'Motion Detected' : 'No Motion'}
                </Typography>
                {data.motion && (
                  <Chip
                    label="ACTIVE"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              {/* Vibration for Motion 2 */}
              {isMotion2Data(data) && data.vibration && (
                <Chip
                  label="Vibration Detected"
                  icon={<VibrationIcon />}
                  color="warning"
                  size="small"
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Sensor Data */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sensor Data
            </Typography>
            
            <Stack spacing={2}>
              {/* Light Level */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LightIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Light Level
                  </Typography>
                </Stack>
                <Typography variant="h6">{data.lux} lux</Typography>
              </Box>

              {/* Temperature */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TempIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Temperature
                  </Typography>
                </Stack>
                <Typography variant="h6">
                  {formatTemperature(data.temperature)}
                </Typography>
              </Box>

              {/* Humidity for BLU Motion */}
              {isBluMotionData(data) && (
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <HumidityIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Humidity
                    </Typography>
                  </Stack>
                  <Typography variant="h6">{data.humidity}%</Typography>
                </Box>
              )}

              {/* Battery */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BatteryIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Battery
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">
                    {formatBattery(data.battery)}
                  </Typography>
                  <CircleIcon
                    sx={{
                      fontSize: 12,
                      color: batteryColors[batteryStatus],
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: batteryColors[batteryStatus] }}
                  >
                    {batteryStatus}
                  </Typography>
                </Stack>
              </Box>

              {/* Bluetooth Signal for BLU Motion */}
              {isBluMotionData(data) && (
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BluetoothIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Signal Strength
                    </Typography>
                  </Stack>
                  <Typography variant="h6">{data.rssi} dBm</Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Rotation Data for BLU Motion */}
      {isBluMotionData(data) && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Orientation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      X Axis
                    </Typography>
                    <Typography variant="h6">
                      {data.rotation.x.toFixed(1)}°
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Y Axis
                    </Typography>
                    <Typography variant="h6">
                      {data.rotation.y.toFixed(1)}°
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Z Axis
                    </Typography>
                    <Typography variant="h6">
                      {data.rotation.z.toFixed(1)}°
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}