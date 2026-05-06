
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
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
          <Paper 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={tab} 
              onChange={(_, v) => setTab(v)} 
              sx={{ 
                borderBottom: '1px solid #e2e8f0',
                bgcolor: '#f8fafc',
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#1e293b',
                    fontWeight: 600
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  bgcolor: '#3b82f6',
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              <Tab label="Компания" />
              <Tab label="Платежи" />
              <Tab label="Интеграции" />
            </Tabs>

            <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: 600 }}>
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




