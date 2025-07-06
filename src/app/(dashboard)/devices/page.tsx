'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Tooltip,
  LinearProgress,
  Paper,
  Grid,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  PowerSettingsNew as PowerIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { deviceApi } from '@/lib/api/devices';
import { Device, DeviceStatus, DeviceType } from '@/types/device';
import { DEVICE_TYPE_NAMES, STATUS_COLORS } from '@/lib/devices/constants';
import { formatUptime, getDeviceIcon } from '@/lib/devices/utils';
import { useAuth } from '@/lib/auth/hooks';
import { enqueueSnackbar } from 'notistack';
import { useDeviceRealtime } from '@/lib/hooks/useDeviceRealtime';
import { DeviceGroupList } from '@/components/devices/groups/DeviceGroupList';

export default function DevicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    devices,
    filters,
    isLoading,
    setDevices,
    setFilters,
    clearFilters,
    setLoading,
    removeDevice,
  } = useDeviceStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Load devices on mount
  useEffect(() => {
    loadDevices();
  }, [filters]);

  // Subscribe to real-time updates
  useDeviceRealtime();

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await deviceApi.list({
        ...filters,
        page: 1,
        limit: 100,
      });
      setDevices(response.devices);
    } catch (error) {
      console.error('Failed to load devices:', error);
      enqueueSnackbar('Failed to load devices', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, device: Device) => {
    setAnchorEl(event.currentTarget);
    setSelectedDevice(device);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDevice(null);
  };

  const handleViewDevice = () => {
    if (selectedDevice) {
      router.push(`/devices/${selectedDevice.id}`);
    }
    handleMenuClose();
  };

  const handleEditDevice = () => {
    if (selectedDevice) {
      router.push(`/devices/${selectedDevice.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;

    if (confirm(`Are you sure you want to delete ${selectedDevice.name}?`)) {
      try {
        await deviceApi.delete(selectedDevice.id);
        removeDevice(selectedDevice.id);
        enqueueSnackbar('Device deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Failed to delete device:', error);
        enqueueSnackbar('Failed to delete device', { variant: 'error' });
      }
    }
    handleMenuClose();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setFilters({ ...filters, search: value });
  };

  const handleFilterChange = (key: keyof typeof filters) => (
    event: SelectChangeEvent
  ) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      [key]: value === 'all' ? undefined : value,
    });
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchValue('');
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<Device>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <PowerIcon
            sx={{
              color: STATUS_COLORS[params.row.status],
              fontSize: 20,
            }}
          />
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 180,
      renderCell: (params: GridRenderCellParams<Device>) => (
        <Chip
          label={DEVICE_TYPE_NAMES[params.value as DeviceType]}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams<Device>) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: `${STATUS_COLORS[params.value as DeviceStatus]}20`,
            color: STATUS_COLORS[params.value as DeviceStatus],
            fontWeight: 'medium',
          }}
        />
      ),
    },
    {
      field: 'ip_address',
      headerName: 'IP Address',
      width: 140,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      renderCell: (params: GridRenderCellParams<Device>) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'last_seen',
      headerName: 'Last Seen',
      width: 120,
      renderCell: (params: GridRenderCellParams<Device>) => (
        <Typography variant="body2" color="text.secondary">
          {formatUptime(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Device>) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row)}
        >
          <MoreIcon />
        </IconButton>
      ),
    },
  ];

  const hasActiveFilters = filters.status || filters.type || filters.search;

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="medium">
          Devices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/devices/new')}
        >
          Add Device
        </Button>
      </Stack>

      {/* Two column layout */}
      <Grid container spacing={3}>
        {/* Device Groups - Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <DeviceGroupList />
        </Grid>

        {/* Device List - Main Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <Box p={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search devices..."
              value={searchValue}
              onChange={handleSearch}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {showFilters && (
              <>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status || 'all'}
                    label="Status"
                    onChange={handleFilterChange('status')}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type || 'all'}
                    label="Type"
                    onChange={handleFilterChange('type')}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {Object.entries(DEVICE_TYPE_NAMES).map(([key, name]) => (
                      <MenuItem key={key} value={key}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            <Tooltip title="Toggle filters">
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                color={hasActiveFilters ? 'primary' : 'default'}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>

            {hasActiveFilters && (
              <Tooltip title="Clear filters">
                <IconButton onClick={handleClearFilters}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Refresh">
              <IconButton onClick={loadDevices}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        {isLoading && <LinearProgress />}
      </Card>

          {/* Device Grid */}
          <Paper>
            <DataGrid
              rows={devices}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              autoHeight
              onRowClick={(params) => router.push(`/devices/${params.row.id}`)}
              sx={{
                '& .MuiDataGrid-row': {
                  cursor: 'pointer',
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDevice}>
          <InfoIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditDevice}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteDevice} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}