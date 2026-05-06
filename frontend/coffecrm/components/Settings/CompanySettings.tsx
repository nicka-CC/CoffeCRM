'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FormTextField from '@/components/UI/FormField';
import { usePermissions } from '@/components/hooks/usePermissions';
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

  const { canCreateResource } = usePermissions();
  const allowedToSubmit = canCreateResource('settings');

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
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Основная информация */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
          Основная информация
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Название компании"
              name="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Юридическое название"
              name="legalName"
              value={form.legalName}
              onChange={(e) => setForm((prev) => ({ ...prev, legalName: e.target.value }))}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <FormTextField
            label="Описание"
            name="description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
          />
        </Box>
      </Paper>

      {/* Реквизиты */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
          Реквизиты
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="ИНН"
              name="inn"
              value={form.inn}
              onChange={(e) => setForm((prev) => ({ ...prev, inn: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="КПП"
              name="kpp"
              value={form.kpp}
              onChange={(e) => setForm((prev) => ({ ...prev, kpp: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="ОГРН"
              name="ogrn"
              value={form.ogrn}
              onChange={(e) => setForm((prev) => ({ ...prev, ogrn: e.target.value }))}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Юридический адрес"
              name="address"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Фактический адрес"
              name="actualAddress"
              value={form.actualAddress}
              onChange={(e) => setForm((prev) => ({ ...prev, actualAddress: e.target.value }))}
              fullWidth
            />
          </Box>
        </Box>
      </Paper>

      {/* Контакты */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
          Контакты
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Телефон"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Сайт"
              name="website"
              value={form.website}
              onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
              fullWidth
            />
          </Box>
        </Box>
      </Paper>

      {/* Банковские реквизиты и ответственные лица */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
          Банковские реквизиты
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Банк"
              name="bankName"
              value={form.bankName}
              onChange={(e) => setForm((prev) => ({ ...prev, bankName: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Расчетный счет"
              name="bankAccount"
              value={form.bankAccount}
              onChange={(e) => setForm((prev) => ({ ...prev, bankAccount: e.target.value }))}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="БИК"
              name="bankBik"
              value={form.bankBik}
              onChange={(e) => setForm((prev) => ({ ...prev, bankBik: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Система налогообложения"
              name="taxSystem"
              value={form.taxSystem}
              onChange={(e) => setForm((prev) => ({ ...prev, taxSystem: e.target.value }))}
              fullWidth
            />
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, mt: 4, color: '#1e293b' }}>
          Ответственные лица
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Директор"
              name="director"
              value={form.director}
              onChange={(e) => setForm((prev) => ({ ...prev, director: e.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormTextField
              label="Бухгалтер"
              name="accountant"
              value={form.accountant}
              onChange={(e) => setForm((prev) => ({ ...prev, accountant: e.target.value }))}
              fullWidth
            />
          </Box>
        </Box>
      </Paper>

      {/* Кнопка сохранения */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={saving || !allowedToSubmit}
          sx={{ 
            px: 4, 
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </Box>
    </Box>
  );
};

export default CompanySettings;





