
'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import Layout from '@/components/Layout/Layout';
import CompanySettings from '@/components/Settings/CompanySettings';
import PaymentSettings from '@/components/Settings/PaymentSettings';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';
import { usePermissions } from "@/components/hooks/usePermissions";

const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const { canEditResource } = usePermissions(); // ← ДОСТАВАЙ isLoading!


  // Теперь canEditResource точно функция
  const hasAccess = canEditResource?.('product', '1') ?? false;

  if (!hasAccess) {
    return (
        <Layout title="Настройки">
          <Box sx={{ p: 3 }}>
            <Typography>У вас нет прав для просмотра этой страницы</Typography>
          </Box>
        </Layout>
    );
  }

  return (
      <Layout title="Настройки" subtitle="Управление настройками компании, платежами и интеграциями">
        <Box sx={{ p: 3 }}>
          <Paper sx={{ border: '1px solid #e2e8f0' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #e2e8f0' }}>
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



