'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Grid,
} from '@mui/material';
import type { StockOverviewItem } from '@/types/inventory';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

interface InventoryTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  stock?: StockOverviewItem | null;
  onSuccess: () => void;
}

const TRANSACTION_TYPES = [
  { value: 'INCOME', label: 'Приход' },
  { value: 'EXPENSE', label: 'Расход' },
  { value: 'WRITE_OFF', label: 'Списание' },
];

const InventoryTransactionDialog: React.FC<InventoryTransactionDialogProps> = ({ open, onClose, stock, onSuccess }) => {
  const [type, setType] = useState<string>('INCOME');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [document, setDocument] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setType('INCOME');
      setQuantity('');
      setPrice('');
      setReason('');
      setDocument('');
      setSupplier('');
      setBatchNumber('');
      setExpiryDate('');
      setNotes('');
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stock) return;
    try {
      setLoading(true);
      const payload: any = {
        type,
        quantity: Number(quantity),
      };

      if (price) {
        payload.price = Number(price);
      }

      if (reason) {
        payload.reason = reason;
      }

      if (document) {
        payload.document = document;
      }

      if (supplier) {
        payload.supplier = supplier;
      }

      if (batchNumber) {
        payload.batchNumber = batchNumber;
      }

      if (expiryDate) {
        payload.expiryDate = new Date(expiryDate).toISOString();
      }

      if (notes) {
        payload.notes = notes;
      }

      const res = await fetch(`${API_BASE_URL}/stocks/${stock.id}/transactions`, {
        method: 'POST',
        headers: {
          ...withAuthHeaders({ 'Content-Type': 'application/json' }),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Не удалось зарегистрировать операцию');
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка операции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Регистрация движения товара</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {stock && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Информация о товаре и филиале
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Филиал: {stock.branch.name} ({stock.branch.city})
                  </Typography>
                  {stock.branch.managerName && (
                    <Typography variant="body2" color="text.secondary">
                      Менеджер: {stock.branch.managerName}
                      {stock.branch.managerPhone && ` (${stock.branch.managerPhone})`}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Товар: {stock.product.name}
                  </Typography>
                  {stock.product.sku && (
                    <Typography variant="body2" color="text.secondary">
                      Артикул: {stock.product.sku}
                    </Typography>
                  )}
                  {stock.product.barcode && (
                    <Typography variant="body2" color="text.secondary">
                      Штрихкод: {stock.product.barcode}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary">
                Текущее количество: {stock.quantity} {stock.product.unit ?? 'шт.'}
                {stock.reserved && stock.reserved > 0 && ` (зарезервировано: ${stock.reserved})`}
              </Typography>
              {stock.minQuantity !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  Минимальный остаток: {stock.minQuantity} {stock.product.unit ?? 'шт.'}
                </Typography>
              )}
            </Stack>
          )}
          <Stack spacing={2}>
            <TextField
              select
              label="Тип операции"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              required
            >
              {TRANSACTION_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Количество"
              type="number"
              inputProps={{ min: 1 }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              fullWidth
            />
            {(type === 'INCOME' || type === 'EXPENSE') && (
              <>
                <TextField
                  label="Цена за единицу"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Поставщик"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {type === 'INCOME' && (
              <>
                <TextField
                  label="Номер партии"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Срок годности"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </>
            )}
            {(type === 'EXPENSE' || type === 'WRITE_OFF') && (
              <TextField
                label="Причина операции"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
              />
            )}
            <TextField
              label="Номер документа (накладная, счет и т.д.)"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              fullWidth
            />
            <TextField
              label="Примечания"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading || !quantity}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InventoryTransactionDialog;
