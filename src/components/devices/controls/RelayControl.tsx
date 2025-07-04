'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Power as PowerIcon,
  PowerOff as PowerOffIcon,
  Bolt as BoltIcon,
  Thermostat as ThermostatIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Device, Relay, Plus2PMData, Plus1PMData } from '@/types/device';
import { deviceApi } from '@/lib/api/devices';
import { formatPower, formatEnergy, formatTemperature } from '@/lib/devices/utils';
import { enqueueSnackbar } from 'notistack';

interface RelayControlProps {
  device: Device;
  relay: Relay;
  relayIndex: number;
  data?: Plus2PMData | Plus1PMData;
  onUpdate?: () => void;
}

export function RelayControl({
  device,
  relay,
  relayIndex,
  data,
  onUpdate,
}: RelayControlProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await deviceApi.controlRelay({
        device_id: device.id,
        relay_id: relayIndex,
        action: relay.state === 'on' ? 'off' : 'on',
      });
      
      enqueueSnackbar(
        `Relay ${relayIndex + 1} turned ${relay.state === 'on' ? 'off' : 'on'}`,
        { variant: 'success' }
      );
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to control relay:', error);
      enqueueSnackbar('Failed to control relay', { variant: 'error' });
    } finally {
      setIsToggling(false);
    }
  };

  const isOverPower = data && 'overpower' in data && data.overpower;
  const isOverTemp = data && 'overtemperature' in data && data.overtemperature;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">
                Relay {relayIndex + 1}
              </Typography>
              {relay.state === 'on' && (
                <Chip
                  label="ON"
                  size="small"
                  color="primary"
                  icon={<PowerIcon />}
                />
              )}
            </Stack>
            
            <Switch
              checked={relay.state === 'on'}
              onChange={handleToggle}
              disabled={isToggling || device.status !== 'online'}
              color="primary"
            />
          </Stack>

          {isToggling && <LinearProgress />}

          {/* Power Stats */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <BoltIcon fontSize="small" color="action" />
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Power
                </Typography>
                <Typography variant="h6">
                  {formatPower(relay.power)}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Energy
                </Typography>
                <Typography variant="h6">
                  {formatEnergy(relay.energy)}
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
                  {relay.voltage.toFixed(1)}V
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Current
                </Typography>
                <Typography variant="body2">
                  {relay.current.toFixed(2)}A
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Temperature
                </Typography>
                <Typography variant="body2">
                  {formatTemperature(relay.temperature)}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Warnings */}
          {(isOverPower || isOverTemp) && (
            <Stack direction="row" spacing={1}>
              {isOverPower && (
                <Chip
                  label="Overpower"
                  size="small"
                  color="error"
                  icon={<WarningIcon />}
                />
              )}
              {isOverTemp && (
                <Chip
                  label="Overtemperature"
                  size="small"
                  color="error"
                  icon={<ThermostatIcon />}
                />
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}