'use client';

import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Alert, CircularProgress, Stack } from '@mui/material';
import Layout from '@/components/Layout/Layout';
import BranchCard from '@/components/Branches/BranchCard';
import dynamic from 'next/dynamic';
import type { BranchSummary } from '@/types/branches';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';

const BranchesMap = dynamic(() => import('@/components/Branches/BranchesMap'), { ssr: false });

const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/branches?withStats=true`, {
          headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные филиалов');
        }

        const data = await response.json();
        const normalized = Array.isArray(data)
          ? data
          : (data?.data ?? []);

        setBranches(
          normalized.map((branch: any) => ({
            ...branch,
            phone: branch.phone ?? null,
            email: branch.email ?? null,
            latitude: branch.latitude ?? null,
            longitude: branch.longitude ?? null,
            stats: branch.stats ?? null,
          })),
        );
        setError(null);
      } catch (err) {
        console.error(err);
        setError((err as Error).message ?? 'Ошибка загрузки филиалов');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <Layout title="Филиалы" subtitle="Управляйте сетью кофеен, анализируйте показатели и следите за запасами">
      <Box sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Карта сети
              </Typography>
              <BranchesMap branches={branches} />
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Список филиалов
              </Typography>
              <Grid container spacing={3}>
                {branches.map((branch) => (
                  <Grid item xs={12} md={6} lg={4} key={branch.id}>
                    <BranchCard branch={branch} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        )}
      </Box>
    </Layout>
  );
};

export default BranchesPage;

