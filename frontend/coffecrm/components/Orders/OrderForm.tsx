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
  Typography,
  IconButton,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Order, CreateOrderDto, UpdateOrderDto, OrderStatus } from '@/types/orders';
import type { BranchSummary } from '@/types/branches';
import type { ProductListItem } from '@/types/products';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { formatCurrency } from '@/utils/formatters';
import { usePermissions } from '@/components/hooks/usePermissions';

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order?: Order | null;
}

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: 'NEW', label: 'Новый' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'READY', label: 'Готов' },
  { value: 'COMPLETED', label: 'Выполнен' },
  { value: 'CANCELED', label: 'Отменен' },
];

const OrderForm: React.FC<OrderFormProps> = ({ open, onClose, onSuccess, order }) => {
  const isEdit = Boolean(order);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    branchId: '',
    customerId: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE' | 'WRITE_OFF',
    status: 'NEW' as OrderStatus,
    items: [] as Array<{ productId: string; quantity: number; price: number; productName?: string }>,
  });
  const { canEditResource, canCreateResource, canDeleteResource } = usePermissions();
  const editable = canEditResource('order', order?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/branches`, { headers: withAuthHeaders() }),
          fetch(`${API_BASE_URL}/products`, { headers: withAuthHeaders() }),
        ]);

        if (branchesRes.ok) {
          const branchesData = await branchesRes.json();
          setBranches(Array.isArray(branchesData) ? branchesData : branchesData?.data ?? []);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const productsList = Array.isArray(productsData) ? productsData : productsData?.data ?? [];
          setProducts(productsList);
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
    if (order) {
      setForm({
        branchId: order.branchId,
        customerId: order.customerId ?? '',
        type: (order as any).type ?? 'EXPENSE',
        status: order.status,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.product?.name,
        })),
      });
    } else {
      setForm({
        branchId: '',
        customerId: '',
        type: 'EXPENSE',
        status: 'NEW',
        items: [],
      });
    }
  }, [order, open]);

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, price: 0 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setForm((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        if (product) {
          newItems[index].price = product.price;
          newItems[index].productName = product.name;
        }
      }

      return { ...prev, items: newItems };
    });
  };

  const calculateTotal = () => {
    return form.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      const payload = isEdit
        ? ({
            type: form.type,
            status: form.status,
            total: calculateTotal(),
            items: form.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          } as UpdateOrderDto)
        : ({
            branchId: form.branchId,
            customerId: form.customerId || undefined,
            type: form.type,
            status: form.status,
            total: calculateTotal(),
            items: form.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          } as CreateOrderDto);

      const url = isEdit ? `${API_BASE_URL}/orders/${order?.id}` : `${API_BASE_URL}/orders`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Не удалось сохранить заказ');
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать заказ' : 'Создать заказ'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                label="Филиал"
                name="branchId"
                value={form.branchId}
                onChange={(e) => setForm((prev) => ({ ...prev, branchId: e.target.value }))}
                fullWidth
                disabled={!editable}
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name} ({branch.city})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="ID клиента (необязательно)"
                name="customerId"
                value={form.customerId}
                onChange={(e) => setForm((prev) => ({ ...prev, customerId: e.target.value }))}
                fullWidth
                disabled={!editable}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Тип (приход/расход)"
                name="type"
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as any }))}
                fullWidth
              >
                <MenuItem value="EXPENSE">Расход (продажа)</MenuItem>
                <MenuItem value="INCOME">Приход (возврат/поступление)</MenuItem>
                <MenuItem value="WRITE_OFF">Списание</MenuItem>
              </TextField>
            </Grid>

            {isEdit && (
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Статус"
                  name="status"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as OrderStatus }))}
                  fullWidth
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Товары в заказе
                </Typography>
                <Button startIcon={<AddIcon />} onClick={handleAddItem} size="small">
                  Добавить товар
                </Button>
              </Box>

              {form.items.length === 0 ? (
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <Typography variant="body2" color="text.secondary">
                    Добавьте товары в заказ
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {form.items.map((item, index) => (
                    <Paper key={index} sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                          <TextField
                            select
                            required
                            label="Товар"
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            fullWidth
                            size="small"
                            disabled={!editable}
                          >
                            {products
                              .filter((p) => p.isActive)
                              .map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                  {product.name} - {formatCurrency(product.price)}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={4} md={2}>
                          <TextField
                            required
                            label="Количество"
                            type="number"
                            inputProps={{ min: 1 }}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                            fullWidth
                            size="small"
                            disabled={!editable}
                          />
                        </Grid>
                        <Grid item xs={4} md={2}>
                          <TextField
                            required
                            label="Цена"
                            type="number"
                            inputProps={{ min: 0, step: 0.01 }}
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                            fullWidth
                            size="small"
                            disabled={!editable}
                          />
                        </Grid>
                        <Grid item xs={3} md={2}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} md={1}>
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)} disabled={!canDeleteResource('order')}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Итого:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(calculateTotal())}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading || form.items.length === 0}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default OrderForm;

