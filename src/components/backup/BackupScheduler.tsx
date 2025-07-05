'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Schedule as ScheduleIcon,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { BackupService, BackupSchedule } from '@/lib/backup/backup-service';
import { useSnackbar } from '@/components/providers/SnackbarProvider';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function BackupScheduler() {
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<BackupSchedule | null>(null);
  const { showSnackbar } = useSnackbar();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily' as BackupSchedule['frequency'],
    time: '02:00',
    dayOfWeek: 0,
    dayOfMonth: 1,
    enabled: true,
    retentionDays: 30,
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await BackupService.getSchedules();
      setSchedules(data);
    } catch (error) {
      showSnackbar('Failed to load schedules', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (schedule?: BackupSchedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        name: schedule.name,
        frequency: schedule.frequency,
        time: schedule.time,
        dayOfWeek: schedule.dayOfWeek || 0,
        dayOfMonth: schedule.dayOfMonth || 1,
        enabled: schedule.enabled,
        retentionDays: schedule.retentionDays,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        name: '',
        frequency: 'daily',
        time: '02:00',
        dayOfWeek: 0,
        dayOfMonth: 1,
        enabled: true,
        retentionDays: 30,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchedule(null);
  };

  const handleSave = async () => {
    try {
      if (editingSchedule) {
        // Update existing
        await BackupService.updateSchedule(editingSchedule.id, formData);
        setSchedules(
          schedules.map(s =>
            s.id === editingSchedule.id ? { ...s, ...formData } : s
          )
        );
        showSnackbar('Schedule updated', 'success');
      } else {
        // Create new
        const newSchedule = await BackupService.createSchedule(formData);
        setSchedules([...schedules, newSchedule]);
        showSnackbar('Schedule created', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Failed to save schedule', 'error');
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await BackupService.updateSchedule(id, { enabled });
      setSchedules(
        schedules.map(s => (s.id === id ? { ...s, enabled } : s))
      );
      showSnackbar(
        enabled ? 'Schedule enabled' : 'Schedule disabled',
        'success'
      );
    } catch (error) {
      showSnackbar('Failed to update schedule', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await BackupService.deleteSchedule(id);
      setSchedules(schedules.filter(s => s.id !== id));
      showSnackbar('Schedule deleted', 'success');
    } catch (error) {
      showSnackbar('Failed to delete schedule', 'error');
    }
  };

  const getScheduleDescription = (schedule: BackupSchedule): string => {
    switch (schedule.frequency) {
      case 'daily':
        return `Daily at ${schedule.time}`;
      case 'weekly':
        return `Every ${DAYS_OF_WEEK[schedule.dayOfWeek || 0]} at ${schedule.time}`;
      case 'monthly':
        return `Monthly on day ${schedule.dayOfMonth} at ${schedule.time}`;
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Backup Schedules</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Schedule
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Scheduled backups run automatically at the specified times. 
            Backups older than the retention period are automatically deleted.
          </Alert>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Retention</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Next Run</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No backup schedules configured
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {schedule.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ScheduleIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {getScheduleDescription(schedule)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {schedule.retentionDays} days
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {schedule.lastRun ? (
                          <Box>
                            <Typography variant="body2">
                              {format(new Date(schedule.lastRun), 'MMM d, yyyy')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(schedule.lastRun), 'h:mm a')}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Never
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {schedule.nextRun && (
                          <Box>
                            <Typography variant="body2">
                              {format(new Date(schedule.nextRun), 'MMM d, yyyy')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(schedule.nextRun), 'h:mm a')}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={schedule.enabled ? 'Active' : 'Inactive'}
                          color={schedule.enabled ? 'success' : 'default'}
                          size="small"
                          icon={schedule.enabled ? <CheckCircle /> : <Cancel />}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Switch
                            checked={schedule.enabled}
                            onChange={(e) => handleToggle(schedule.id, e.target.checked)}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(schedule)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(schedule.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Schedule Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frequency: e.target.value as BackupSchedule['frequency'],
                  })
                }
                label="Frequency"
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {formData.frequency === 'weekly' && (
              <FormControl fullWidth>
                <InputLabel>Day of Week</InputLabel>
                <Select
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfWeek: Number(e.target.value) })
                  }
                  label="Day of Week"
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <MenuItem key={index} value={index}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {formData.frequency === 'monthly' && (
              <TextField
                label="Day of Month"
                type="number"
                value={formData.dayOfMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dayOfMonth: Math.min(31, Math.max(1, Number(e.target.value))),
                  })
                }
                fullWidth
                inputProps={{ min: 1, max: 31 }}
              />
            )}

            <TextField
              label="Retention Days"
              type="number"
              value={formData.retentionDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  retentionDays: Math.max(1, Number(e.target.value)),
                })
              }
              fullWidth
              helperText="How long to keep backups"
              inputProps={{ min: 1 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name}
          >
            {editingSchedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}