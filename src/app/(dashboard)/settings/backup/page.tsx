'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { BackupManager } from '@/components/backup/BackupManager';
import { BackupScheduler } from '@/components/backup/BackupScheduler';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BackupSettingsPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Backup & Restore
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage your data backups, schedule automatic backups, and import/export configurations
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Manual Backup" />
          <Tab label="Scheduled Backups" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <BackupManager />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <BackupScheduler />
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}