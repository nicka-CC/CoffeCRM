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
  Avatar,
  Box,
  Chip,
  Collapse,
  TableContainer,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import type { ProductListItem } from '@/types/products';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface ProductTableProps {
  products: ProductListItem[];
  onEdit: (product: ProductListItem) => void;
  onRefresh: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onRefresh }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: withAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Не удалось удалить товар');
      }
      onRefresh();
    } catch (err) {
      console.error(err);
      alert((err as Error).message ?? 'Ошибка удаления');
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Фото</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell align="right">Цена</TableCell>
            <TableCell align="right">Себестоимость</TableCell>
            <TableCell align="right">Складов</TableCell>
            <TableCell align="right">Статус</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => {
            const imageUrl = product.imageUrl
              ? product.imageUrl.startsWith('http')
                ? product.imageUrl
                : `${API_BASE_URL}${product.imageUrl}`
              : undefined;
            const isExpanded = expandedRows[product.id] ?? false;
            const totalQuantity = product.stocks?.reduce((acc, stock) => acc + stock.quantity, 0) ?? 0;

            return (
              <React.Fragment key={product.id}>
                <TableRow hover>
                  <TableCell width={48}>
                    {product.stocks && product.stocks.length > 0 && (
                      <IconButton size="small" onClick={() => toggleRow(product.id)}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell width={80}>
                    {imageUrl ? (
                      <Avatar variant="rounded" src={imageUrl} sx={{ width: 48, height: 48 }} />
                    ) : (
                      <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: '#e0e7ff' }}>
                        {product.name.charAt(0)}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name ?? '—'}</TableCell>
                  <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                  <TableCell align="right">{formatCurrency(product.cost ?? null)}</TableCell>
                  <TableCell align="right">{formatNumber(product.stocks?.length ?? 0)}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={product.isActive ? 'Активен' : 'Скрыт'}
                      color={product.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => onEdit(product)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton color="error" onClick={() => handleDelete(product.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {product.stocks && product.stocks.length > 0 && (
                      <Tooltip title="Остатки по филиалам">
                        <IconButton color="primary" onClick={() => toggleRow(product.id)}>
                          <InventoryIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
                {product.stocks && product.stocks.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ p: 0, border: 0 }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3, py: 2, backgroundColor: '#f8fafc' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <InventoryIcon color="primary" />
                            <Chip label={`Всего на складах: ${formatNumber(totalQuantity)} ед.`} color="primary" />
                          </Box>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Филиал</TableCell>
                                <TableCell>Город</TableCell>
                                <TableCell align="right">Количество</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {product.stocks.map((stock) => (
                                <TableRow key={stock.id}>
                                  <TableCell>{stock.branch?.name ?? stock.branchId}</TableCell>
                                  <TableCell>{stock.branch?.city ?? '—'}</TableCell>
                                  <TableCell align="right">{formatNumber(stock.quantity)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
