'use client';

import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Alert, CircularProgress, Stack, Button } from '@mui/material';
import BranchForm from '@/components/Branches/BranchForm';
import Layout from '@/components/Layout/Layout';
import BranchCard from '@/components/Branches/BranchCard';
import dynamic from 'next/dynamic';
import type { BranchSummary } from '@/types/branches';
import { API_BASE_URL, withAuthHeaders } from '@/utils/api';
import {usePermissions} from "@/components/hooks/usePermissions";

const BranchesMap = dynamic(() => import('@/components/Branches/BranchesMap'), { ssr: false });

const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const perms = usePermissions();

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

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/branches?withStats=true`, {
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      });
      if (!response.ok) throw new Error('Не удалось загрузить данные филиалов');
      const data = await response.json();
      const normalized = Array.isArray(data) ? data : (data?.data ?? []);
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Список филиалов
                </Typography>
                {perms.canEditResource('branch') && (
                  <Button variant="contained" onClick={() => setFormOpen(true)}>
                    Создать филиал
                  </Button>
                )}
              </Box>
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
      <BranchForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          setFormOpen(false);
          refetch();
        }}
      />
    </Layout>
  );
};

export default BranchesPage;

