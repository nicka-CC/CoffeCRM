'use client';

import React, { useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import type { BranchSummary } from '@/types/branches';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

interface BranchesMapProps {
  branches: BranchSummary[];
}

const DEFAULT_POSITION: [number, number] = [55.751244, 37.618423];

const BranchesMap: React.FC<BranchesMapProps> = ({ branches }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
      });
    }
  }, []);

  const positions = useMemo(
    () =>
      branches
        .filter((branch) => typeof branch.latitude === 'number' && typeof branch.longitude === 'number')
        .map((branch) => ({
          id: branch.id,
          name: branch.name,
          latitude: branch.latitude as number,
          longitude: branch.longitude as number,
          address: branch.address,
          city: branch.city,
        })),
    [branches],
  );

  if (!isClient) {
    return (
      <Box sx={{ p: 3, borderRadius: 2, backgroundColor: 'white', border: '1px solid #e2e8f0', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Загрузка карты...
        </Typography>
      </Box>
    );
  }

  if (positions.length === 0) {
    return (
      <Box sx={{ p: 3, borderRadius: 2, backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Карта филиалов
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Для отображения карты заполните координаты (широта/долгота) у филиалов.
        </Typography>
      </Box>
    );
  }

  const center = positions.length > 0 ? [positions[0].latitude, positions[0].longitude] : DEFAULT_POSITION;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 400, borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <MapContainer center={center as [number, number]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map((branch) => (
          <Marker key={branch.id} position={[branch.latitude, branch.longitude] as [number, number]}>
            <Popup>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {branch.name}
              </Typography>
              <Typography variant="body2">{branch.address}</Typography>
              <Typography variant="caption" color="text.secondary">
                {branch.city}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default BranchesMap;
