'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  Stack,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import type { Booking, CreateBookingDto, UpdateBookingDto, BookingStatus, BookingType, PaymentMethod } from '@/types/bookings';
import type { BranchSummary } from '@/types/branches';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { formatCurrency } from '@/utils/formatters';

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  booking?: Booking | null;
}

const statusOptions: Array<{ value: BookingStatus; label: string }> = [
  { value: 'PENDING', label: 'Ожидает' },
  { value: 'CONFIRMED', label: 'Подтверждено' },
  { value: 'COMPLETED', label: 'Завершено' },
  { value: 'CANCELED', label: 'Отменено' },
  { value: 'NO_SHOW', label: 'Не явились' },
];

const typeOptions: Array<{ value: BookingType; label: string }> = [
  { value: 'TABLE', label: 'Стол' },
  { value: 'EVENT', label: 'Событие' },
  { value: 'MEETING', label: 'Встреча' },
  { value: 'PRIVATE', label: 'Приватное' },
  { value: 'OTHER', label: 'Другое' },
];

const paymentMethodOptions: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'CASH', label: 'Наличные' },
  { value: 'CARD', label: 'Карта' },
  { value: 'ONLINE', label: 'Онлайн' },
  { value: 'BONUS', label: 'Бонусы' },
  { value: 'FREE', label: 'Бесплатно' },
];

