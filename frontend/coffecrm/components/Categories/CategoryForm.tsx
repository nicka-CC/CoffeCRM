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
  Box,
  Avatar,
} from '@mui/material';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/categories';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ open, onClose, onSuccess, category }) => {
  const isEdit = Boolean(category);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    icon: '',
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name ?? '',
        icon: category.icon ?? '',
      });
    } else {
      setForm({
        name: '',
        icon: '',
      });
    }
  }, [category, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      const payload: CreateCategoryDto | UpdateCategoryDto = {
        name: form.name,
        icon: form.icon || undefined,
      };

      const url = isEdit ? `${API_BASE_URL}/categories/${category?.id}` : `${API_BASE_URL}/categories`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Не удалось сохранить категорию');
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
      <DialogTitle>{isEdit ? 'Редактировать категорию' : 'Добавить категорию'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Название категории"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL иконки"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                fullWidth
                placeholder="https://..."
              />
            </Grid>
            {form.icon && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={form.icon} sx={{ width: 64, height: 64 }} />
                  <Typography variant="body2" color="text.secondary">
                    Предпросмотр иконки
                  </Typography>
                </Box>
              </Grid>
            )}
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

export default CategoryForm;


