'use client';

import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent
} from '@mui/material';
import { useTranslation } from '@/lib/i18n';

export default function LanguageSelector() {
  const { locale, setLocale, locales } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setLocale(event.target.value as any);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={locale}
        onChange={handleChange}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }
        }}
        renderValue={(value) => {
          const selected = locales.find(l => l.value === value);
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{selected?.flag}</span>
              <span>{selected?.label}</span>
            </div>
          );
        }}
      >
        {locales.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <span style={{ fontSize: '1.2em' }}>{option.flag}</span>
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}