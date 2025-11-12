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
  Grid,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '@/components/Layout/Layout';
import EmployeeTable from '@/components/Employees/EmployeeTable';
import EmployeeForm from '@/components/Employees/EmployeeForm';
import EmployeeKPIDialog from '@/components/Employees/EmployeeKPIDialog';
import type { Employee } from '@/types/employees';
import { API_BASE_URL, buildUrl, withAuthHeaders } from '@/utils/api';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [kpiDialogOpen, setKpiDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filters, setFilters] = useState({
    branchId: '',
    search: '',
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (filters.branchId) params.branchId = filters.branchId;
      if (filters.search) params.search = filters.search;

      const url = buildUrl('/employees', params);
      const response = await fetch(url, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить список сотрудников');
      }

      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : data?.data ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки сотрудников');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Удалить сотрудника?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить сотрудника');
      }

      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка удаления');
    }
  };

  const handleViewKPI = (employee: Employee) => {
    setSelectedEmployee(employee);
    setKpiDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedEmployee(null);
  };

  const handleFormSuccess = () => {
    fetchEmployees();
  };

  const handleKpiDialogClose = () => {
    setKpiDialogOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <Layout title="Сотрудники" subtitle="Управляйте сотрудниками, ролями и отслеживайте KPI">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Список сотрудников
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchEmployees}>
              Обновить
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmployee}>
              Добавить сотрудника
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Поиск"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Имя, должность..."
              size="small"
              sx={{ flex: 1 }}
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
            {employees.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Сотрудники не найдены
                </Typography>
              </Paper>
            ) : (
              <EmployeeTable
                employees={employees}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                onViewKPI={handleViewKPI}
              />
            )}
          </>
        )}

        <EmployeeForm
          open={formOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          employee={selectedEmployee}
        />
        <EmployeeKPIDialog
          open={kpiDialogOpen}
          onClose={handleKpiDialogClose}
          employee={selectedEmployee}
        />
      </Box>
    </Layout>
  );
};

export default EmployeesPage;