const BookingForm: React.FC<BookingFormProps> = ({ open, onClose, onSuccess, booking }) => {
  const isEdit = Boolean(booking);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const defaultDate = new Date();
  defaultDate.setHours(defaultDate.getHours() + 1);
  defaultDate.setMinutes(0);
  
  const defaultEndDate = new Date(defaultDate);
  defaultEndDate.setHours(defaultEndDate.getHours() + 2);

  const [form, setForm] = useState({
    branchId: '',
    customerId: '',
    employeeId: '',
    title: '',
    description: '',
    date: defaultDate.toISOString().slice(0, 16),
    timeFrom: defaultDate.toISOString().slice(0, 16),
    timeTo: defaultEndDate.toISOString().slice(0, 16),
    duration: '',
    type: 'TABLE' as BookingType,
    status: 'PENDING' as BookingStatus,
    guestsCount: '1',
    tableNumber: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    specialRequests: '',
    notes: '',
    price: '',
    deposit: '',
    paymentMethod: '' as PaymentMethod | '',
    isPaid: false,
    isConfirmed: false,
    source: '',
    tags: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, customersRes, employeesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/branches`, { headers: withAuthHeaders() }),
          fetch(`${API_BASE_URL}/customers`, { headers: withAuthHeaders() }),
          fetch(`${API_BASE_URL}/employees`, { headers: withAuthHeaders() }),
        ]);

        if (branchesRes.ok) {
          const branchesData = await branchesRes.json();
          setBranches(Array.isArray(branchesData) ? branchesData : branchesData?.data ?? []);
        }

        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(Array.isArray(customersData) ? customersData : customersData?.data ?? []);
        }

        if (employeesRes.ok) {
          const employeesData = await employeesRes.json();
          setEmployees(Array.isArray(employeesData) ? employeesData : employeesData?.data ?? []);
        }
      } catch (err) {
        console.error('Ошибка загрузки данных', err);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (booking) {
      setForm({
        branchId: booking.branchId,
        customerId: booking.customerId,
        employeeId: booking.employeeId || '',
        title: booking.title || '',
        description: booking.description || '',
        date: booking.date ? new Date(booking.date).toISOString().slice(0, 16) : defaultDate.toISOString().slice(0, 16),
        timeFrom: booking.timeFrom ? new Date(booking.timeFrom).toISOString().slice(0, 16) : defaultDate.toISOString().slice(0, 16),
        timeTo: booking.timeTo ? new Date(booking.timeTo).toISOString().slice(0, 16) : defaultEndDate.toISOString().slice(0, 16),
        duration: booking.duration?.toString() || '',
        type: booking.type,
        status: booking.status,
        guestsCount: booking.guestsCount.toString(),
        tableNumber: booking.tableNumber || '',
        contactName: booking.contactName || '',
        contactPhone: booking.contactPhone || '',
        contactEmail: booking.contactEmail || '',
        specialRequests: booking.specialRequests || '',
        notes: booking.notes || '',
        price: booking.price?.toString() || '',
        deposit: booking.deposit?.toString() || '',
        paymentMethod: booking.paymentMethod || '',
        isPaid: booking.isPaid,
        isConfirmed: booking.isConfirmed,
        source: booking.source || '',
        tags: booking.tags?.join(', ') || '',
      });
    } else {
      setForm({
        branchId: '',
        customerId: '',
        employeeId: '',
        title: '',
        description: '',
        date: defaultDate.toISOString().slice(0, 16),
        timeFrom: defaultDate.toISOString().slice(0, 16),
        timeTo: defaultEndDate.toISOString().slice(0, 16),
        duration: '',
        type: 'TABLE',
        status: 'PENDING',
        guestsCount: '1',
        tableNumber: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        specialRequests: '',
        notes: '',
        price: '',
        deposit: '',
        paymentMethod: '',
        isPaid: false,
        isConfirmed: false,
        source: '',
        tags: '',
      });
    }
  }, [booking, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculateDuration = () => {
    if (form.timeFrom && form.timeTo) {
      const from = new Date(form.timeFrom);
      const to = new Date(form.timeTo);
      const diff = to.getTime() - from.getTime();
      return Math.round(diff / (1000 * 60)); // в минутах
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      const duration = form.duration ? Number(form.duration) : calculateDuration();

      // Комбинируем дату и время
      const dateStr = form.date.split('T')[0];
      const timeFromStr = form.timeFrom.includes('T') ? form.timeFrom.split('T')[1]?.slice(0, 5) : form.timeFrom.slice(0, 5) || '12:00';
      const timeToStr = form.timeTo.includes('T') ? form.timeTo.split('T')[1]?.slice(0, 5) : form.timeTo.slice(0, 5) || '14:00';

      const date = new Date(`${dateStr}T00:00:00`);
      const timeFrom = new Date(`${dateStr}T${timeFromStr}:00`);
      const timeTo = new Date(`${dateStr}T${timeToStr}:00`);

      const payload: CreateBookingDto | UpdateBookingDto = {
        ...(isEdit
          ? {}
          : {
              branchId: form.branchId,
              customerId: form.customerId,
            }),
        ...(form.employeeId && { employeeId: form.employeeId }),
        ...(form.title && { title: form.title }),
        ...(form.description && { description: form.description }),
        date: date.toISOString(),
        timeFrom: timeFrom.toISOString(),
        timeTo: timeTo.toISOString(),
        ...(duration && { duration }),
        type: form.type,
        ...(isEdit && { status: form.status }),
        guestsCount: Number(form.guestsCount),
        ...(form.tableNumber && { tableNumber: form.tableNumber }),
        ...(form.contactName && { contactName: form.contactName }),
        ...(form.contactPhone && { contactPhone: form.contactPhone }),
        ...(form.contactEmail && { contactEmail: form.contactEmail }),
        ...(form.specialRequests && { specialRequests: form.specialRequests }),
        ...(form.notes && { notes: form.notes }),
        ...(form.price && { price: Number(form.price) }),
        ...(form.deposit && { deposit: Number(form.deposit) }),
        ...(form.paymentMethod && { paymentMethod: form.paymentMethod as PaymentMethod }),
        isPaid: form.isPaid,
        isConfirmed: form.isConfirmed,
        ...(form.source && { source: form.source }),
        ...(form.tags && {
          tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      };

      const url = isEdit ? `${API_BASE_URL}/bookings/${booking?.id}` : `${API_BASE_URL}/bookings`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Не удалось сохранить бронирование');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать бронирование' : 'Создать бронирование'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            {!isEdit && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    required
                    label="Филиал"
                    name="branchId"
                    value={form.branchId}
                    onChange={handleChange}
                    fullWidth
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name} ({branch.city})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    required
                    label="Клиент"
                    name="customerId"
                    value={form.customerId}
                    onChange={handleChange}
                    fullWidth
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.user?.fullName || customer.id} ({customer.user?.email || ''})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                label="Название"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                placeholder="Например: День рождения"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Тип"
                name="type"
                value={form.type}
                onChange={handleChange}
                fullWidth
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                label="Дата"
                name="date"
                type="date"
                value={form.date.split('T')[0]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    date: `${e.target.value}T${prev.date.split('T')[1] || '12:00'}`,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                label="Время начала"
                name="timeFrom"
                type="time"
                value={
                  form.timeFrom.includes('T')
                    ? form.timeFrom.split('T')[1]?.slice(0, 5) || ''
                    : form.timeFrom.slice(0, 5) || ''
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    timeFrom: `${prev.date.split('T')[0]}T${e.target.value}`,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                label="Время окончания"
                name="timeTo"
                type="time"
                value={
                  form.timeTo.includes('T')
                    ? form.timeTo.split('T')[1]?.slice(0, 5) || ''
                    : form.timeTo.slice(0, 5) || ''
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    timeTo: `${prev.date.split('T')[0]}T${e.target.value}`,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Количество гостей"
                name="guestsCount"
                type="number"
                inputProps={{ min: 1 }}
                value={form.guestsCount}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Номер стола"
                name="tableNumber"
                value={form.tableNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Контактное имя"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Контактный телефон"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Контактный email"
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Описание"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                minRows={2}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Особые пожелания"
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                multiline
                minRows={2}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Стоимость"
                name="price"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={form.price}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Предоплата"
                name="deposit"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={form.deposit}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Способ оплаты"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Не выбрано</MenuItem>
                {paymentMethodOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isPaid}
                    onChange={(e) => setForm((prev) => ({ ...prev, isPaid: e.target.checked }))}
                    name="isPaid"
                  />
                }
                label="Оплачено"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isConfirmed}
                    onChange={(e) => setForm((prev) => ({ ...prev, isConfirmed: e.target.checked }))}
                    name="isConfirmed"
                  />
                }
                label="Подтверждено клиентом"
              />
            </Grid>

            {isEdit && (
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Статус"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  fullWidth
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Сотрудник"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Не назначен</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.user?.fullName || employee.id} - {employee.position}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Внутренние заметки"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                multiline
                minRows={2}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Теги (через запятую)"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                fullWidth
                placeholder="VIP, праздник, корпоратив"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default BookingForm;

