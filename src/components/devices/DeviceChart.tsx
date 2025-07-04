'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { Device } from '@/types/device';
import { hasPowerMonitoring, hasMotionDetection, hasBattery } from '@/lib/devices/utils';

interface DeviceChartProps {
  device: Device;
  data: Array<{
    timestamp: string;
    data: any;
  }>;
}

export function DeviceChart({ device, data }: DeviceChartProps) {
  const [chartType, setChartType] = useState<'power' | 'motion' | 'battery'>('power');

  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: format(new Date(item.timestamp), 'HH:mm'),
      timestamp: item.timestamp,
      ...item.data,
    }));
  }, [data]);

  const renderPowerChart = () => {
    if (!hasPowerMonitoring(device.type)) {
      return <Typography>No power monitoring data available</Typography>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => `Time: ${value}`}
            formatter={(value: number) => [`${value.toFixed(2)} W`, 'Power']}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="power"
            stroke="#1976d2"
            fill="#1976d280"
            name="Power (W)"
          />
          {device.type === 'plus2pm' && (
            <>
              <Area
                type="monotone"
                dataKey="relays[0].power"
                stroke="#f50057"
                fill="#f5005780"
                name="Relay 1 (W)"
              />
              <Area
                type="monotone"
                dataKey="relays[1].power"
                stroke="#00c853"
                fill="#00c85380"
                name="Relay 2 (W)"
              />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderMotionChart = () => {
    if (!hasMotionDetection(device.type)) {
      return <Typography>No motion data available</Typography>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="lux"
            stroke="#ff9800"
            name="Light Level (lux)"
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#f44336"
            name="Temperature (°C)"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderBatteryChart = () => {
    if (!hasBattery(device.type)) {
      return <Typography>No battery data available</Typography>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Battery']}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="battery"
            stroke="#4caf50"
            fill="#4caf5080"
            name="Battery (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Analytics</Typography>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(_, value) => value && setChartType(value)}
              size="small"
            >
              {hasPowerMonitoring(device.type) && (
                <ToggleButton value="power">Power</ToggleButton>
              )}
              {hasMotionDetection(device.type) && (
                <ToggleButton value="motion">Environment</ToggleButton>
              )}
              {hasBattery(device.type) && (
                <ToggleButton value="battery">Battery</ToggleButton>
              )}
            </ToggleButtonGroup>
          </Stack>

          {data.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No data available yet. Data will appear here once the device starts reporting.
              </Typography>
            </Box>
          ) : (
            <>
              {chartType === 'power' && renderPowerChart()}
              {chartType === 'motion' && renderMotionChart()}
              {chartType === 'battery' && renderBatteryChart()}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}