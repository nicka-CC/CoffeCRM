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
  ListSubheader,
  Tooltip,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
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

  const handleExport = async (dataset: 'sales' | 'branches' | 'products' | 'customers', format: 'excel' | 'pdf') => {
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
      
      // Better filename with current date in readable format
      const dateStr = new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/[\s:.,]/g, '-');
      
      const datasetNames = {
        sales: 'продажи',
        branches: 'филиалы',
        products: 'товары',
        customers: 'клиенты'
      };
      
      a.download = `отчет-${datasetNames[dataset]}-${dateStr}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
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
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAnalytics}>
              Обновить
            </Button>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value=""
                displayEmpty
                onChange={(e) => {
                  const [dataset, format] = e.target.value.split('|');
                  if (dataset && format) {
                    handleExport(dataset as any, format as any);
                  }
                }}
                sx={{ height: '40px' }}
                renderValue={() => 'Экспорт отчета'}
              >
                <ListSubheader>Excel</ListSubheader>
                <MenuItem value="sales|excel">Отчет по продажам (Excel)</MenuItem>
                <MenuItem value="branches|excel">Отчет по филиалам (Excel)</MenuItem>
                <MenuItem value="products|excel">ТОП товаров (Excel)</MenuItem>
                <MenuItem value="customers|excel">ТОП клиентов (Excel)</MenuItem>
                
                <ListSubheader sx={{ mt: 1 }}>PDF</ListSubheader>
                <MenuItem value="sales|pdf">Отчет по продажам (PDF)</MenuItem>
                <MenuItem value="branches|pdf">Отчет по филиалам (PDF)</MenuItem>
                <MenuItem value="products|pdf">ТОП товаров (PDF)</MenuItem>
                <MenuItem value="customers|pdf">ТОП клиентов (PDF)</MenuItem>
              </Select>
            </FormControl>
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Динамика продаж
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesDynamics || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'Выручка') {
                        return [formatCurrency(Number(value)), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#6366f1" 
                    name="Количество заказов" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    name="Выручка"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          </Grid>

          {/* Top Customers */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ТОП клиентов
                </Typography>
                <Tooltip title="Экспорт в Excel">
                  <IconButton onClick={() => handleExport('customers', 'excel')} size="small">
                    <GridOnIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={topCustomers?.map(c => ({
                    ...c,
                    revenue: Number(c.revenue),
                    name: c.name || c.phone || `Клиент #${c.customerId?.slice(0, 6)}`
                  })) || []}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(Number(value)), 'Выручка'];
                      }
                      return [value, 'Заказов'];
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10b981" 
                    name="Выручка"
                    radius={[0, 4, 4, 0]}
                  >
                    {(topCustomers || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Branch Sales */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Продажи по филиалам
                </Typography>
                <Tooltip title="Экспорт в Excel">
                  <IconButton onClick={() => handleExport('branches', 'excel')} size="small">
                    <GridOnIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={branchSales?.map(b => ({
                      ...b,
                      value: Number(b.revenue)
                    })) || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {(branchSales || []).map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [
                      formatCurrency(Number(value)),
                      'Выручка'
                    ]}
                  />
                  <Legend 
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value, entry: any, index) => {
                      const total = branchSales?.reduce((sum, b) => sum + Number(b.revenue), 0) || 1;
                      const percent = ((entry.payload.value / total) * 100).toFixed(1);
                      return `${value}: ${percent}%`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Peak Hours */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Пиковые часы заказов
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={Array.from({ length: 24 }, (_, hour) => {
                    const hourData = peakHours?.find(h => h.hour === hour) || { hour, orders: 0 };
                    return {
                      ...hourData,
                      hour: `${hour}:00`,
                      hourNum: hour,
                      isPeak: hour >= 10 && hour <= 14 || hour >= 18 && hour <= 21
                    };
                  })}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value) => [`${value} заказов Количество заказов`]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="orders" 
                    name="Количество заказов"
                    radius={[4, 4, 0, 0]}
                  >
                    {Array.from({ length: 24 }).map((_, index) => {
                      const isPeak = index >= 10 && index <= 14 || index >= 18 && index <= 21;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isPeak ? '#8b5cf6' : '#c4b5fd'}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Box mt={2} textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Пиковые часы отмечены более насыщенным цветом
                </Typography>
              </Box>
            </Paper>
          </Grid>
        {/*</Grid>*/}
      </Box>
    </Layout>
  );
};

export default AnalyticsPage;





