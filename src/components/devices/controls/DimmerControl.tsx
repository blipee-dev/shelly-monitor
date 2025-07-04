'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  Power as PowerIcon,
  PowerOff as PowerOffIcon,
  Bolt as BoltIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Device, Dimmer2Data } from '@/types/device';
import { deviceApi } from '@/lib/api/devices';
import { formatPower, formatEnergy, formatTemperature } from '@/lib/devices/utils';
import { enqueueSnackbar } from 'notistack';

interface DimmerControlProps {
  device: Device;
  data: Dimmer2Data;
  onUpdate?: () => void;
}

export function DimmerControl({ device, data, onUpdate }: DimmerControlProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [brightness, setBrightness] = useState(data.brightness);
  const [isDragging, setIsDragging] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await deviceApi.controlDimmer({
        device_id: device.id,
        action: data.state === 'on' ? 'off' : 'on',
      });
      
      enqueueSnackbar(
        `Light turned ${data.state === 'on' ? 'off' : 'on'}`,
        { variant: 'success' }
      );
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to control dimmer:', error);
      enqueueSnackbar('Failed to control dimmer', { variant: 'error' });
    } finally {
      setIsToggling(false);
    }
  };

  const handleBrightnessChange = (_: Event, value: number | number[]) => {
    setBrightness(value as number);
  };

  const handleBrightnessCommit = async (_: Event, value: number | number[]) => {
    setIsDragging(false);
    const newBrightness = value as number;
    
    try {
      await deviceApi.controlDimmer({
        device_id: device.id,
        action: 'brightness',
        brightness: newBrightness,
      });
      
      enqueueSnackbar(`Brightness set to ${newBrightness}%`, { variant: 'success' });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to set brightness:', error);
      enqueueSnackbar('Failed to set brightness', { variant: 'error' });
      setBrightness(data.brightness);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LightModeIcon />
              <Typography variant="h6">Dimmer Control</Typography>
              {data.state === 'on' && (
                <Chip
                  label={`${data.brightness}%`}
                  size="small"
                  color="primary"
                />
              )}
            </Stack>
            
            <Switch
              checked={data.state === 'on'}
              onChange={handleToggle}
              disabled={isToggling || device.status !== 'online'}
              color="primary"
            />
          </Stack>

          {isToggling && <LinearProgress />}

          {/* Brightness Slider */}
          {data.state === 'on' && (
            <Box px={2}>
              <Typography gutterBottom>Brightness</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <LightModeIcon
                  fontSize="small"
                  sx={{ opacity: 0.5 }}
                />
                <Slider
                  value={brightness}
                  onChange={handleBrightnessChange}
                  onChangeCommitted={handleBrightnessCommit}
                  onMouseDown={() => setIsDragging(true)}
                  disabled={device.status !== 'online'}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' },
                  ]}
                />
                <LightModeIcon
                  fontSize="small"
                  sx={{ opacity: 1 }}
                />
              </Stack>
            </Box>
          )}

          {/* Power Stats */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <BoltIcon fontSize="small" color="action" />
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Power
                </Typography>
                <Typography variant="h6">
                  {formatPower(data.power)}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Energy
                </Typography>
                <Typography variant="h6">
                  {formatEnergy(data.energy)}
                </Typography>
              </Box>
            </Stack>

            {/* Additional Stats */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Voltage
                </Typography>
                <Typography variant="body2">
                  {data.voltage.toFixed(1)}V
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Current
                </Typography>
                <Typography variant="body2">
                  {data.current.toFixed(2)}A
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Temperature
                </Typography>
                <Typography variant="body2">
                  {formatTemperature(data.temperature)}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Warnings */}
          {(data.overpower || data.overtemperature) && (
            <Stack direction="row" spacing={1}>
              {data.overpower && (
                <Chip
                  label="Overpower"
                  size="small"
                  color="error"
                  icon={<WarningIcon />}
                />
              )}
              {data.overtemperature && (
                <Chip
                  label="Overtemperature"
                  size="small"
                  color="error"
                  icon={<WarningIcon />}
                />
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}