'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

const PaymentSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings/payment`, {
        headers: withAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки настроек');
    } finally {
      setLoading(false);
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
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Настройки платежей
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Добавить
        </Button>
      </Box>

      {settings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Настройки платежей не найдены
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Провайдер</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Режим</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell>{setting.provider}</TableCell>
                  <TableCell>{setting.name || '—'}</TableCell>
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
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentSettings;



