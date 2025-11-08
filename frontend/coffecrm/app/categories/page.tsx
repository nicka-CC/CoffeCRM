'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Stack,
  Grid,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '@/components/Layout/Layout';
import CategoryTable from '@/components/Categories/CategoryTable';
import CategoryForm from '@/components/Categories/CategoryForm';
import type { Category } from '@/types/categories';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить список категорий');
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : data?.data ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Удалить категорию?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить категорию');
      }

      fetchCategories();
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка удаления');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSuccess = () => {
    fetchCategories();
  };

  return (
    <Layout title="Категории товаров" subtitle="Управляйте категориями товаров">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Список категорий
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCategories}>
              Обновить
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCategory}>
              Добавить категорию
            </Button>
          </Stack>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Категории не найдены
                </Typography>
              </Paper>
            ) : (
              <CategoryTable
                categories={categories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            )}
          </>
        )}

        <CategoryForm
          open={formOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          category={selectedCategory}
        />
      </Box>
    </Layout>
  );
};

export default CategoriesPage;

