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
  Stack,
  Box,
  Divider,
} from '@mui/material';
import type { Booking } from '@/types/bookings';
import { formatCurrency, formatDateTime, formatDate } from '@/utils/formatters';

interface BookingDetailsProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const statusColors: Record<string, 'default' | 'primary' | 'warning' | 'success' | 'error' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  COMPLETED: 'success',
  CANCELED: 'error',
  NO_SHOW: 'error',
};

const statusLabels: Record<string, string> = {
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

const paymentMethodLabels: Record<string, string> = {
  CASH: 'Наличные',
  CARD: 'Карта',
  ONLINE: 'Онлайн',
  BONUS: 'Бонусы',
  FREE: 'Бесплатно',
};

const BookingDetails: React.FC<BookingDetailsProps> = ({
  open,
  onClose,
  booking,
  onConfirm,
  onCancel,
  onComplete,
}) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {booking.title || `Бронирование #${booking.id.slice(0, 8)}`}
          </Typography>
          <Chip label={statusLabels[booking.status]} color={statusColors[booking.status]} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Информация о бронировании
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Дата:</strong> {formatDate(booking.date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Время:</strong>{' '}
                  {new Date(booking.timeFrom).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(booking.timeTo).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
                {booking.duration && (
                  <Typography variant="body2">
                    <strong>Продолжительность:</strong> {booking.duration} мин.
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Тип:</strong> {typeLabels[booking.type] || booking.type}
                </Typography>
                <Typography variant="body2">
                  <strong>Гостей:</strong> {booking.guestsCount}
                </Typography>
                {booking.tableNumber && (
                  <Typography variant="body2">
                    <strong>Стол:</strong> {booking.tableNumber}
                  </Typography>
                )}
                {booking.confirmationCode && (
                  <Typography variant="body2">
                    <strong>Код подтверждения:</strong> {booking.confirmationCode}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Филиал и клиент
              </Typography>
              <Stack spacing={1}>
                {booking.branch && (
                  <>
                    <Typography variant="body2">
                      <strong>Филиал:</strong> {booking.branch.name}
                    </Typography>
                    <Typography variant="body2">
                      {booking.branch.address}, {booking.branch.city}
                    </Typography>
                    {booking.branch.phone && (
                      <Typography variant="body2">
                        <strong>Телефон:</strong> {booking.branch.phone}
                      </Typography>
                    )}
                  </>
                )}
                <Divider />
                {booking.customer?.user ? (
                  <>
                    <Typography variant="body2">
                      <strong>Клиент:</strong> {booking.customer.user.fullName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {booking.customer.user.email}
                    </Typography>
                    {booking.customer.user.phone && (
                      <Typography variant="body2">
                        <strong>Телефон:</strong> {booking.customer.user.phone}
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    {booking.contactName && (
                      <Typography variant="body2">
                        <strong>Контакт:</strong> {booking.contactName}
                      </Typography>
                    )}
                    {booking.contactPhone && (
                      <Typography variant="body2">
                        <strong>Телефон:</strong> {booking.contactPhone}
                      </Typography>
                    )}
                    {booking.contactEmail && (
                      <Typography variant="body2">
                        <strong>Email:</strong> {booking.contactEmail}
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            </Paper>
          </Grid>

          {booking.description && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Описание
                </Typography>
                <Typography variant="body2">{booking.description}</Typography>
              </Paper>
            </Grid>
          )}

          {booking.specialRequests && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: '1px solid #e2e8f0', backgroundColor: '#fff9e6' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Особые пожелания
                </Typography>
                <Typography variant="body2">{booking.specialRequests}</Typography>
              </Paper>
            </Grid>
          )}

          {(booking.price || booking.deposit || booking.paymentMethod) && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: '1px solid #e2e8f0', backgroundColor: '#f0f9ff' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Оплата
                </Typography>
                <Stack spacing={1}>
                  {booking.price && (
                    <Typography variant="body2">
                      <strong>Стоимость:</strong> {formatCurrency(booking.price)}
                    </Typography>
                  )}
                  {booking.deposit && (
                    <Typography variant="body2">
                      <strong>Предоплата:</strong> {formatCurrency(booking.deposit)}
                    </Typography>
                  )}
                  {booking.paymentMethod && (
                    <Typography variant="body2">
                      <strong>Способ оплаты:</strong>{' '}
                      {paymentMethodLabels[booking.paymentMethod] || booking.paymentMethod}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Оплачено:</strong> {booking.isPaid ? 'Да' : 'Нет'}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          )}

          {booking.employee && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Сотрудник
                </Typography>
                <Typography variant="body2">
                  {booking.employee.user?.fullName || 'Не указан'}
                </Typography>
              </Paper>
            </Grid>
          )}

          {booking.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Внутренние заметки
                </Typography>
                <Typography variant="body2">{booking.notes}</Typography>
              </Paper>
            </Grid>
          )}

          {booking.cancellationReason && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: '1px solid #fee2e2', backgroundColor: '#fef2f2' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                  Причина отмены
                </Typography>
                <Typography variant="body2">{booking.cancellationReason}</Typography>
                {booking.cancelledAt && (
                  <Typography variant="caption" color="text.secondary">
                    Отменено: {formatDateTime(booking.cancelledAt)}
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}

          {booking.tags && booking.tags.length > 0 && (
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {booking.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
        {booking.status === 'PENDING' && onConfirm && (
          <Button variant="contained" color="success" onClick={() => onConfirm(booking.id)}>
            Подтвердить
          </Button>
        )}
        {booking.status !== 'CANCELED' && booking.status !== 'COMPLETED' && onCancel && (
          <Button variant="outlined" color="error" onClick={() => onCancel(booking.id)}>
            Отменить
          </Button>
        )}
        {booking.status === 'CONFIRMED' && onComplete && (
          <Button variant="contained" color="primary" onClick={() => onComplete(booking.id)}>
            Завершить
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetails;

