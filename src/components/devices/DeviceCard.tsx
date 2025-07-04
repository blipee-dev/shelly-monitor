'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Switch,
  Box,
  Grid,
  Tooltip,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PowerSettingsNew as PowerIcon,
  Thermostat as ThermostatIcon,
  Bolt as BoltIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';
import { useTranslation, formatRelativeTime } from '@/lib/i18n';
import { ShellyDevice } from '@/types/shelly';

interface DeviceCardProps {
  device: ShellyDevice & { device_status?: any };
  onRefresh: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onControl?: (channel: number, state: boolean) => void;
}

export default function DeviceCard({
  device,
  onRefresh,
  onEdit,
  onDelete,
  onControl
}: DeviceCardProps) {
  const { t, locale } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [controllingChannel, setControllingChannel] = useState<number | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleControl = async (channel: number, state: boolean) => {
    if (!onControl) return;
    
    setControllingChannel(channel);
    try {
      await onControl(channel, state);
    } finally {
      setControllingChannel(null);
    }
  };

  const isOnline = device.device_status?.online ?? false;
  const deviceData = device.device_status?.data;

  const getDeviceTypeName = () => {
    switch (device.type) {
      case 'plus_2pm':
        return '2PM Switch';
      case 'motion_2':
        return t('devices.card.motion.detected').split(' ')[0] + ' Sensor';
      default:
        return device.type;
    }
  };

  return (
    <Card
      data-testid="device-card"
      role="article"
      aria-label={t('devices.card.online') + ': ' + device.name}
      sx={{
        position: 'relative',
        height: '100%',
        opacity: isOnline ? 1 : 0.7,
        transition: 'all 0.3s ease'
      }}
    >
      {loading && (
        <Box
          data-testid="loading-indicator"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            variant="h6"
            component="h3"
            data-testid="device-name"
            sx={{ fontWeight: 500 }}
          >
            {device.name}
          </Typography>
          <Chip
            data-testid={isOnline ? 'online-indicator' : 'offline-indicator'}
            label={isOnline ? t('devices.card.online') : t('devices.card.offline')}
            color={isOnline ? 'success' : 'default'}
            size="small"
            icon={isOnline ? undefined : <WifiOffIcon />}
            role="status"
            aria-live="polite"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          {getDeviceTypeName()}
        </Typography>

        <Box mt={1} mb={2}>
          <Typography variant="caption" color="text.secondary">
            {t('devices.card.ipAddress', { ip: device.ip_address })}
          </Typography>
          {device.last_seen && (
            <Typography variant="caption" color="text.secondary" display="block">
              {t('devices.card.lastSeen', { time: formatRelativeTime(device.last_seen, locale) })}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Device-specific content */}
        {device.type === 'plus_2pm' && deviceData?.switch && (
          <Grid container spacing={2}>
            {deviceData.switch.map((channel: any, index: number) => (
              <Grid item xs={12} key={channel.id}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {t('devices.card.channel', { number: index + 1 })}
                    </Typography>
                    <Box display="flex" gap={1} mt={0.5}>
                      <Chip
                        icon={<BoltIcon />}
                        label={t('devices.card.power', { value: channel.apower?.toFixed(1) || 0 })}
                        size="small"
                        variant="outlined"
                      />
                      {channel.temperature && (
                        <Chip
                          icon={<ThermostatIcon />}
                          label={t('devices.card.temperature', { value: channel.temperature.toFixed(1) })}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                  <Switch
                    data-testid="switch-toggle"
                    checked={channel.output}
                    onChange={(e) => handleControl(channel.id, e.target.checked)}
                    disabled={!isOnline || controllingChannel === channel.id}
                    color="primary"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {device.type === 'motion_2' && deviceData?.sensor && (
          <Box>
            <Typography variant="body2" gutterBottom>
              {t('devices.card.motion.' + (deviceData.sensor.motion ? 'detected' : 'clear'))}
            </Typography>
            <Box display="flex" flexDirection="column" gap={1} mt={2}>
              <Typography variant="caption" color="text.secondary">
                {t('devices.card.motion.light', { value: deviceData.sensor.lux })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('devices.card.temperature', { value: deviceData.sensor.temperature?.toFixed(1) })}
              </Typography>
              {deviceData.sensor.battery && (
                <Typography variant="caption" color="text.secondary">
                  {t('devices.card.motion.battery', { value: deviceData.sensor.battery.percent })}
                </Typography>
              )}
              {deviceData.sensor.vibration && (
                <Typography variant="caption" color="error">
                  {t('devices.card.motion.vibration')}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Tooltip title={t('devices.card.actions.refresh')}>
          <IconButton
            data-testid="refresh-button"
            onClick={handleRefresh}
            disabled={loading}
            size="small"
            aria-label={t('devices.card.actions.refresh')}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {onEdit && (
          <Tooltip title={t('devices.card.actions.edit')}>
            <IconButton
              data-testid="edit-device-button"
              onClick={onEdit}
              disabled={loading}
              size="small"
              aria-label={t('devices.card.actions.edit')}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title={t('devices.card.actions.delete')}>
            <IconButton
              data-testid="delete-device-button"
              onClick={onDelete}
              disabled={loading}
              size="small"
              aria-label={t('devices.card.actions.delete')}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}