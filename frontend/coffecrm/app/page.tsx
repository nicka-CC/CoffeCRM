'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ShoppingCart,
  TrendingUp,
  People,
  Store,
  Coffee,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, [period]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/dashboard?period=${period}`, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить данные Dashboard');
      }

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки Dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      createOrder: '/orders/new',
      createProduct: '/products/new',
      addStock: '/inventory',
      createEmployee: '/employees/new',
      createBooking: '/bookings/new',
      createCustomer: '/customers/new',
    };
    const path = actionMap[action];
    if (path) {
      router.push(path);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Главная панель управления">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !dashboardData) {
    return (
      <Layout title="Dashboard" subtitle="Главная панель управления">
        <Alert severity="error">{error || 'Ошибка загрузки данных'}</Alert>
      </Layout>
    );
  }

  const { kpis, topProducts, salesChart, branchStats, statusDistribution, quickLinks } = dashboardData;

  return (
    <Layout title="Dashboard" subtitle="Главная панель управления">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} color="textSecondary">
            Статистика
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Период</InputLabel>
            <Select value={period} label="Период" onChange={(e) => setPeriod(e.target.value as any)}>
              <MenuItem value="day">День</MenuItem>
              <MenuItem value="week">Неделя</MenuItem>
              <MenuItem value="month">Месяц</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f0f9ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(kpis.revenue || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Выручка
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3cd' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {kpis.ordersCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Заказов
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#d1fae5' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(kpis.averageCheck || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Средний чек
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e0e7ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {kpis.newCustomers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Новых клиентов
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                График продаж
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChart || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" name="Выручка" />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" name="Заказы" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ТОП товаров
              </Typography>
              <Stack spacing={2}>
                {topProducts?.slice(0, 5).map((product: any, index: number) => (
                  <Box key={product.productId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{index + 1}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.quantity} шт. • {formatCurrency(product.revenue)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </Layout>
  );
}
