'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Alert, Stack, Typography } from '@mui/material';
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/products`, {
        headers: withAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Не удалось загрузить список товаров');
      }
      const data = await res.json();
      setProducts(data ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: ProductListItem) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  return (
    <Layout title="Товары и меню" subtitle="Управляйте ассортиментом, ценами и остатками по филиалам">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Список товаров
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Добавить товар
          </Button>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && <ProductTable products={products} onEdit={handleEdit} onRefresh={fetchProducts} />}

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
