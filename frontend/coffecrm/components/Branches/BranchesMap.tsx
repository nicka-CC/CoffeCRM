import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import type { BranchSummary } from '@/types/branches';

interface BranchesMapProps {
  branches: BranchSummary[];
  selectedBranchId?: number | null;
  onBranchSelect?: (branchId: number | null) => void;
}

const DEFAULT_POSITION: [number, number] = [59.939095, 30.315868];
const WAREHOUSE_POSITION: [number, number] = [59.939095, 30.315868];
const WAREHOUSE_NAME = 'Центральный склад';

declare global {
  interface Window {
    ymaps: any;
    ymapsReady?: boolean;
  }
}

const BranchesMap: React.FC<BranchesMapProps> = ({
                                                   branches,
                                                   selectedBranchId: externalSelectedId,
                                                   onBranchSelect,
                                                 }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const placemarksRef = useRef<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Управляем выбором филиала: если передан извне — используем его, иначе локально
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(null);
  const selectedBranchId = externalSelectedId !== undefined ? externalSelectedId : localSelectedId;

  const positions = React.useMemo(() => branches
      .filter(b => b.latitude != null && b.longitude != null)
      .map(b => ({
        id: b.id,
        name: b.name,
        city: b.city ?? '',
        address: b.address ?? '',
        latitude: b.latitude!,
        longitude: b.longitude!,
      })), [branches]);

  const selectedBranch = selectedBranchId
      ? positions.find(p => p.id === selectedBranchId)
      : null;

  // Загрузка Yandex Maps — один раз глобально
  useEffect(() => {
    if (window.ymapsReady) {
      setIsReady(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      const check = setInterval(() => {
        if (window.ymaps?.ready) {
          clearInterval(check);
          window.ymaps.ready(() => {
            window.ymapsReady = true;
            setIsReady(true);
          });
        }
      }, 100);
      return () => clearInterval(check);
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=b64b9bc0-f824-4f50-b7bf-9c2b7b818201&lang=ru_RU&packages=router';
    script.async = true;
    script.onload = () => {
      window.ymaps.ready(() => {
        window.ymapsReady = true;
        setIsReady(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  // Инициализация карты и статичных объектов
  useEffect(() => {
    if (!isReady || !mapContainerRef.current || mapRef.current) return;

    const map = new window.ymaps.Map(mapContainerRef.current!, {
      center: DEFAULT_POSITION,
      zoom: 10,
      controls: ['zoomControl', 'fullscreenControl'],
    });
    mapRef.current = map;

    // Склад
    const warehouse = new window.ymaps.Placemark(
        WAREHOUSE_POSITION,
        { hintContent: WAREHOUSE_NAME, balloonContent: `<strong>${WAREHOUSE_NAME}</strong>` },
        { preset: 'islands#redDotIcon' }
    );
    map.geoObjects.add(warehouse);

    // Филиалы
    placemarksRef.current = positions.map(pos => {
      const pm = new window.ymaps.Placemark(
          [pos.latitude, pos.longitude],
          {
            hintContent: pos.name,
            balloonContentBody: `<strong>${pos.name}</strong><br>${pos.address}<br><small>${pos.city}</small>`,
          },
          { preset: 'islands#blueCircleDotIcon' }
      );

      pm.events.add('click', () => {
        const newId = pos.id;
        if (onBranchSelect) onBranchSelect(newId);
        else setLocalSelectedId(newId);
      });

      map.geoObjects.add(pm);
      return pm;
    });

    // Автофокус при первой загрузке
    if (positions.length > 0) {
      const bounds = map.geoObjects.getBounds();
      bounds && map.setBounds(bounds, { zoomMargin: 60 });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [isReady, positions, onBranchSelect]);

  // Обновление стилей и центрирование при выборе
  useEffect(() => {
    if (!mapRef.current || placemarksRef.current.length === 0) return;

    // Обновляем стили меток
    placemarksRef.current.forEach((pm, index) => {
      const pos = positions[index];
      if (pos) {
        pm.options.set(
            'preset',
            pos.id === selectedBranchId ? 'islands#blueStretchyIcon' : 'islands#blueCircleDotIcon'
        );
      }
    });

    // Центрируем карту на выбранном филиале, если нет активного маршрута
    if (selectedBranch && !routeRef.current) {
      mapRef.current.setCenter([selectedBranch.latitude, selectedBranch.longitude], 14, {
        checkZoomRange: true,
        duration: 300,
      });
    }
  }, [selectedBranchId, selectedBranch, positions]);


  // Построение маршрута
  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    const buildRoute = () => {
      // Очистка старого маршрута
      if (routeRef.current) {
        mapRef.current.geoObjects.remove(routeRef.current);
        routeRef.current = null;
      }

      if (!selectedBranch) return;

      const referencePoints = [
        [selectedBranch.latitude, selectedBranch.longitude],
        WAREHOUSE_POSITION,
      ];

      window.ymaps.route(referencePoints).then((route: any) => {
        mapRef.current.geoObjects.add(route);
        routeRef.current = route;
        
        // Автоматическое масштабирование
        mapRef.current.setBounds(route.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 35
        });
      }).catch((err: any) => {
        console.error("Ошибка при построении маршрута:", err);
      });
    };

    buildRoute();
  }, [selectedBranch, isReady]);

  // Обработчик выбора из селектора
  const handleSelectChange = (id: number | null) => {
    if (onBranchSelect) onBranchSelect(id);
    else setLocalSelectedId(id);
  };

  if (positions.length === 0) {
    return (
        <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Typography color="text.secondary">Нет филиалов с координатами</Typography>
        </Box>
    );
  }

  return (
      <Box sx={{ position: 'relative', width: '100%', height: 500, borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        {/* Селектор филиала */}
        <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              zIndex: 10,
              p: 2,
              bgcolor: 'background.paper',
            }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>Выберите филиал для построения маршрута до склада</InputLabel>
            <Select
                value={selectedBranchId || ''}
                label="Выберите филиал для построения маршрута до склада"
                onChange={(e) => handleSelectChange(e.target.value ? Number(e.target.value) : null)}
            >
              <MenuItem value="">
                <em>— Не выбран —</em>
              </MenuItem>
              {positions.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name} ({branch.city || 'Город не указан'})
                  </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedBranch && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Маршрут: <strong>{selectedBranch.name}</strong> → <strong>{WAREHOUSE_NAME}</strong>
                </Typography>
                <Button size="small" color="error" onClick={() => handleSelectChange(null)} sx={{ mt: 0.5 }}>
                  Очистить маршрут
                </Button>
              </Box>
          )}
        </Paper>

        {/* Карта */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </Box>
  );
};

export default BranchesMap;