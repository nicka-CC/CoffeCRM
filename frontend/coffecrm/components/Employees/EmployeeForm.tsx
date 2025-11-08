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
} from '@mui/material';
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/employees';
import type { BranchSummary } from '@/types/branches';
import type { User } from '@/types/employees';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSuccess, employee }) => {
  const isEdit = Boolean(employee);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    position: '',
    salary: '',
    branchId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/branches`, { headers: withAuthHeaders() }),
          fetch(`${API_BASE_URL}/user/all`, { headers: withAuthHeaders() }),
        ]);

        if (branchesRes.ok) {
          const branchesData = await branchesRes.json();
          setBranches(Array.isArray(branchesData) ? branchesData : branchesData?.data ?? []);
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          // Обрабатываем разные форматы ответа
          if (Array.isArray(usersData)) {
            setUsers(usersData);
          } else if (usersData?.users && Array.isArray(usersData.users)) {
            setUsers(usersData.users);
          } else if (usersData?.data && Array.isArray(usersData.data)) {
            setUsers(usersData.data);
          } else {
            setUsers([]);
          }
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
    if (employee) {
      setForm({
        userId: employee.userId,
        position: employee.position,
        salary: employee.salary?.toString() ?? '',
        branchId: employee.branchId ?? '',
      });
    } else {
      setForm({
        userId: '',
        position: '',
        salary: '',
        branchId: '',
      });
    }
  }, [employee, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      const payload: CreateEmployeeDto | UpdateEmployeeDto = {
        userId: form.userId,
        position: form.position,
        salary: form.salary ? Number(form.salary) : undefined,
        branchId: form.branchId || undefined,
      };

      const url = isEdit ? `${API_BASE_URL}/employees/${employee?.id}` : `${API_BASE_URL}/employees`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Не удалось сохранить сотрудника');
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                required
                label="Пользователь"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                fullWidth
                disabled={isEdit}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName} ({user.email}) - {user.role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Должность"
                name="position"
                value={form.position}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Зарплата"
                name="salary"
                type="number"
                inputProps={{ min: 0 }}
                value={form.salary}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Филиал"
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Не назначен</MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name} ({branch.city})
                  </MenuItem>
                ))}
              </TextField>
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

export default EmployeeForm;

