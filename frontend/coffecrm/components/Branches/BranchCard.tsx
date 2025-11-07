'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { Phone, Email, LocationOn, TrendingUp, Inventory2, People } from '@mui/icons-material';
import Link from 'next/link';
import type { BranchSummary } from '@/types/branches';
import { formatCurrency } from '@/utils/formatters';

interface BranchCardProps {
  branch: BranchSummary;
}

const BranchCard: React.FC<BranchCardProps> = ({ branch }) => {
  const { stats } = branch;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, border: '1px solid #e2e8f0' }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {branch.name}
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {branch.city}, {branch.address}
            </Typography>
          </Box>
          {branch.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {branch.phone}
              </Typography>
            </Box>
          )}
          {branch.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {branch.email}
              </Typography>
            </Box>
          )}
        </Stack>

        {stats && (
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Chip
              icon={<TrendingUp />}
              label={`Выручка: ${formatCurrency(stats.revenue)}`}
              sx={{ alignSelf: 'flex-start', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 600 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Количество заказов">
                <Chip icon={<TrendingUp />} label={`${stats.orders} заказов`} sx={{ backgroundColor: '#eef2ff', color: '#4338ca' }} />
              </Tooltip>
              <Tooltip title="Сотрудники">
                <Chip icon={<People />} label={`${stats.employees} сотрудников`} sx={{ backgroundColor: '#fdf2f8', color: '#be185d' }} />
              </Tooltip>
              <Tooltip title="Количество позиций на складе">
                <Chip icon={<Inventory2 />} label={`${stats.stockQuantity} ед.`} sx={{ backgroundColor: '#fef3c7', color: '#b45309' }} />
              </Tooltip>
            </Box>
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
        <Link href={`/branches/${branch.id}`} style={{ textDecoration: 'none' }}>
          <Chip label="Подробнее" color="primary" clickable sx={{ fontWeight: 600 }} />
        </Link>
        <IconButton component={Link} href={`/branches/${branch.id}`} color="primary">
          <TrendingUp />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default BranchCard;

