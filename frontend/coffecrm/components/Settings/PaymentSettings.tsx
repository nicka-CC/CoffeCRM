'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Snackbar,
  Divider,
  Grid,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { usePermissions } from '@/components/hooks/usePermissions';
interface PaymentSetting {
  id?: string;
  companyId: string;
  provider: string;
  name: string;
  apiKey: string;
  secretKey: string;
  merchantId?: string;
  terminalId?: string;
  isActive: boolean;
  isTest: boolean;
  commission?: number;
  minAmount?: number;
  maxAmount?: number;
  webhookUrl?: string;
  icon?: string;
  settings?: any;
}

const PaymentSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<PaymentSetting[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState<PaymentSetting | null>(null);
  const [formData, setFormData] = useState<PaymentSetting>({
    companyId: '86713767-0532-4a21-9f35-f57749fb5032', // TODO: Get from auth context
    provider: '',
    name: '',
    apiKey: '',
    secretKey: '',
    merchantId: '',
    terminalId: '',
    isActive: true,
    isTest: false,
    commission: 0,
    minAmount: 0,
    maxAmount: 100000,
    webhookUrl: '',
    icon: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
    const { canCreateResource } = usePermissions();
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings/payment`, {
        headers: withAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Ошибка загрузки настроек');
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (setting: PaymentSetting | null = null) => {
    if (setting) {
      setFormData({
        ...setting,
        companyId: setting.companyId || '86713767-0532-4a21-9f35-f57749fb5032', // Ensure companyId is set
      });
      setEditingSetting(setting);
    } else {
      setFormData({
        companyId: '86713767-0532-4a21-9f35-f57749fb5032',
        provider: '',
        name: '',
        apiKey: '',
        secretKey: '',
        merchantId: '',
        terminalId: '',
        isActive: true,
        isTest: false,
        commission: 0,
        minAmount: 0,
        maxAmount: 100000,
        webhookUrl: '',
        icon: '',
      });
      setEditingSetting(null);
    }
    setFormErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingSetting(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : '') : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.provider.trim()) {
      errors.provider = 'Провайдер обязателен';
    }
    if (!formData.name.trim()) {
      errors.name = 'Название обязательно';
    }
    if (!formData.apiKey.trim()) {
      errors.apiKey = 'API ключ обязателен';
    }
    if (!formData.secretKey.trim()) {
      errors.secretKey = 'Секретный ключ обязателен';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const isEdit = !!editingSetting?.id;
      const url = isEdit 
        ? `${API_BASE_URL}/settings/payment/${editingSetting?.id}`
        : `${API_BASE_URL}/settings/payment`;
      
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...withAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка сохранения настроек');
      }

      setSuccess(isEdit ? 'Настройки успешно обновлены' : 'Настройки успешно созданы');
      fetchSettings();
      handleCloseForm();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эти настройки?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings/payment/${id}`, {
        method: 'DELETE',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления настроек');
      }

      setSuccess('Настройки успешно удалены');
      fetchSettings();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading && settings.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Настройки платежей
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Добавить
        </Button>
      </Box>

      {settings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Настройки платежей не найдены
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Добавить настройки
          </Button>
        </Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Провайдер</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>API ключ</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Режим</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.map((setting) => (
                <TableRow key={setting.id} hover>
                  <TableCell>{setting.provider}</TableCell>
                  <TableCell>{setting.name || '—'}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {setting.apiKey || '—'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={setting.isActive ? 'Активна' : 'Неактивна'}
                      color={setting.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={setting.isTest ? 'Тест' : 'Продакшн'}
                      color={setting.isTest ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenForm(setting)}
                      title="Редактировать"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => setting.id && handleDelete(setting.id)}
                      title="Удалить"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingSetting ? 'Редактировать настройки' : 'Добавить настройки'}
            <IconButton
              aria-label="close"
              onClick={handleCloseForm}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Провайдер *"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  error={!!formErrors.provider}
                  helperText={formErrors.provider}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Название *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="API ключ *"
                  name="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={handleInputChange}
                  error={!!formErrors.apiKey}
                  helperText={formErrors.apiKey}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Секретный ключ *"
                  name="secretKey"
                  type="password"
                  value={formData.secretKey}
                  onChange={handleInputChange}
                  error={!!formErrors.secretKey}
                  helperText={formErrors.secretKey}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="ID мерчанта"
                  name="merchantId"
                  value={formData.merchantId || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="ID терминала"
                  name="terminalId"
                  value={formData.terminalId || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Комиссия (%)"
                  name="commission"
                  type="number"
                  value={formData.commission || ''}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Минимальная сумма"
                  name="minAmount"
                  type="number"
                  value={formData.minAmount || ''}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Максимальная сумма"
                  name="maxAmount"
                  type="number"
                  value={formData.maxAmount || ''}
                  onChange={handleInputChange}
                  inputProps={{ min: formData.minAmount || 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Webhook URL"
                  name="webhookUrl"
                  value={formData.webhookUrl || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Иконка (URL)"
                  name="icon"
                  value={formData.icon || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Активный провайдер"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isTest}
                      onChange={handleCheckboxChange}
                      name="isTest"
                      color="primary"
                    />
                  }
                  label="Тестовый режим"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseForm} color="inherit">
              Отмена
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Сохранить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PaymentSettings;

