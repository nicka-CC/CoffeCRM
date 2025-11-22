'use client';

import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Chip,
  TableContainer,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Order, OrderStatus } from '@/types/orders';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onView: (order: Order) => void;
}

const statusColors: Record<OrderStatus, 'default' | 'primary' | 'warning' | 'success' | 'error' | 'info'> = {
  NEW: 'primary',
  IN_PROGRESS: 'warning',
  READY: 'info',
  COMPLETED: 'success',
  CANCELED: 'error',
};

const statusLabels: Record<OrderStatus, string> = {
  NEW: 'Новый',
  IN_PROGRESS: 'В работе',
  READY: 'Готов',
  COMPLETED: 'Выполнен',
  CANCELED: 'Отменен',
};

const OrderTable: React.FC<OrderTableProps> = ({ orders, onEdit, onView }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Филиал</TableCell>
            <TableCell>Клиент</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell align="right">Движ.</TableCell>
            <TableCell align="right">Сумма</TableCell>
            <TableCell align="right">Товаров</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell>#{order.id.slice(0, 8)}</TableCell>
              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
              <TableCell>
                {order.branch ? `${order.branch.name} (${order.branch.city})` : '—'}
              </TableCell>
              <TableCell>
                {order.customer?.user ? (
                  <>
                    {order.customer.user.fullName}
                    {order.customer.user.phone && ` (${order.customer.user.phone})`}
                  </>
                ) : (
                  'Гость'
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[order.status]}
                  color={statusColors[order.status]}
                  size="small"
                />
              </TableCell>
              <TableCell>{order.type ?? '—'}</TableCell>
              <TableCell align="right">{order.stockTransactions ? order.stockTransactions.length : 0}</TableCell>
              <TableCell align="right">{formatCurrency(order.total)}</TableCell>
              <TableCell align="right">{order.items?.length ?? 0}</TableCell>
              <TableCell align="right">
                <Tooltip title="Просмотр">
                  <IconButton size="small" onClick={() => onView(order)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Редактировать">
                  <IconButton size="small" onClick={() => onEdit(order)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;

