'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

const CompanySettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    legalName: '',
    inn: '',
    kpp: '',
    ogrn: '',
    address: '',
    actualAddress: '',
    phone: '',
    email: '',
    website: '',
    director: '',
    accountant: '',
    bankName: '',
    bankAccount: '',
    bankBik: '',
    taxSystem: '',
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings/company`, {
        headers: withAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const company = data[0];
          setForm({
            name: company.name || '',
            description: company.description || '',
            legalName: company.legalName || '',
            inn: company.inn || '',
            kpp: company.kpp || '',
            ogrn: company.ogrn || '',
            address: company.address || '',
            actualAddress: company.actualAddress || '',
            phone: company.phone || '',
            email: company.email || '',
            website: company.website || '',
            director: company.director || '',
            accountant: company.accountant || '',
            bankName: company.bankName || '',
            bankAccount: company.bankAccount || '',
            bankBik: company.bankBik || '',
            taxSystem: company.taxSystem || '',
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/settings/company`, {
        method: 'POST',
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Не удалось сохранить настройки');
      }

      alert('Настройки успешно сохранены');
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Основная информация
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Название компании"
            name="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Юридическое название"
            name="legalName"
            value={form.legalName}
            onChange={(e) => setForm((prev) => ({ ...prev, legalName: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Описание"
            name="description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            multiline
            minRows={2}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 2 }}>
            Реквизиты
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="ИНН"
            name="inn"
            value={form.inn}
            onChange={(e) => setForm((prev) => ({ ...prev, inn: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="КПП"
            name="kpp"
            value={form.kpp}
            onChange={(e) => setForm((prev) => ({ ...prev, kpp: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="ОГРН"
            name="ogrn"
            value={form.ogrn}
            onChange={(e) => setForm((prev) => ({ ...prev, ogrn: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Юридический адрес"
            name="address"
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Фактический адрес"
            name="actualAddress"
            value={form.actualAddress}
            onChange={(e) => setForm((prev) => ({ ...prev, actualAddress: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 2 }}>
            Контакты
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Телефон"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Сайт"
            name="website"
            value={form.website}
            onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 2 }}>
            Банковские реквизиты
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Банк"
            name="bankName"
            value={form.bankName}
            onChange={(e) => setForm((prev) => ({ ...prev, bankName: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Расчетный счет"
            name="bankAccount"
            value={form.bankAccount}
            onChange={(e) => setForm((prev) => ({ ...prev, bankAccount: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="БИК"
            name="bankBik"
            value={form.bankBik}
            onChange={(e) => setForm((prev) => ({ ...prev, bankBik: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Система налогообложения"
            name="taxSystem"
            value={form.taxSystem}
            onChange={(e) => setForm((prev) => ({ ...prev, taxSystem: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Директор"
            name="director"
            value={form.director}
            onChange={(e) => setForm((prev) => ({ ...prev, director: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Бухгалтер"
            name="accountant"
            value={form.accountant}
            onChange={(e) => setForm((prev) => ({ ...prev, accountant: e.target.value }))}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanySettings;

