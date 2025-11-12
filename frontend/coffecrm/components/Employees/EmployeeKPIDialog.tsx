'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import type { Employee, EmployeeKPI } from '@/types/employees';
import { API_BASE_URL, buildUrl, withAuthHeaders } from '@/utils/api';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

interface EmployeeKPIDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeKPIDialog: React.FC<EmployeeKPIDialogProps> = ({ open, onClose, employee }) => {
  const [kpi, setKpi] = useState<EmployeeKPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    const fetchKPI = async () => {
      if (!employee || !open) return;

      try {
        setLoading(true);
        setError(null);

        const url = buildUrl(`/employees/${employee.id}/kpi`, { period });
        const response = await fetch(url, {
          headers: withAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить KPI');
        }

        const data = await response.json();
        setKpi(data);
      } catch (err) {
        console.error(err);
        setError((err as Error).message ?? 'Ошибка загрузки KPI');
      } finally {
        setLoading(false);
      }
    };

    fetchKPI();
  }, [employee, open, period]);

  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">KPI сотрудника: {employee.user.fullName}</Typography>
          <TextField
            select
            label="Период"
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="week">Неделя</MenuItem>
            <MenuItem value="month">Месяц</MenuItem>
            <MenuItem value="quarter">Квартал</MenuItem>
          </TextField>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && kpi && (
          <Grid container spacing={2}>
            {kpi.summary && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Сводка за период
                  </Typography>
                  <Grid container spacing={2}>
                    {kpi.summary.totalOrders !== undefined && (
                      <Grid item xs={4}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {kpi.summary.totalOrders}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Заказов
                        </Typography>
                      </Grid>
                    )}
                    {kpi.summary.totalRevenue !== undefined && (
                      <Grid item xs={4}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {formatCurrency(kpi.summary.totalRevenue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Выручка
                        </Typography>
                      </Grid>
                    )}
                    {kpi.summary.averageCheck !== undefined && (
                      <Grid item xs={4}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                          {formatCurrency(kpi.summary.averageCheck)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Средний чек
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Метрики
                </Typography>
                {kpi.metrics && kpi.metrics.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Метрика</TableCell>
                        <TableCell align="right">Значение</TableCell>
                        <TableCell>Дата</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {kpi.metrics.map((metric, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip label={metric.metric} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {metric.value}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDateTime(metric.date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Метрики отсутствуют
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeKPIDialog;


