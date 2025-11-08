'use client';

import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Chip,
  TableContainer,
  Paper,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import type { Employee } from '@/types/employees';
import { formatCurrency } from '@/utils/formatters';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onViewKPI: (employee: Employee) => void;
}

const roleColors: Record<string, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
  ADMIN: 'error',
  WRITE: 'primary',
  EDITE: 'warning',
  READ: 'default',
};

const roleLabels: Record<string, string> = {
  ADMIN: 'Администратор',
  WRITE: 'Запись',
  EDITE: 'Редактирование',
  READ: 'Просмотр',
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete, onViewKPI }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Сотрудник</TableCell>
            <TableCell>Должность</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Филиал</TableCell>
            <TableCell align="right">Зарплата</TableCell>
            <TableCell align="right">KPI</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                    {employee.user.fullName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {employee.user.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {employee.user.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>
                <Chip label={roleLabels[employee.user.role]} color={roleColors[employee.user.role]} size="small" />
              </TableCell>
              <TableCell>
                {employee.branch ? `${employee.branch.name} (${employee.branch.city})` : '—'}
              </TableCell>
              <TableCell align="right">{employee.salary ? formatCurrency(employee.salary) : '—'}</TableCell>
              <TableCell align="right">
                <Tooltip title="Просмотр KPI">
                  <IconButton size="small" onClick={() => onViewKPI(employee)}>
                    <AssessmentIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Редактировать">
                  <IconButton size="small" onClick={() => onEdit(employee)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                  <IconButton size="small" color="error" onClick={() => onDelete(employee.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;

