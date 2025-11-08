'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Stack,
  TextField,
  Paper,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '@/components/Layout/Layout';
import CustomerTable from '@/components/Customers/CustomerTable';
import CustomerForm from '@/components/Customers/CustomerForm';
import type { Customer } from '@/types/customers';
import { API_BASE_URL, buildUrl, withAuthHeaders } from '@/utils/api';
import { formatCurrency } from '@/utils/formatters';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [vipFilter, setVipFilter] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (vipFilter) params.vipStatus = vipFilter;

      const url = buildUrl('/customers', params);
      const response = await fetch(url, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить список клиентов');
      }

      const data = await response.json();
      setCustomers(Array.isArray(data.data) ? data.data : data.data?.data ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки клиентов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, vipFilter]);

  const handleView = (customer: Customer) => {
    // TODO: Открыть детали клиента
    console.log('View customer', customer);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleFormSuccess = () => {
    fetchCustomers();
  };

  const handleViewHistory = (customer: Customer) => {
    // TODO: Открыть историю заказов
    window.location.href = `/customers/${customer.id}/orders`;
  };

  const handleViewBonuses = (customer: Customer) => {
    // TODO: Открыть историю бонусов
    window.location.href = `/customers/${customer.id}/bonuses`;
  };

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter((c) => c.vipStatus).length;
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalBonuses = customers.reduce((sum, c) => sum + (c.bonus || 0), 0);

  return (
    <Layout title="Клиенты" subtitle="Управление клиентами, история заказов и бонусы">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Клиенты
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCustomers}>
              Обновить
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCustomer}>
              Добавить клиента
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f0f9ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {totalCustomers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего клиентов
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3cd' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {vipCustomers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                VIP клиентов
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#d1fae5' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(totalSpent)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Общая выручка
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e0e7ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {totalBonuses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего бонусов
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Имя, email, телефон..."
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              select
              label="Статус"
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
              SelectProps={{ native: true }}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <option value="">Все</option>
              <option value="true">VIP</option>
              <option value="false">Обычные</option>
            </TextField>
          </Stack>
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            {customers.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Клиенты не найдены
                </Typography>
              </Paper>
            ) : (
              <CustomerTable
                customers={customers}
                onEdit={handleEdit}
                onView={handleView}
                onViewHistory={handleViewHistory}
                onViewBonuses={handleViewBonuses}
              />
            )}
          </>
        )}

        <CustomerForm
          open={formOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          customer={selectedCustomer}
        />
      </Box>
    </Layout>
  );
};

export default CustomersPage;

