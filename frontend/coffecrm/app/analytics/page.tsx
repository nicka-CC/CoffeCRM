'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Layout from '@/components/Layout/Layout';
import { API_BASE_URL, buildUrl, withAuthHeaders } from '@/utils/api';
import { formatCurrency } from '@/utils/formatters';

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'custom'>('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period, from, to]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { period };
      if (period === 'custom' && from) params.from = from;
      if (period === 'custom' && to) params.to = to;

      const url = buildUrl('/analytics', params);
      const response = await fetch(url, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить аналитику');
      }

      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки аналитики');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (dataset: string, format: string) => {
    try {
      const params: Record<string, string> = { dataset, format, period };
      if (period === 'custom' && from) params.from = from;
      if (period === 'custom' && to) params.to = to;

      const url = buildUrl('/analytics/export', params);
      const response = await fetch(url, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось экспортировать отчет');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `report-${dataset}-${new Date().toISOString()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка экспорта');
    }
  };

  if (loading) {
    return (
      <Layout title="Аналитика" subtitle="Анализ продаж и статистика">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !analyticsData) {
    return (
      <Layout title="Аналитика" subtitle="Анализ продаж и статистика">
        <Alert severity="error">{error || 'Ошибка загрузки данных'}</Alert>
      </Layout>
    );
  }

  const { salesDynamics, topProducts, topCustomers, branchSales, peakHours } = analyticsData;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Layout title="Аналитика" subtitle="Анализ продаж и статистика">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} color="textSecondary">
            Аналитика
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAnalytics}>
              Обновить
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleExport('sales', 'excel')}
            >
              Экспорт Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExport('sales', 'pdf')}
            >
              Экспорт PDF
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Период</InputLabel>
              <Select value={period} label="Период" onChange={(e) => setPeriod(e.target.value as any)}>
                <MenuItem value="week">Неделя</MenuItem>
                <MenuItem value="month">Месяц</MenuItem>
                <MenuItem value="quarter">Квартал</MenuItem>
                <MenuItem value="custom">Произвольный</MenuItem>
              </Select>
            </FormControl>
            {period === 'custom' && (
              <>
                <TextField
                  label="С"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <TextField
                  label="По"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </>
            )}
          </Stack>
        </Paper>

        {/* Sales Dynamics */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Динамика продаж
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesDynamics || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" name="Выручка" />
              <Line type="monotone" dataKey="orders" stroke="#10b981" name="Заказы" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Grid container spacing={3}>
          {/* Top Products */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ТОП товаров
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#6366f1" name="Количество" />
                  <Bar dataKey="revenue" fill="#10b981" name="Выручка" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Top Customers */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ТОП клиентов
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCustomers || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#f59e0b" name="Заказов" />
                  <Bar dataKey="revenue" fill="#ef4444" name="Выручка" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Branch Sales */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Продажи по филиалам
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={branchSales || []}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {(branchSales || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Peak Hours */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Пиковые часы
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakHours || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8b5cf6" name="Заказов" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default AnalyticsPage;



