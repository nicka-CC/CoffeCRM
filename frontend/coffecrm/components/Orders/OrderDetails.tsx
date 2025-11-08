'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Box,
  Avatar,
} from '@mui/material';
import type { Order } from '@/types/orders';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { API_BASE_URL } from '@/utils/api';

interface OrderDetailsProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const statusColors: Record<string, 'default' | 'primary' | 'warning' | 'success' | 'error' | 'info'> = {
  NEW: 'primary',
  IN_PROGRESS: 'warning',
  READY: 'info',
  COMPLETED: 'success',
  CANCELED: 'error',
};

const statusLabels: Record<string, string> = {
  NEW: 'Новый',
  IN_PROGRESS: 'В работе',
  READY: 'Готов',
  COMPLETED: 'Выполнен',
  CANCELED: 'Отменен',
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ open, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Детали заказа #{order.id.slice(0, 8)}</Typography>
          <Chip label={statusLabels[order.status]} color={statusColors[order.status]} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Информация о заказе
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Дата создания:</strong> {formatDateTime(order.createdAt)}
                </Typography>
                {order.branch && (
                  <Typography variant="body2">
                    <strong>Филиал:</strong> {order.branch.name} ({order.branch.city})
                  </Typography>
                )}
                {order.customer?.user && (
                  <>
                    <Typography variant="body2">
                      <strong>Клиент:</strong> {order.customer.user.fullName}
                    </Typography>
                    {order.customer.user.phone && (
                      <Typography variant="body2">
                        <strong>Телефон:</strong> {order.customer.user.phone}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <strong>Email:</strong> {order.customer.user.email}
                    </Typography>
                  </>
                )}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #e2e8f0', backgroundColor: '#f0f9ff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Сумма заказа
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(order.total)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Товаров: {order.items?.length ?? 0} шт.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Состав заказа
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell align="right">Цена</TableCell>
                    <TableCell align="right">Количество</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item) => {
                    const imageUrl = item.product?.imageUrl
                      ? item.product.imageUrl.startsWith('http')
                        ? item.product.imageUrl
                        : `${API_BASE_URL}${item.product.imageUrl}`
                      : undefined;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {imageUrl && <Avatar src={imageUrl} sx={{ width: 32, height: 32 }} />}
                            <Typography variant="body2">
                              {item.product?.name ?? `Товар #${item.productId.slice(0, 8)}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>
                      Итого:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatCurrency(order.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetails;

