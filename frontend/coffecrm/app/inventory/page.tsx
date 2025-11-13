'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  Button,
  Collapse,
  Tooltip,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import Layout from '@/components/Layout/Layout';
import InventoryTransactionDialog from '@/components/Inventory/InventoryTransactionDialog';
import type { StockOverviewItem, LowStockAlert } from '@/types/inventory';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { formatCurrency, formatDateTime, formatNumber } from '@/utils/formatters';

const InventoryPage: React.FC = () => {
  const [overview, setOverview] = useState<StockOverviewItem[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockOverviewItem | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (page) params.page = String(page);
      if (rowsPerPage) params.limit = String(rowsPerPage);

      const overviewUrl = new URL(`${API_BASE_URL}/stocks/overview`);
      Object.entries(params).forEach(([k, v]) => overviewUrl.searchParams.set(k, v));

      const [overviewRes, alertsRes] = await Promise.all([
        fetch(overviewUrl.toString(), { headers: withAuthHeaders() }),
        fetch(`${API_BASE_URL}/stocks/alerts/low`, { headers: withAuthHeaders() }),
      ]);

      if (!overviewRes.ok || !alertsRes.ok) {
        throw new Error('Не удалось загрузить данные склада');
      }

      const overviewData = await overviewRes.json();
      const alertsData = await alertsRes.json();

      // backend may return paginated shape { data, total, page, limit }
      if (overviewData && Array.isArray(overviewData.data)) {
        setOverview(overviewData.data ?? []);
        setTotal(typeof overviewData.total === 'number' ? overviewData.total : null);
      } else if (Array.isArray(overviewData)) {
        setOverview(overviewData ?? []);
        setTotal(overviewData.length);
      } else {
        setOverview([]);
        setTotal(0);
      }
      setAlerts(alertsData ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const totalValue = useMemo(() => overview.reduce((acc, item) => acc + (item.estimatedValue ?? 0), 0), [overview]);
  const totalQuantity = useMemo(() => overview.reduce((acc, item) => acc + (item.quantity ?? 0), 0), [overview]);
  const totalReserved = useMemo(() => overview.reduce((acc, item) => acc + (item.reserved ?? 0), 0), [overview]);
  const lowStockCount = useMemo(() => overview.filter((item) => item.isLowStock).length, [overview]);

  const handleRegister = (stock: StockOverviewItem) => {
    setSelectedStock(stock);
    setDialogOpen(true);
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Layout title="Склад" subtitle="Контролируйте остатки, движения и уведомления о дефиците">
      <Box sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3, gap: 2 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Всего запасов: ${formatNumber(totalQuantity)} ед.`} color="primary" />
            <Chip label={`Оценочная стоимость: ${formatCurrency(totalValue)}`} color="success" />
            <Chip label={`Зарезервировано: ${formatNumber(totalReserved)} ед.`} color="warning" />
            {lowStockCount > 0 && (
              <Chip icon={<WarningIcon />} label={`Низкие остатки: ${lowStockCount}`} color="error" />
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
              Обновить
            </Button>
          </Stack>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Остатки ингредиентов
                  </Typography>
                </Stack>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width={48} />
                      <TableCell>Продукт</TableCell>
                      <TableCell>Филиал</TableCell>
                      <TableCell align="right">Количество</TableCell>
                      <TableCell align="right">Доступно</TableCell>
                      <TableCell align="right">Стоимость</TableCell>
                      <TableCell align="right">Статус</TableCell>
                      <TableCell align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overview.map((item) => {
                      const isExpanded = expandedRows[item.id] ?? false;
                      const imageUrl = item.product.imageUrl
                        ? item.product.imageUrl.startsWith('http')
                          ? item.product.imageUrl
                          : `${API_BASE_URL}${item.product.imageUrl}`
                        : undefined;

                      return (
                        <React.Fragment key={item.id}>
                          <TableRow hover sx={{ backgroundColor: item.isLowStock ? '#fff3cd' : undefined }}>
                            <TableCell>
                              {item.recentTransactions && item.recentTransactions.length > 0 && (
                                <IconButton size="small" onClick={() => toggleRow(item.id)}>
                                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                {imageUrl && (
                                  <Avatar variant="rounded" src={imageUrl} sx={{ width: 32, height: 32 }} />
                                )}
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {item.product.name}
                                  </Typography>
                                  {item.product.sku && (
                                    <Typography variant="caption" color="text.secondary">
                                      Артикул: {item.product.sku}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">{item.branch.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.branch.city}
                                </Typography>
                                {item.location && (
                                  <Tooltip title="Место хранения">
                                    <Chip
                                      icon={<LocationOnIcon />}
                                      label={item.location}
                                      size="small"
                                      sx={{ mt: 0.5, height: 20 }}
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{formatNumber(item.quantity)}</Typography>
                              {item.reserved && item.reserved > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  (резерв: {formatNumber(item.reserved)})
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color={item.available && item.available < (item.minQuantity ?? 0) ? 'error' : 'inherit'}>
                                {formatNumber(item.available ?? item.quantity)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(item.estimatedValue)}</TableCell>
                            <TableCell align="right">
                              {item.isLowStock ? (
                                <Chip label="Низкий остаток" color="error" size="small" />
                              ) : (
                                <Chip label="Норма" color="success" size="small" />
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Зарегистрировать движение">
                                <IconButton color="primary" onClick={() => handleRegister(item)} size="small">
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          {item.recentTransactions && item.recentTransactions.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                  <Box sx={{ px: 3, py: 2, backgroundColor: '#f8fafc' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                      Последние операции
                                    </Typography>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Дата</TableCell>
                                          <TableCell>Тип</TableCell>
                                          <TableCell>Количество</TableCell>
                                          <TableCell>Цена</TableCell>
                                          <TableCell>Причина</TableCell>
                                          <TableCell>Документ</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {item.recentTransactions.map((transaction) => (
                                          <TableRow key={transaction.id}>
                                            <TableCell>{formatDateTime(transaction.date)}</TableCell>
                                            <TableCell>
                                              <Chip
                                                label={
                                                  transaction.type === 'INCOME'
                                                    ? 'Приход'
                                                    : transaction.type === 'EXPENSE'
                                                      ? 'Расход'
                                                      : 'Списание'
                                                }
                                                size="small"
                                                color={
                                                  transaction.type === 'INCOME'
                                                    ? 'success'
                                                    : transaction.type === 'EXPENSE'
                                                      ? 'primary'
                                                      : 'error'
                                                }
                                              />
                                            </TableCell>
                                            <TableCell>{formatNumber(transaction.quantity)}</TableCell>
                                            <TableCell>{formatCurrency(transaction.price ?? null)}</TableCell>
                                            <TableCell>{transaction.reason ?? '—'}</TableCell>
                                            <TableCell>{transaction.document ?? '—'}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                      <TablePagination
                                        component="div"
                                        count={total ?? overview.length}
                                        page={page - 1}
                                        onPageChange={(_, newPage) => setPage(newPage + 1)}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(1); }}
                                        rowsPerPageOptions={[10, 20, 50, 100]}
                                      />
                                    </Box>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #fee2e2', backgroundColor: '#fef2f2', mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <WarningIcon color="error" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Уведомления о низких остатках
                  </Typography>
                </Stack>
                {alerts.length === 0 && <Typography>Критических остатков нет</Typography>}
                {alerts.map((alert) => {
                  const imageUrl = alert.productImageUrl
                    ? alert.productImageUrl.startsWith('http')
                      ? alert.productImageUrl
                      : `${API_BASE_URL}${alert.productImageUrl}`
                    : undefined;

                  return (
                    <Card key={alert.stockId} sx={{ mb: 2, border: '1px solid #fecaca' }}>
                      <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          {imageUrl && <Avatar src={imageUrl} sx={{ width: 40, height: 40 }} />}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {alert.productName}
                            </Typography>
                            {alert.productSku && (
                              <Typography variant="caption" color="text.secondary">
                                Артикул: {alert.productSku}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Филиал: {alert.branchName} ({alert.branchCity})
                        </Typography>
                        {alert.branchManagerName && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Менеджер: {alert.branchManagerName}
                            {alert.branchManagerPhone && ` (${alert.branchManagerPhone})`}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip
                            label={`Остаток: ${alert.quantity} / Порог: ${alert.threshold}`}
                            color="error"
                            size="small"
                          />
                          {alert.available !== undefined && (
                            <Chip label={`Доступно: ${alert.available}`} size="small" />
                          )}
                        </Stack>
                        {alert.location && (
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{alert.location}</Typography>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        )}

        <InventoryTransactionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          stock={selectedStock}
          onSuccess={fetchData}
        />
      </Box>
    </Layout>
  );
};

export default InventoryPage;
