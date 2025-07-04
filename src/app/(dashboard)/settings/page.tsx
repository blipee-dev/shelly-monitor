'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Notifications,
  Person,
  Security,
  Palette,
  Language,
  Devices,
} from '@mui/icons-material';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTranslation } from '@/lib/i18n';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsPage() {
  const { t, locale, setLocale } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<Palette />} label="Appearance" />
          <Tab icon={<Language />} label="Language" />
          <Tab icon={<Devices />} label="Devices" />
          <Tab icon={<Security />} label="Security" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <NotificationSettings />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            <Typography color="text.secondary">
              Profile management coming soon...
            </Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Theme Mode
              </Typography>
              <ThemeToggle />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>
              Language Settings
            </Typography>
            <Typography color="text.secondary">
              Language selection coming soon...
            </Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Typography variant="h6" gutterBottom>
              Device Settings
            </Typography>
            <Typography color="text.secondary">
              Device preferences coming soon...
            </Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Typography color="text.secondary">
              Security options coming soon...
            </Typography>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}