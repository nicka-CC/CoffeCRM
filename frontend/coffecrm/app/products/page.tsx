'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Alert, Stack, Typography, FormControl, InputLabel, Select, MenuItem, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from '@/components/Layout/Layout';
import ProductForm from '@/components/Products/ProductForm';
import ProductTable from '@/components/Products/ProductTable';
import type { ProductListItem } from '@/types/products';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'ingredients' | 'products'>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchProducts = async (p = page, limit = rowsPerPage, filter = filterMode) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('limit', String(limit));
      if (filter === 'ingredients') params.set('isIngredient', 'true');
      if (filter === 'products') params.set('isIngredient', 'false');

      const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
        headers: withAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Не удалось загрузить список товаров');
      }
      const data = await res.json();
      // Expecting { data: ProductListItem[], total, page, limit }
      setProducts(data.data ?? data ?? []);
      setTotal(data.total ?? 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, rowsPerPage, filterMode);
  }, []);

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: ProductListItem) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  // react to filter/page changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1, rowsPerPage, filterMode);
  }, [filterMode, rowsPerPage]);

  useEffect(() => {
    fetchProducts(page, rowsPerPage, filterMode);
  }, [page]);

  return (
    <Layout title="Товары и меню" subtitle="Управляйте ассортиментом, ценами и остатками по филиалам">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700}} color="textSecondary">
            Список товаров
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small">
              <InputLabel id="filter-label">Фильтр</InputLabel>
              <Select labelId="filter-label" label="Фильтр" value={filterMode} onChange={(e) => setFilterMode(e.target.value as any)}>
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="products">Только готовые</MenuItem>
                <MenuItem value="ingredients">Только ингредиенты</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
              Добавить товар
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
            <ProductTable products={products} onEdit={handleEdit} onRefresh={() => fetchProducts(page, rowsPerPage, filterMode)} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <TablePagination
                component="div"
                count={total}
                page={page - 1}
                onPageChange={(_, newPage) => setPage(newPage + 1)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(1); }}
                rowsPerPageOptions={[10, 20, 50, 100]}
              />
            </Box>
          </>
        )}

        <ProductForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={fetchProducts}
          product={selectedProduct}
        />
      </Box>
    </Layout>
  );
};

export default ProductsPage;
