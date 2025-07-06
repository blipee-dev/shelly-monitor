'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  TrendingUp,
  TrendingDown,
  ElectricBolt,
  DeviceThermostat,
  Sensors,
  Info,
  EuroSymbol,
  Schedule,
} from '@mui/icons-material';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import AskBlipeeEnhanced from '@/components/ai/AskBlipeeEnhanced';
import { format, startOfDay, endOfDay } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { logger } from '@/lib/utils/logger';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

function MetricCard({ title, value, unit, change, icon, color = 'primary.main' }: MetricCardProps) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Box display="flex" alignItems="baseline" gap={0.5}>
              <Typography variant="h4" fontWeight="medium">
                {value}
              </Typography>
              {unit && (
                <Typography variant="body1" color="text.secondary">
                  {unit}
                </Typography>
              )}
            </Box>
            {change !== undefined && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                {change >= 0 ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'error.main' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'success.main' }} />
                )}
                <Typography 
                  variant="caption" 
                  color={change >= 0 ? 'error.main' : 'success.main'}
                >
                  {Math.abs(change)}% vs last week
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { devices } = useDeviceStore();
  const [energyData, setEnergyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate metrics
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalPower = devices.reduce((sum, device) => {
    if (device.status === 'online' && (device as any).data) {
      const power = (device as any).data?.switch0?.apower || 0;
      return sum + power;
    }
    return sum;
  }, 0);

  // Mock energy data for demonstration
  const hourlyData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Power Consumption (W)',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 500) + 100),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const deviceConsumption = {
    labels: devices.slice(0, 5).map(d => d.name),
    datasets: [
      {
        label: 'Energy Today (kWh)',
        data: devices.slice(0, 5).map(() => Math.random() * 5),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleDeviceControl = async (deviceId: string, action: string, value?: any) => {
    // Implement actual device control logic here
    logger.debug('Device control:', { deviceId, action, value });
    // You would call your device control API here
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor your energy consumption and device usage patterns
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Metrics Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Power"
            value={totalPower.toFixed(0)}
            unit="W"
            change={12}
            icon={<ElectricBolt />}
            color="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Energy Today"
            value={(totalPower * 24 / 1000).toFixed(1)}
            unit="kWh"
            change={-5}
            icon={<Schedule />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Est. Daily Cost"
            value={((totalPower * 24 / 1000) * 0.15).toFixed(2)}
            unit="€"
            change={8}
            icon={<EuroSymbol />}
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Active Devices"
            value={onlineDevices}
            unit={`/ ${devices.length}`}
            icon={<Sensors />}
            color="info.main"
          />
        </Grid>

        {/* Charts Row */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              24-Hour Power Consumption
            </Typography>
            {isLoading ? (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LinearProgress sx={{ width: '50%' }} />
              </Box>
            ) : (
              <Box sx={{ height: 'calc(100% - 40px)' }}>
                <Line data={hourlyData} options={chartOptions} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Device Energy Usage
            </Typography>
            {isLoading ? (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LinearProgress sx={{ width: '50%' }} />
              </Box>
            ) : (
              <Box sx={{ height: 'calc(100% - 40px)' }}>
                <Bar data={deviceConsumption} options={barOptions} />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* AI Insights */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">AI Insights</Typography>
              <Tooltip title="Powered by DeepSeek AI">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box p={2} bgcolor="primary.light" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom>
                  💡 Energy Saving Opportunity
                </Typography>
                <Typography variant="body2">
                  Your living room lights have been on for 8 hours. Consider setting up an automation to turn them off when no motion is detected.
                </Typography>
              </Box>
              <Box p={2} bgcolor="warning.light" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom>
                  ⚡ Peak Usage Alert
                </Typography>
                <Typography variant="body2">
                  Your energy consumption peaks between 6-8 PM. Shifting some activities could reduce costs by up to 15%.
                </Typography>
              </Box>
              <Box p={2} bgcolor="success.light" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom>
                  ✅ Good Job!
                </Typography>
                <Typography variant="body2">
                  Your motion sensors helped reduce unnecessary lighting by 23% this week.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Ask Blipee Chat */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box sx={{ height: 500 }}>
            <AskBlipeeEnhanced onDeviceControl={handleDeviceControl} />
          </Box>
        </Grid>

        {/* Recent Events */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {[
                { time: '2 min ago', event: 'Kitchen Light turned on', type: 'info' },
                { time: '15 min ago', event: 'Motion detected in Living Room', type: 'motion' },
                { time: '1 hour ago', event: 'High power usage alert (>3kW)', type: 'warning' },
                { time: '2 hours ago', event: 'Bedroom Light automated off', type: 'automation' },
              ].map((item, index) => (
                <Box 
                  key={index} 
                  display="flex" 
                  alignItems="center" 
                  gap={2} 
                  p={1.5}
                  bgcolor="grey.50"
                  borderRadius={1}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
                    {item.time}
                  </Typography>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {item.event}
                  </Typography>
                  <Chip 
                    label={item.type} 
                    size="small" 
                    color={
                      item.type === 'warning' ? 'warning' : 
                      item.type === 'motion' ? 'primary' :
                      item.type === 'automation' ? 'success' : 'default'
                    }
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}