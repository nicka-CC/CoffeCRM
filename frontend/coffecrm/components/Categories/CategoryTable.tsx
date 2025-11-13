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
  TableContainer,
  Paper,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Category } from '@/types/categories';
import { usePermissions } from '@/components/hooks/usePermissions';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  const { canDeleteResource } = usePermissions();
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Иконка</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Дата создания</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} hover>
              <TableCell>
                {category.icon ? (
                  <Avatar src={category.icon} sx={{ width: 40, height: 40 }} />
                ) : (
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                    {category.name.charAt(0)}
                  </Avatar>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {category.name}
                </Typography>
              </TableCell>
              <TableCell>
                {category.createdAt ? new Date(category.createdAt).toLocaleDateString('ru-RU') : '—'}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Редактировать">
                  <IconButton size="small" onClick={() => onEdit(category)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                  <span>
                    <IconButton size="small" color="error" onClick={() => onDelete(category.id)} disabled={!canDeleteResource('category')}>
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;


