'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { BranchSummary } from '@/types/branches';

interface BranchesMapProps {
  branches: BranchSummary[];
}

const DEFAULT_POSITION: [number, number] = [55.751244, 37.618423];

function loadYandexScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if ((window as any).ymaps) return resolve();

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));
    document.head.appendChild(script);
  });
}

const BranchesMap: React.FC<BranchesMapProps> = ({ branches }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  const positions = useMemo(
    () =>
      branches
        .filter((b) => typeof b.latitude === 'number' && typeof b.longitude === 'number')
        .map((b) => ({
          id: b.id,
          name: b.name,
          latitude: b.latitude as number,
          longitude: b.longitude as number,
          address: b.address,
          city: b.city,
        })),
    [branches],
  );

  useEffect(() => {
    setIsClient(true);

    let mounted = true;

    (async () => {
      try {
        await loadYandexScript();
        if (!mounted) return;
        const ymaps = (window as any).ymaps;
        await ymaps.ready();

        const center: [number, number] = positions.length > 0 ? [positions[0].latitude, positions[0].longitude] : DEFAULT_POSITION;

        // create map if not exists
        if (!mapRef.current && containerRef.current) {
          mapRef.current = new ymaps.Map(containerRef.current, {
            center: center,
            zoom: 12,
            controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
          });
        }

        // clear existing geoObjects
        if (mapRef.current) {
          mapRef.current.geoObjects.removeAll();
        }

        // add placemarks
        positions.forEach((pos) => {
          const placemark = new ymaps.Placemark([pos.latitude, pos.longitude], {
            hintContent: pos.name,
            balloonContentBody: `<div style="font-weight:600;margin-bottom:6px;">${pos.name}</div><div>${pos.address ?? ''}</div><div style="color:#666">${pos.city ?? ''}</div>`,
          });
          mapRef.current.geoObjects.add(placemark);
        });

        // adjust bounds if multiple
        if (positions.length > 1 && mapRef.current) {
          const bounds = mapRef.current.geoObjects.getBounds();
          if (bounds) mapRef.current.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
        } else if (mapRef.current) {
          mapRef.current.setCenter(center);
        }
      } catch (err) {
        // fall back silently; map will show empty state below
        console.error('Yandex maps load error', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [positions]);

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

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 400, borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

export default BranchesMap;
