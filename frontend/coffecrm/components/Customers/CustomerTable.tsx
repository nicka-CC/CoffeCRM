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
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import type { Customer } from '@/types/customers';
import { formatCurrency } from '@/utils/formatters';
import {usePermissions} from "@/components/hooks/usePermissions";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onViewHistory: (customer: Customer) => void;
  onViewBonuses: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onView,
  onViewHistory,
  onViewBonuses,
}) => {
  const { canEditResource } = usePermissions();
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Клиент</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell align="right">Заказов</TableCell>
            <TableCell align="right">Потрачено</TableCell>
            <TableCell align="right">Средний чек</TableCell>
            <TableCell align="right">Бонусы</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                    {customer.user?.fullName?.charAt(0) || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {customer.user?.fullName || 'Неизвестно'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.user?.email || ''}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                {customer.vipStatus && (
                  <Chip label="VIP" color="warning" size="small" sx={{ mr: 1 }} />
                )}
                {customer.discountPercent && customer.discountPercent > 0 && (
                  <Chip
                    label={`Скидка ${customer.discountPercent}%`}
                    color="success"
                    size="small"
                  />
                )}
              </TableCell>
              <TableCell align="right">{customer.totalOrders || 0}</TableCell>
              <TableCell align="right">
                {customer.totalSpent ? formatCurrency(customer.totalSpent) : '—'}
              </TableCell>
              <TableCell align="right">
                {customer.averageCheck ? formatCurrency(customer.averageCheck) : '—'}
              </TableCell>
              <TableCell align="right">
                <Chip label={`${customer.bonus || 0} бонусов`} color="primary" size="small" />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Просмотр">
                  <IconButton size="small" disabled={!canEditResource('products', '1')} onClick={() => onView(customer)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="История заказов">
                  <IconButton size="small" disabled={!canEditResource('products', '1')} onClick={() => onViewHistory(customer)}>
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Бонусы">
                  <IconButton size="small" disabled={!canEditResource('products', '1')} onClick={() => onViewBonuses(customer)}>
                    <CardGiftcardIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Редактировать">
                  <IconButton size="small" disabled={!canEditResource('products', '1')} onClick={() => onEdit(customer)}>
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

export default CustomerTable;





