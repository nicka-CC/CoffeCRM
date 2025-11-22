'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
import SyncIcon from '@mui/icons-material/Sync';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

const IntegrationSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);

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
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки интеграций');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/integration/${id}/sync`, {
        method: 'PUT',
        headers: withAuthHeaders(),
      });

      if (response.ok) {
        fetchIntegrations();
        alert('Синхронизация запущена');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка синхронизации');
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
          Интеграции
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Добавить
        </Button>
      </Box>

      {integrations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Интеграции не найдены
          </Typography>
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
                <TableRow key={integration.id}>
                  <TableCell>{integration.name}</TableCell>
                  <TableCell>{integration.type}</TableCell>
                  <TableCell>{integration.provider || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={integration.isActive ? 'Активна' : 'Неактивна'}
                      color={integration.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {integration.syncStatus && (
                      <Chip
                        label={integration.syncStatus}
                        color={
                          integration.syncStatus === 'SUCCESS'
                            ? 'success'
                            : integration.syncStatus === 'ERROR'
                            ? 'error'
                            : 'default'
                        }
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleSync(integration.id)}>
                      <SyncIcon />
                    </IconButton>
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

export default IntegrationSettings;




