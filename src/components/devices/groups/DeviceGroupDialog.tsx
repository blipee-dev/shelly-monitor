'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DeviceGroup } from '@/types/device';
import { deviceGroupApi } from '@/lib/api/devices';
import { useDeviceStore } from '@/lib/stores/deviceStore';
import { enqueueSnackbar } from 'notistack';

const groupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface DeviceGroupDialogProps {
  open: boolean;
  onClose: () => void;
  group?: DeviceGroup;
}

export function DeviceGroupDialog({ open, onClose, group }: DeviceGroupDialogProps) {
  const { addGroup, updateGroup } = useDeviceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEdit = !!group;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
    },
  });

  const onSubmit = async (data: GroupFormData) => {
    try {
      setIsSubmitting(true);

      if (isEdit) {
        const updated = await deviceGroupApi.update(group.id, data);
        updateGroup(group.id, updated);
        enqueueSnackbar('Group updated successfully', { variant: 'success' });
      } else {
        const created = await deviceGroupApi.create(data);
        addGroup(created);
        enqueueSnackbar('Group created successfully', { variant: 'success' });
      }

      handleClose();
    } catch (error) {
      console.error('Failed to save group:', error);
      enqueueSnackbar(
        isEdit ? 'Failed to update group' : 'Failed to create group',
        { variant: 'error' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEdit ? 'Edit Group' : 'Create Device Group'}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Group Name"
                  fullWidth
                  autoFocus
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (optional)"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}