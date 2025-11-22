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
      const API_KEY = 'b64b9bc0-f824-4f50-b7bf-9c2b7b818201';
      script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${API_KEY}`;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));
    document.head.appendChild(script);
  });
}
const WAREHOUSE_COORDS: [number, number] = [55.76, 37.64]; // координаты склада

const BranchesMap: React.FC<BranchesMapProps> = ({ branches }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  const [selectedBranchId, setSelectedBranchId] = useState<any | null>("0edf0c5f-e728-4715-9e01-8c81830cf416");

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

        const center: [number, number] = positions.length > 0
            ? [positions[0].latitude, positions[0].longitude]
            : DEFAULT_POSITION;

        if (!mapRef.current && containerRef.current) {
          mapRef.current = new ymaps.Map(containerRef.current, {
            center,
            zoom: 12,
            controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
          });
        }

        mapRef.current.geoObjects.removeAll();

        positions.forEach((pos) => {
          const placemark = new ymaps.Placemark([pos.latitude, pos.longitude], {
            hintContent: pos.name,
            balloonContentBody: `
              <div style="font-weight:600;margin-bottom:6px;">${pos.name}</div>
              <div>${pos.address ?? ''}</div>
              <div style="color:#666">${pos.city ?? ''}</div>
            `,
          });
          mapRef.current.geoObjects.add(placemark);
        });

        // Добавляем точку склада
        const warehousePlacemark = new ymaps.Placemark(WAREHOUSE_COORDS, {
          hintContent: 'Склад',
        }, {
          preset: 'islands#redIcon',
        });
        mapRef.current.geoObjects.add(warehousePlacemark);

        // Строим маршрут если выбран филиал
        // Строим маршрут если выбран филиал
        // убираем предыдущий маршрут
        if (mapRef.current._lastRoute) {
          mapRef.current.geoObjects.remove(mapRef.current._lastRoute);
          mapRef.current._lastRoute = null;
        }

        if (selectedBranchId) {
          const branch = positions.find((p) => p.id === selectedBranchId);

          if (branch) {
            const multiRoute = new ymaps.multiRouter.MultiRoute(
                {
                  referencePoints: [
                    WAREHOUSE_COORDS,
                    [branch.latitude, branch.longitude],
                  ],
                  params: { routingMode: 'auto' },
                },
                {
                  routeStrokeWidth: 4,
                  routeStrokeColor: "#1A73E8",
                }
            );

            // сохраняем ссылку на маршрут
            mapRef.current._lastRoute = multiRoute;

            mapRef.current.geoObjects.add(multiRoute);

            // ждём когда маршрут реально построится
            multiRoute.model.events.add('requestsuccess', () => {
              mapRef.current.setBounds(multiRoute.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 30,
              });
            });
          }
        }


      } catch (err) {
        console.error('Yandex maps load error', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [positions, selectedBranchId]); // <-- добавили зависимость

  return (
      <Box sx={{ position: 'relative', width: '100%',zIndex:100, height: 400 }}>

        {/* селектор выбора филиала */}
        <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 1000,    // <-- подняли выше карты
              background: 'white',
              p: 1,
              borderRadius: 2
            }}
        >

        <select
              value={selectedBranchId ?? ''}
              onChange={(e) => setSelectedBranchId(e.target.value)}
          >
            <option value="">Выберите филиал</option>
            {positions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
            ))}
          </select>
        </Box>

        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </Box>
  );
};
export default BranchesMap;
