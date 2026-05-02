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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

interface Integration {
  id?: string;
  companyId: string;
  name: string;
  type: string;
  provider?: string;
  apiKey?: string;
  apiSecret?: string;
  apiUrl?: string;
  webhookUrl?: string;
  isActive: boolean;
  isTest: boolean;
  icon?: string;
  settings?: any;
  syncStatus?: 'PENDING' | 'SYNCING' | 'SUCCESS' | 'ERROR';
  lastSyncAt?: string | null;
  errorMessage?: string | null;
}

const IntegrationSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState<Omit<Integration, 'id'>>({
    companyId: '86713767-0532-4a21-9f35-f57749fb5032',
    name: '',
    type: '',
    provider: '',
    apiKey: '',
    apiSecret: '',
    apiUrl: '',
    webhookUrl: '',
    isActive: true,
    isTest: false,
    icon: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const integrationTypes = [
    { value: 'PAYMENT', label: 'Платежная система' },
    { value: 'CRM', label: 'CRM-система' },
    { value: 'MARKETPLACE', label: 'Маркетплейс' },
    { value: 'SMS', label: 'СМС-сервис' },
    { value: 'EMAIL', label: 'Email-сервис' },
    { value: 'ANALYTICS', label: 'Аналитика' },
    { value: 'OTHER', label: 'Другое' },
  ];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings/integration`, {
        headers: withAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setIntegrations(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Ошибка загрузки интеграций');
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (integration: Integration | null = null) => {
    if (integration) {
      setFormData({
        ...integration,
        companyId: integration.companyId || '86713767-0532-4a21-9f35-f57749fb5032',
      });
      setEditingIntegration(integration);
    } else {
      setFormData({
        companyId: '86713767-0532-4a21-9f35-f57749fb5032',
        name: '',
        type: '',
        provider: '',
        apiKey: '',
        apiSecret: '',
        apiUrl: '',
        webhookUrl: '',
        isActive: true,
        isTest: false,
        icon: '',
      });
      setEditingIntegration(null);
    }
    setFormErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingIntegration(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.name.trim()) {
      errors.name = 'Название обязательно';
    }
    if (!formData.type.trim()) {
      errors.type = 'Тип интеграции обязателен';
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
      const isEdit = !!editingIntegration?.id;
      const url = isEdit 
        ? `${API_BASE_URL}/settings/integration/${editingIntegration?.id}`
        : `${API_BASE_URL}/settings/integration`;
      
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
        throw new Error(errorData.message || 'Ошибка сохранения интеграции');
      }

      setSuccess(isEdit ? 'Интеграция успешно обновлена' : 'Интеграция успешно создана');
      fetchIntegrations();
      handleCloseForm();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту интеграцию?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings/integration/${id}`, {
        method: 'DELETE',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления интеграции');
      }

      setSuccess('Интеграция успешно удалена');
      fetchIntegrations();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    try {
      setSyncing(prev => ({ ...prev, [id]: true }));
      const response = await fetch(`${API_BASE_URL}/settings/integration/${id}/sync`, {
        method: 'PUT',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Ошибка синхронизации');
      }

      setSuccess('Синхронизация запущена');
      fetchIntegrations();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setSyncing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Никогда';
    return new Date(dateString).toLocaleString();
  };

  if (loading && integrations.length === 0) {
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
          Интеграции
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Добавить
        </Button>
      </Box>

      {integrations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Интеграции не найдены
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Добавить интеграцию
          </Button>
        </Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Провайдер</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Синхронизация</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {integrations.map((integration) => (
                <TableRow key={integration.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {integration.icon && (
                        <Box component="img" src={integration.icon} sx={{ width: 24, height: 24 }} />
                      )}
                      <span>{integration.name}</span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {integrationTypes.find(t => t.value === integration.type)?.label || integration.type}
                  </TableCell>
                  <TableCell>{integration.provider || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={integration.isActive ? 'Активна' : 'Неактивна'}
                      color={integration.isActive ? 'success' : 'default'}
                      size="small"
                    />
                    {integration.isTest && (
                      <Chip
                        label="Тест"
                        color="warning"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Chip
                        label={integration.syncStatus || 'Не синхронизировано'}
                        color={
                          integration.syncStatus === 'SUCCESS'
                            ? 'success'
                            : integration.syncStatus === 'ERROR'
                              ? 'error'
                              : integration.syncStatus === 'SYNCING'
                                ? 'info'
                                : 'default'
                        }
                        size="small"
                      />
                      {integration.lastSyncAt && (
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(integration.lastSyncAt)}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Синхронизировать">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => integration.id && handleSync(integration.id)}
                          disabled={syncing[integration.id!]}
                        >
                          {syncing[integration.id!] ? (
                            <CircularProgress size={20} />
                          ) : (
                            <SyncIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenForm(integration)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => integration.id && handleDelete(integration.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
            {editingIntegration ? 'Редактировать интеграцию' : 'Добавить интеграцию'}
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
            <Grid container spacing={2} component="div">
              <Grid item={true} xs={12} sm={6} component="div">
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
              <Grid item={true} xs={12} sm={6} component="div">
                <FormControl fullWidth margin="normal" error={!!formErrors.type}>
                  <InputLabel>Тип интеграции *</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Тип интеграции *"
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as string }))}
                  >
                    {integrationTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.type && (
                    <FormHelperText>{formErrors.type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item={true} xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Провайдер"
                  name="provider"
                  value={formData.provider || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item={true} xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Иконка (URL)"
                  name="icon"
                  value={formData.icon || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item={true} xs={12} component="div">
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item={true} xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  margin="normal"
                  label="API ключ"
                  name="apiKey"
                  type="password"
                  value={formData.apiKey || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item={true} xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Секретный ключ"
                  name="apiSecret"
                  type="password"
                  value={formData.apiSecret || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item={true} xs={12} component="div">
                <TextField
                  fullWidth
                  margin="normal"
                  label="URL API"
                  name="apiUrl"
                  value={formData.apiUrl || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item={true} xs={12} component="div">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Webhook URL"
                  name="webhookUrl"
                  value={formData.webhookUrl || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item={true} xs={12} component="div">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Активная интеграция"
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

export default IntegrationSettings;




