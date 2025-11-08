'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import Layout from '@/components/Layout/Layout';
import CompanySettings from '@/components/Settings/CompanySettings';
import PaymentSettings from '@/components/Settings/PaymentSettings';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';

const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Layout title="Настройки" subtitle="Управление настройками компании, платежами и интеграциями">
      <Box sx={{ p: 3 }}>
        <Paper sx={{ border: '1px solid #e2e8f0' }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ borderBottom: '1px solid #e2e8f0' }}>
            <Tab label="Компания" />
            <Tab label="Платежи" />
            <Tab label="Интеграции" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 && <CompanySettings />}
            {tab === 1 && <PaymentSettings />}
            {tab === 2 && <IntegrationSettings />}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default SettingsPage;

