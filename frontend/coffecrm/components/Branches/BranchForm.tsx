'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
} from '@mui/material';
import FormTextField from '@/components/UI/FormField';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { usePermissions } from '@/components/hooks/usePermissions';
import type { BranchSummary } from '@/types/branches';

interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (created?: BranchSummary) => void;
  initial?: Partial<BranchSummary> | null;
}

const BranchForm: React.FC<BranchFormProps> = ({ open, onClose, onSuccess, initial }) => {
  const isEdit = Boolean(initial?.id);
  const [loading, setLoading] = useState(false);
  const { canEditResource, canCreateResource } = usePermissions();
  const allowedToSubmit = isEdit ? canEditResource('branch', initial?.id) : canCreateResource('branch');
  const [form, setForm] = useState({
    name: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? '',
        city: initial.city ?? '',
        address: initial.address ?? '',
        phone: initial.phone ?? '',
        email: initial.email ?? '',
        latitude: initial.latitude?.toString() ?? '',
        longitude: initial.longitude?.toString() ?? '',
      });
    } else {
      setForm({ name: '', city: '', address: '', phone: '', email: '', latitude: '', longitude: '' });
    }
  }, [initial, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: any = {
        name: form.name,
        city: form.city,
        address: form.address,
      };
      if (form.phone) payload.phone = form.phone;
      if (form.email) payload.email = form.email;
      if (form.latitude) payload.latitude = parseFloat(form.latitude);
      if (form.longitude) payload.longitude = parseFloat(form.longitude);

      const url = isEdit ? `${API_BASE_URL}/branches/${initial?.id}` : `${API_BASE_URL}/branches`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Ошибка при сохранении филиала');
      }

      const data = await res.json();
      onSuccess(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать филиал' : 'Создать филиал'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormTextField label="Название" name="name" value={form.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField label="Город" name="city" value={form.city} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField label="Адрес" name="address" value={form.address} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField label="Телефон" name="phone" value={form.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField label="Email" name="email" value={form.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormTextField label="Широта" name="latitude" value={form.latitude} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormTextField label="Долгота" name="longitude" value={form.longitude} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
          <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading || !allowedToSubmit}>{isEdit ? 'Сохранить' : 'Создать'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default BranchForm;
