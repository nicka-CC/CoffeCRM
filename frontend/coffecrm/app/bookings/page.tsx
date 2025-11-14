'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Stack,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TableChartIcon from '@mui/icons-material/TableChart';
import Layout from '@/components/Layout/Layout';
import BookingTable from '@/components/Bookings/BookingTable';
import BookingForm from '@/components/Bookings/BookingForm';
import BookingDetails from '@/components/Bookings/BookingDetails';
import BookingCalendar from '@/components/Bookings/BookingCalendar';
import type { Booking, BookingStatus, BookingType } from '@/types/bookings';
import { API_BASE_URL, buildUrl, withAuthHeaders } from '@/utils/api';
import { formatCurrency } from '@/utils/formatters';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [filters, setFilters] = useState({
    status: '' as BookingStatus | '',
    type: '' as BookingType | '',
    branchId: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.branchId) params.branchId = filters.branchId;
      if (filters.search) params.search = filters.search;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      params.page = String(page);
      params.limit = String(rowsPerPage);

      const url = buildUrl('/bookings', params);
      const response = await fetch(url, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить список бронирований');
      }

      const data = await response.json();
      setBookings(data.data ?? (Array.isArray(data) ? data : []));
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0));
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters, page, rowsPerPage]);

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setFormOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormOpen(true);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleConfirmBooking = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/confirm`, {
        method: 'PUT',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось подтвердить бронирование');
      }

      fetchBookings();
      if (selectedBooking?.id === id) {
        setDetailsOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка подтверждения');
    }
  };

  const handleCancelBooking = async (id: string) => {
    const reason = prompt('Причина отмены (необязательно):');
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ reason: reason || undefined }),
      });

      if (!response.ok) {
        throw new Error('Не удалось отменить бронирование');
      }

      fetchBookings();
      if (selectedBooking?.id === id) {
        setDetailsOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка отмены');
    }
  };

  const handleCompleteBooking = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/complete`, {
        method: 'PUT',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось завершить бронирование');
      }

      fetchBookings();
      if (selectedBooking?.id === id) {
        setDetailsOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка завершения');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedBooking(null);
  };

  const handleFormSuccess = () => {
    fetchBookings();
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedBooking(null);
  };

  const statusCounts = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    },
    {} as Record<BookingStatus, number>,
  );

  const totalRevenue = bookings
    .filter((b) => b.status === 'COMPLETED' && b.price)
    .reduce((acc, booking) => acc + (booking.price || 0), 0);

  return (
    <Layout title="Бронирования" subtitle="Управляйте бронированиями, отслеживайте календарь и статусы">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} color="textSecondary">
            Бронирования
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBookings}>
              Обновить
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddBooking}>
              Создать бронирование
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f0f9ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {bookings.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего бронирований
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3cd' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {statusCounts.PENDING || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ожидают
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#d1fae5' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {statusCounts.CONFIRMED || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Подтверждено
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e0e7ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {totalRevenue.toLocaleString('ru-RU')} ₽
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Выручка
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0' }}>
          <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)} sx={{ mb: 2 }}>
            <Tab icon={<TableChartIcon />} label="Таблица" value="table" />
            <Tab icon={<CalendarMonthIcon />} label="Календарь" value="calendar" />
          </Tabs>

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              select
              label="Статус"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as BookingStatus | '' }))}
              sx={{ minWidth: 150 }}
              size="small"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="PENDING">Ожидает</MenuItem>
              <MenuItem value="CONFIRMED">Подтверждено</MenuItem>
              <MenuItem value="COMPLETED">Завершено</MenuItem>
              <MenuItem value="CANCELED">Отменено</MenuItem>
              <MenuItem value="NO_SHOW">Не явились</MenuItem>
            </TextField>
            <TextField
              select
              label="Тип"
              value={filters.type}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as BookingType | '' }))}
              sx={{ minWidth: 150 }}
              size="small"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="TABLE">Стол</MenuItem>
              <MenuItem value="EVENT">Событие</MenuItem>
              <MenuItem value="MEETING">Встреча</MenuItem>
              <MenuItem value="PRIVATE">Приватное</MenuItem>
              <MenuItem value="OTHER">Другое</MenuItem>
            </TextField>
            <TextField
              label="Поиск"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Клиент, телефон, стол..."
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="С"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="По"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Stack>
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            {viewMode === 'table' ? (
              <>
                {bookings.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Бронирования не найдены
                    </Typography>
                  </Paper>
                ) : (
                  <>
                    <BookingTable
                      bookings={bookings}
                      onEdit={handleEditBooking}
                      onView={handleViewBooking}
                      onConfirm={handleConfirmBooking}
                      onCancel={handleCancelBooking}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <TablePagination
                        component="div"
                        count={total}
                        page={page - 1}
                        onPageChange={(_, newPage) => setPage(newPage + 1)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(1); }}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                      />
                    </Box>
                  </>
                )}
              </>
            ) : (
              <BookingCalendar
                bookings={bookings}
                onBookingClick={handleViewBooking}
              />
            )}
          </>
        )}

        <BookingForm
          open={formOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          booking={selectedBooking}
        />
        <BookingDetails
          open={detailsOpen}
          onClose={handleDetailsClose}
          booking={selectedBooking}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
          onComplete={handleCompleteBooking}
        />
      </Box>
    </Layout>
  );
};

export default BookingsPage;


