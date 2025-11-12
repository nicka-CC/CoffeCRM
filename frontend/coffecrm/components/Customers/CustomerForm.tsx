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
  FormControlLabel,
  Switch,
} from '@mui/material';
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/customers';
import type { User } from '@/types/employees';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ open, onClose, onSuccess, customer }) => {
  const isEdit = Boolean(customer);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    userId: '',
    bonus: '0',
    discountPercent: '0',
    vipStatus: false,
    notes: '',
    tags: '',
    source: '',
    birthday: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/all`, {
          headers: withAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          // Обрабатываем разные форматы ответа
          if (Array.isArray(data)) {
            setUsers(data);
          } else if (data?.users && Array.isArray(data.users)) {
            setUsers(data.users);
          } else if (data?.data && Array.isArray(data.data)) {
            setUsers(data.data);
          } else {
            setUsers([]);
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки пользователей', err);
      }
    };

    if (open && !isEdit) {
      fetchUsers();
    }
  }, [open, isEdit]);

  useEffect(() => {
    if (customer) {
      setForm({
        userId: customer.userId,
        bonus: customer.bonus?.toString() || '0',
        discountPercent: customer.discountPercent?.toString() || '0',
        vipStatus: customer.vipStatus || false,
        notes: customer.notes || '',
        tags: customer.tags?.join(', ') || '',
        source: customer.source || '',
        birthday: customer.birthday ? new Date(customer.birthday).toISOString().slice(0, 10) : '',
      });
    } else {
      setForm({
        userId: '',
        bonus: '0',
        discountPercent: '0',
        vipStatus: false,
        notes: '',
        tags: '',
        source: '',
        birthday: '',
      });
    }
  }, [customer, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      const payload: CreateCustomerDto | UpdateCustomerDto = {
        ...(isEdit
          ? {}
          : {
              userId: form.userId,
            }),
        bonus: Number(form.bonus),
        discountPercent: Number(form.discountPercent),
        vipStatus: form.vipStatus,
        ...(form.notes && { notes: form.notes }),
        ...(form.tags && {
          tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
        ...(form.source && { source: form.source }),
        ...(form.birthday && { birthday: new Date(form.birthday).toISOString() }),
      };

      const url = isEdit ? `${API_BASE_URL}/customers/${customer?.id}` : `${API_BASE_URL}/customers`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Не удалось сохранить клиента');
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
      <DialogTitle>{isEdit ? 'Редактировать клиента' : 'Добавить клиента'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            {!isEdit && (
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  label="Пользователь"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  fullWidth
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                label="Бонусы"
                name="bonus"
                type="number"
                inputProps={{ min: 0 }}
                value={form.bonus}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Процент скидки"
                name="discountPercent"
                type="number"
                inputProps={{ min: 0, max: 100, step: 0.1 }}
                value={form.discountPercent}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.vipStatus}
                    onChange={(e) => setForm((prev) => ({ ...prev, vipStatus: e.target.checked }))}
                    name="vipStatus"
                  />
                }
                label="VIP статус"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Источник"
                name="source"
                value={form.source}
                onChange={handleChange}
                fullWidth
                placeholder="Сайт, приложение, офлайн"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="День рождения"
                name="birthday"
                type="date"
                value={form.birthday}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
                placeholder="VIP, постоянный, корпоративный"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Заметки"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                multiline
                minRows={3}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {isEdit ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CustomerForm;



