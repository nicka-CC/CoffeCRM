'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import type { ProductListItem } from '@/types/products';

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: ProductListItem | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSuccess, product }) => {
  const isEdit = Boolean(product);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    nameEn: '',
    categoryId: '',
    price: '',
    cost: '',
    oldPrice: '',
    sku: '',
    barcode: '',
    unit: 'шт',
    weight: '',
    volume: '',
    calories: '',
    proteins: '',
    fats: '',
    carbs: '',
    description: '',
    composition: '',
    allergens: '',
    shelfLife: '',
    storageTemp: '',
    isActive: true,
    isPopular: false,
    isNew: false,
    sortOrder: '0',
    tags: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/category`, {
          headers: withAuthHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data?.data ?? data ?? []);
      } catch (err) {
        console.error('Не удалось загрузить категории', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? '',
        nameEn: product.nameEn ?? '',
        categoryId: product.categoryId,
        price: product.price?.toString() ?? '',
        cost: product.cost?.toString() ?? '',
        oldPrice: product.oldPrice?.toString() ?? '',
        sku: product.sku ?? '',
        barcode: product.barcode ?? '',
        unit: product.unit ?? 'шт',
        weight: product.weight?.toString() ?? '',
        volume: product.volume?.toString() ?? '',
        calories: product.calories?.toString() ?? '',
        proteins: product.proteins?.toString() ?? '',
        fats: product.fats?.toString() ?? '',
        carbs: product.carbs?.toString() ?? '',
        description: product.description ?? '',
        composition: product.composition ?? '',
        allergens: product.allergens ?? '',
        shelfLife: product.shelfLife?.toString() ?? '',
        storageTemp: product.storageTemp ?? '',
        isActive: product.isActive ?? true,
        isPopular: product.isPopular ?? false,
        isNew: product.isNew ?? false,
        sortOrder: product.sortOrder?.toString() ?? '0',
        tags: product.tags?.join(', ') ?? '',
      });
      setPreview(product.imageUrl ? `${product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL}${product.imageUrl}`}` : null);
    } else {
      setForm({
        name: '',
        nameEn: '',
        categoryId: '',
        price: '',
        cost: '',
        oldPrice: '',
        sku: '',
        barcode: '',
        unit: 'шт',
        weight: '',
        volume: '',
        calories: '',
        proteins: '',
        fats: '',
        carbs: '',
        description: '',
        composition: '',
        allergens: '',
        shelfLife: '',
        storageTemp: '',
        isActive: true,
        isPopular: false,
        isNew: false,
        sortOrder: '0',
        tags: '',
      });
      setFile(null);
      setPreview(null);
    }
  }, [product, open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile ?? null);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', form.name);
      if (form.nameEn) formData.append('nameEn', form.nameEn);
      formData.append('categoryId', form.categoryId);
      formData.append('price', form.price);
      if (form.cost) formData.append('cost', form.cost);
      if (form.oldPrice) formData.append('oldPrice', form.oldPrice);
      if (form.sku) formData.append('sku', form.sku);
      if (form.barcode) formData.append('barcode', form.barcode);
      formData.append('unit', form.unit);
      if (form.weight) formData.append('weight', form.weight);
      if (form.volume) formData.append('volume', form.volume);
      if (form.calories) formData.append('calories', form.calories);
      if (form.proteins) formData.append('proteins', form.proteins);
      if (form.fats) formData.append('fats', form.fats);
      if (form.carbs) formData.append('carbs', form.carbs);
      if (form.description) formData.append('description', form.description);
      if (form.composition) formData.append('composition', form.composition);
      if (form.allergens) formData.append('allergens', form.allergens);
      if (form.shelfLife) formData.append('shelfLife', form.shelfLife);
      if (form.storageTemp) formData.append('storageTemp', form.storageTemp);
      formData.append('isActive', String(form.isActive));
      formData.append('isPopular', String(form.isPopular));
      formData.append('isNew', String(form.isNew));
      formData.append('sortOrder', form.sortOrder);
      if (form.tags) {
        const tagsArray = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
        tagsArray.forEach((tag) => {
          formData.append('tags[]', tag);
        });
      }
      if (file) {
        formData.append('image', file);
      }

      const headers = withAuthHeaders();
      const url = isEdit ? `${API_BASE_URL}/products/${product?.id}` : `${API_BASE_URL}/products`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Не удалось сохранить продукт');
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

  const previewUrl = useMemo(() => {
    if (preview) return preview;
    if (product?.imageUrl) {
      return product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL}${product.imageUrl}`;
    }
    return null;
  }, [preview, product]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
        <DialogContent dividers sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Основная информация
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField required label="Название" name="name" value={form.name} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Название на английском" name="nameEn" value={form.nameEn} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    required
                    label="Категория"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    fullWidth
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button variant="outlined" component="label">
                      Загрузить изображение
                      <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                    </Button>
                    {previewUrl && <Avatar variant="rounded" src={previewUrl} sx={{ width: 64, height: 64 }} />}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Описание" name="description" value={form.description} onChange={handleChange} multiline minRows={3} fullWidth />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Цены и идентификация
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField required label="Цена" name="price" type="number" inputProps={{ min: 0, step: 0.01 }} value={form.price} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="Себестоимость" name="cost" type="number" inputProps={{ min: 0, step: 0.01 }} value={form.cost} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="Старая цена" name="oldPrice" type="number" inputProps={{ min: 0, step: 0.01 }} value={form.oldPrice} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Артикул (SKU)" name="sku" value={form.sku} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Штрихкод" name="barcode" value={form.barcode} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField select label="Единица измерения" name="unit" value={form.unit} onChange={handleChange} fullWidth>
                    <MenuItem value="шт">шт</MenuItem>
                    <MenuItem value="кг">кг</MenuItem>
                    <MenuItem value="г">г</MenuItem>
                    <MenuItem value="л">л</MenuItem>
                    <MenuItem value="мл">мл</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Порядок сортировки" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} fullWidth />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Физические характеристики
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField label="Вес (г)" name="weight" type="number" inputProps={{ min: 0 }} value={form.weight} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Объем (мл)" name="volume" type="number" inputProps={{ min: 0 }} value={form.volume} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Калории" name="calories" type="number" inputProps={{ min: 0 }} value={form.calories} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Белки (г)" name="proteins" type="number" inputProps={{ min: 0, step: 0.1 }} value={form.proteins} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Жиры (г)" name="fats" type="number" inputProps={{ min: 0, step: 0.1 }} value={form.fats} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Углеводы (г)" name="carbs" type="number" inputProps={{ min: 0, step: 0.1 }} value={form.carbs} onChange={handleChange} fullWidth />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Дополнительная информация
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Состав" name="composition" value={form.composition} onChange={handleChange} multiline minRows={2} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Аллергены" name="allergens" value={form.allergens} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Срок годности (дни)" name="shelfLife" type="number" inputProps={{ min: 0 }} value={form.shelfLife} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Температура хранения" name="storageTemp" value={form.storageTemp} onChange={handleChange} placeholder="например: +2...+8°C" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Теги (через запятую)" name="tags" value={form.tags} onChange={handleChange} fullWidth placeholder="кофе, горячий, популярный" />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Настройки отображения
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={form.isActive} onChange={handleChange} name="isActive" />} label="Активен" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={form.isPopular} onChange={handleChange} name="isPopular" />} label="Популярный" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={form.isNew} onChange={handleChange} name="isNew" />} label="Новый товар" />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
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

export default ProductForm;
