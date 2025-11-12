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
  MenuItem,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import Layout from '@/components/Layout/Layout';
import OrderTable from '@/components/Orders/OrderTable';
import OrderForm from '@/components/Orders/OrderForm';
import OrderDetails from '@/components/Orders/OrderDetails';
import type { Order, OrderStatus } from '@/types/orders';
import { API_BASE_URL, buildUrl, withAuthHeaders } from '@/utils/api';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    status: '' as OrderStatus | '',
    branchId: '',
    search: '',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.branchId) params.branchId = filters.branchId;
      if (filters.search) params.search = filters.search;

      const url = buildUrl('/orders', params);
      const response = await fetch(url, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить список заказов');
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data?.data ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setFormOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedOrder(null);
  };

  const handleFormSuccess = () => {
    fetchOrders();
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<OrderStatus, number>,
  );

  const totalRevenue = orders.filter((o) => o.status === 'COMPLETED').reduce((acc, order) => acc + order.total, 0);

  return (
    <Layout title="Заказы" subtitle="Управляйте заказами, отслеживайте статусы и анализируйте продажи">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Список заказов
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchOrders}>
              Обновить
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOrder}>
              Создать заказ
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f0f9ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {orders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего заказов
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#fef3c7' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {statusCounts.IN_PROGRESS || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                В работе
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#d1fae5' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {statusCounts.COMPLETED || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Выполнено
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e0e7ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {totalRevenue.toLocaleString('ru-RU')} ₽
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Выручка
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FilterListIcon />
            <TextField
              select
              label="Статус"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as OrderStatus | '' }))}
              sx={{ minWidth: 150 }}
              size="small"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="NEW">Новый</MenuItem>
              <MenuItem value="IN_PROGRESS">В работе</MenuItem>
              <MenuItem value="READY">Готов</MenuItem>
              <MenuItem value="COMPLETED">Выполнен</MenuItem>
              <MenuItem value="CANCELED">Отменен</MenuItem>
            </TextField>
            <TextField
              label="Поиск"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="ID заказа, клиент..."
              size="small"
              sx={{ flex: 1 }}
            />
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
            {orders.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Заказы не найдены
                </Typography>
              </Paper>
            ) : (
              <OrderTable orders={orders} onEdit={handleEditOrder} onView={handleViewOrder} />
            )}
          </>
        )}

        <OrderForm open={formOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} order={selectedOrder} />
        <OrderDetails open={detailsOpen} onClose={handleDetailsClose} order={selectedOrder} />
      </Box>
    </Layout>
  );
};

export default OrdersPage;


