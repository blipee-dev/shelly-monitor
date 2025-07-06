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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload,
  CloudDownload,
  Delete,
  Restore,
  Schedule,
  MoreVert,
  CheckCircle,
  Error as ErrorIcon,
  HourglassEmpty,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { BackupService, BackupRecord } from '@/lib/backup/backup-service';
import { ExportManager } from '@/lib/backup/export-manager';
import { ImportManager } from '@/lib/backup/import-manager';
import { useSnackbar } from 'notistack';

export function BackupManager() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [importDialog, setImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const data = await BackupService.getBackups();
      setBackups(data);
    } catch (error) {
      enqueueSnackbar('Failed to load backups', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const backup = await BackupService.createBackup(true);
      setBackups([backup, ...backups]);
      enqueueSnackbar('Backup created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create backup', { variant: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv' = 'json') => {
    try {
      await ExportManager.exportToFile({ format });
      enqueueSnackbar(`Exported as ${format.toUpperCase()}`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Export failed', { variant: 'error' });
    }
  };

  const handleRestore = async (backupId: string) => {
    setRestoring(backupId);
    try {
      await BackupService.restoreBackup(backupId);
      enqueueSnackbar('Backup restored successfully', { variant: 'success' });
      // Reload the page to show restored data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      enqueueSnackbar('Failed to restore backup', { variant: 'error' });
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (backupId: string) => {
    try {
      await BackupService.deleteBackup(backupId);
      setBackups(backups.filter(b => b.id !== backupId));
      enqueueSnackbar('Backup deleted', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete backup', { variant: 'error' });
    }
    handleMenuClose();
  };

  const handleImport = async () => {
    if (!importFile) return;

    setImportProgress(true);
    try {
      const result = await ImportManager.importFromFile(importFile, {
        overwriteExisting: true,
        importDevices: true,
        importAutomations: true,
        importScenes: true,
        importSettings: true,
      });

      if (result.success) {
        enqueueSnackbar(
          `Import successful: ${result.imported.devices} devices, ${result.imported.automations} automations, ${result.imported.scenes} scenes`,
          { variant: 'success' }
        );
        setImportDialog(false);
        setImportFile(null);
        // Reload to show imported data
        setTimeout(() => window.location.reload(), 1500);
      } else {
        enqueueSnackbar(`Import failed: ${result.errors.join(', ')}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Import failed', { variant: 'error' });
    } finally {
      setImportProgress(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, backupId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedBackup(backupId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBackup(null);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: BackupRecord['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" fontSize="small" />;
      case 'failed':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'in_progress':
        return <HourglassEmpty color="action" fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Backup & Export</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => setImportDialog(true)}
              >
                Import
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudDownload />}
                onClick={() => handleExport('json')}
              >
                Export JSON
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudDownload />}
                onClick={() => handleExport('csv')}
              >
                Export CSV
              </Button>
              <Button
                variant="contained"
                startIcon={creating ? <CircularProgress size={20} /> : <CloudUpload />}
                onClick={handleCreateBackup}
                disabled={creating}
              >
                Create Backup
              </Button>
            </Stack>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            Backups include all devices, automations, scenes, and settings. 
            The last {BackupService['MAX_BACKUPS']} backups are kept automatically.
          </Alert>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {backups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" py={4}>
                    No backups yet. Create your first backup to protect your data.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(backup.timestamp), 'MMM d, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(backup.timestamp), 'h:mm a')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={backup.scheduleId ? 'Scheduled' : 'Manual'}
                      size="small"
                      color={backup.scheduleId ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatBytes(backup.size)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(backup.status)}
                      <Typography variant="body2">
                        {backup.status === 'success' ? 'Complete' : 
                         backup.status === 'failed' ? 'Failed' : 
                         'In Progress'}
                      </Typography>
                    </Box>
                    {backup.error && (
                      <Typography variant="caption" color="error">
                        {backup.error}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {backup.status === 'success' && (
                        <>
                          <Tooltip title="Restore">
                            <IconButton
                              size="small"
                              onClick={() => handleRestore(backup.id)}
                              disabled={restoring !== null}
                            >
                              {restoring === backup.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Restore />
                              )}
                            </IconButton>
                          </Tooltip>
                          {backup.downloadUrl && (
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                component="a"
                                href={backup.downloadUrl}
                                download
                              >
                                <CloudDownload />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, backup.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedBackup && handleDelete(selectedBackup)}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Import Dialog */}
      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Alert severity="warning">
              Importing will overwrite existing data with the same identifiers.
              Make sure to create a backup before importing.
            </Alert>
            
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ py: 3 }}
            >
              {importFile ? importFile.name : 'Choose File'}
              <input
                type="file"
                hidden
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
            </Button>

            {importProgress && <LinearProgress />}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!importFile || importProgress}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}