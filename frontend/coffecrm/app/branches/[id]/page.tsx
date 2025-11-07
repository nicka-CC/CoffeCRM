'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from '@/components/Layout/Layout';
import type { BranchDetails } from '@/types/branches';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { formatCurrency, formatDateTime, formatNumber } from '@/utils/formatters';

const BranchDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const branchId = params?.id;

  const [data, setData] = useState<BranchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!branchId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/branches/${branchId}/details`, {
          headers: withAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные филиала');
        }

        const details = await response.json();
        setData(details);
        setError(null);
      } catch (err) {
        console.error(err);
        setError((err as Error).message ?? 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [branchId]);

  return (
    <Layout title="Филиал" subtitle="Аналитика, сотрудники и складские остатки">
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} sx={{ mb: 3 }} onClick={() => router.back()}>
          Назад
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Информация о филиале
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="body1">
                    <strong>Название:</strong> {data.branch.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Адрес:</strong> {data.branch.city}, {data.branch.address}
                  </Typography>
                  {data.branch.phone && (
                    <Typography variant="body1">
                      <strong>Телефон:</strong> {data.branch.phone}
                    </Typography>
                  )}
                  {data.branch.email && (
                    <Typography variant="body1">
                      <strong>Email:</strong> {data.branch.email}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Создан: {formatDateTime(data.branch.createdAt)}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Продажи и показатели
                </Typography>
                <Stack spacing={1.5}>
                  <Chip label={`Выручка: ${formatCurrency(data.sales.revenue)}`} color="success" sx={{ fontWeight: 600 }} />
                  <Chip label={`Заказы: ${formatNumber(data.sales.ordersCount)}`} color="primary" sx={{ fontWeight: 600 }} />
                  <Chip label={`Средний чек: ${formatCurrency(data.sales.averageCheck)}`} color="secondary" sx={{ fontWeight: 600 }} />
                </Stack>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Последние заказы
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Сумма</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Клиент</TableCell>
                      <TableCell>Дата</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.sales.latestOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id.slice(0, 8)}…</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Chip label={order.status} size="small" />
                        </TableCell>
                        <TableCell>{order.customer?.name ?? '—'}</TableCell>
                        <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Сотрудники
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ФИО</TableCell>
                      <TableCell>Должность</TableCell>
                      <TableCell>Телефон</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.fullName ?? '—'}</TableCell>
                        <TableCell>{employee.position ?? '—'}</TableCell>
                        <TableCell>{employee.phone ?? '—'}</TableCell>
                        <TableCell>{employee.email ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Запасы на складе
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Продукт</TableCell>
                      <TableCell align="right">Количество</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.inventory.map((item) => (
                      <TableRow key={item.stockId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{formatNumber(item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default BranchDetailPage;

