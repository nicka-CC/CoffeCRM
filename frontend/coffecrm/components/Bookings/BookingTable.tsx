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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Booking, BookingStatus } from '@/types/bookings';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

interface BookingTableProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onView: (booking: Booking) => void;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

const statusColors: Record<BookingStatus, 'default' | 'primary' | 'warning' | 'success' | 'error' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  COMPLETED: 'success',
  CANCELED: 'error',
  NO_SHOW: 'error',
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждено',
  COMPLETED: 'Завершено',
  CANCELED: 'Отменено',
  NO_SHOW: 'Не явились',
};

const typeLabels: Record<string, string> = {
  TABLE: 'Стол',
  EVENT: 'Событие',
  MEETING: 'Встреча',
  PRIVATE: 'Приватное',
  OTHER: 'Другое',
};

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onEdit,
  onView,
  onConfirm,
  onCancel,
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Дата и время</TableCell>
            <TableCell>Клиент</TableCell>
            <TableCell>Филиал</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Гостей</TableCell>
            <TableCell>Стол</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell align="right">Сумма</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} hover>
              <TableCell>
                <div>{formatDateTime(booking.date)}</div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  {new Date(booking.timeFrom).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(booking.timeTo).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </TableCell>
              <TableCell>
                {booking.customer?.user ? (
                  <>
                    {booking.customer.user.fullName}
                    {booking.customer.user.phone && (
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {booking.customer.user.phone}
                      </div>
                    )}
                  </>
                ) : (
                  booking.contactName || 'Гость'
                )}
              </TableCell>
              <TableCell>
                {booking.branch ? (
                  <>
                    {booking.branch.name}
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>{booking.branch.city}</div>
                  </>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>{typeLabels[booking.type] || booking.type}</TableCell>
              <TableCell>{booking.guestsCount}</TableCell>
              <TableCell>{booking.tableNumber || '—'}</TableCell>
              <TableCell>
                <Chip
                  label={statusLabels[booking.status]}
                  color={statusColors[booking.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                {booking.price ? formatCurrency(booking.price) : '—'}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Просмотр">
                  <IconButton size="small" onClick={() => onView(booking)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Редактировать">
                  <IconButton size="small" onClick={() => onEdit(booking)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {booking.status === 'PENDING' && (
                  <Tooltip title="Подтвердить">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => onConfirm(booking.id)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {booking.status !== 'CANCELED' && booking.status !== 'COMPLETED' && (
                  <Tooltip title="Отменить">
                    <IconButton size="small" color="error" onClick={() => onCancel(booking.id)}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingTable;

