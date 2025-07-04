'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Stack,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Folder as FolderIcon,
  DevicesOther as DevicesIcon,
} from '@mui/icons-material';
import { DeviceGroup } from '@/types/device';
import { deviceGroupApi } from '@/lib/api/devices';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { DeviceGroupDialog } from './DeviceGroupDialog';
import { enqueueSnackbar } from 'notistack';

export function DeviceGroupList() {
  const { groups, setGroups, removeGroup, getDevicesByGroup } = useDeviceStore();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroup | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuGroup, setMenuGroup] = useState<DeviceGroup | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await deviceGroupApi.list();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
      enqueueSnackbar('Failed to load device groups', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, group: DeviceGroup) => {
    setAnchorEl(event.currentTarget);
    setMenuGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuGroup(null);
  };

  const handleEdit = () => {
    if (menuGroup) {
      setSelectedGroup(menuGroup);
      setDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!menuGroup) return;

    const deviceCount = getDevicesByGroup(menuGroup.id).length;
    
    if (deviceCount > 0) {
      enqueueSnackbar(
        `Cannot delete group with ${deviceCount} device${deviceCount > 1 ? 's' : ''}`,
        { variant: 'warning' }
      );
      handleMenuClose();
      return;
    }

    if (confirm(`Are you sure you want to delete "${menuGroup.name}"?`)) {
      try {
        await deviceGroupApi.delete(menuGroup.id);
        removeGroup(menuGroup.id);
        enqueueSnackbar('Group deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Failed to delete group:', error);
        enqueueSnackbar('Failed to delete group', { variant: 'error' });
      }
    }
    handleMenuClose();
  };

  const handleCreateNew = () => {
    setSelectedGroup(null);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Device Groups</Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              New Group
            </Button>
          </Stack>

          {groups.length === 0 ? (
            <Alert severity="info">
              No device groups yet. Create a group to organize your devices.
            </Alert>
          ) : (
            <List>
              {groups.map((group) => {
                const deviceCount = getDevicesByGroup(group.id).length;
                
                return (
                  <ListItem key={group.id}>
                    <FolderIcon sx={{ mr: 2, color: 'action.active' }} />
                    <ListItemText
                      primary={group.name}
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          {group.description && (
                            <Typography variant="caption" color="text.secondary">
                              {group.description}
                            </Typography>
                          )}
                          <Chip
                            icon={<DevicesIcon />}
                            label={`${deviceCount} device${deviceCount !== 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleMenuOpen(e, group)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Group Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Group Dialog */}
      <DeviceGroupDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup || undefined}
      />
    </>
  );
}