'use client';

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
  IconButton,
  Popover,
  Tooltip,
  Backdrop,
} from '@mui/material';
import {
  Dashboard,
  People,
  ExpandLess,
  ExpandMore,
  Close,
  ShoppingCart,
  Assessment,
  Settings,
  Payment,
  Login,
  Security,
  FlashOn,
  PersonAdd,
  TrendingUp,
  Store,
  Info,
  Coffee,
  Inventory, Warehouse,
  Delete, LocalShipping, Person, Star, VpnKey, Download, CalendarToday, Description,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [collapsed, setCollapsed] = useState(false);
  // Для каскадных popover
  const [popoverStack, setPopoverStack] = useState<Array<{
    anchor: HTMLElement;
    items: any[];
    title: string;
    level: number;
  }>>([]);

  const handleExpand = (item: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
    setExpandedItems({});
    // popoverAnchor больше не используется
  };

  // Открыть popover (stack push)
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, items: any[], title: string, level = 0) => {
    setPopoverStack(prev => [
      ...prev.slice(0, level),
      {
        anchor: event.currentTarget,
        items,
        title,
        level,
      },
    ]);
  };

  // Закрыть popover (stack pop)
  const handlePopoverClose = (level = 0) => {
    setPopoverStack(prev => prev.slice(0, level));
  };

  // Sidebar sections and items for a modern, clean look
  const sidebarSections = [
    {
      header: 'Авторизация',
      items: [
        { title: 'Логин', icon: <Login />, path: '/auth/login' },
        { title: 'Регистрация', icon: <PersonAdd />, path: '/auth/register' },
        { title: 'Роли', icon: <Security />, path: '/auth/roles' },
      ],
    },
    {
      header: 'Dashboard',
      items: [
        { title: 'Статистика дня', icon: <Dashboard />, path: '/dashboard/daily-stats' },
        { title: 'Графики продаж', icon: <TrendingUp />, path: '/dashboard/sales-charts' },
        { title: 'Быстрые действия', icon: <FlashOn />, path: '/dashboard/quick-actions' },
      ],
    },
    {
      header: 'Филиалы',
      items: [
        { title: 'Список филиалов', icon: <Store />, path: '/branches/list' },
        { title: 'Карта', icon: <Store />, path: '/branches/map' },
        {
          title: 'Детали филиала',
          icon: <Info />,
          path: '/branches/details',
          expandable: true,
          key: 'branches-details',
          children: [
            { title: 'Сотрудники', path: '/branches/details/staff' },
            { title: 'Продажи', path: '/branches/details/sales' },
            { title: 'Запасы', path: '/branches/details/inventory' },
          ],
        },
      ],
    },
    {
      header: 'Товары и меню',
      items: [
        { title: 'Список товаров', icon: <Coffee />, path: '/menu/products' },
        { title: 'Категории', icon: <List />, path: '/menu/categories' },
        { title: 'Остатки по филиалам', icon: <Inventory />, path: '/menu/branch-inventory' },
      ],
    },
    {
      header: 'Склад',
      items: [
        { title: 'Остатки', icon: <Warehouse />, path: '/warehouse/inventory' },
        { title: 'Приход/Расход', icon: <LocalShipping />, path: '/warehouse/transactions' },
        { title: 'Списание', icon: <Delete />, path: '/warehouse/write-off' },
      ],
    },
    {
      header: 'Заказы',
      items: [
        { title: 'Таблица заказов', icon: <ShoppingCart />, path: '/orders/list' },
        { title: 'Статусы', icon: <List />, path: '/orders/statuses' },
        { title: 'Детали заказа', icon: <Info />, path: '/orders/details' },
      ],
    },
    {
      header: 'Клиенты',
      items: [
        { title: 'Список', icon: <Person />, path: '/customers/list' },
        { title: 'История заказов', icon: <List />, path: '/customers/order-history' },
        { title: 'Бонусы', icon: <Star />, path: '/customers/bonuses' },
      ],
    },
    {
      header: 'Сотрудники',
      items: [
        { title: 'Список сотрудников', icon: <People />, path: '/staff/list' },
        { title: 'Роли и доступы', icon: <VpnKey />, path: '/staff/roles' },
        { title: 'KPI', icon: <Assessment />, path: '/staff/kpi' },
      ],
    },
    {
      header: 'Аналитика',
      items: [
        { title: 'Продажи по периодам', icon: <TrendingUp />, path: '/analytics/sales-periods' },
        { title: 'ТОП товаров/клиентов', icon: <Star />, path: '/analytics/top' },
        { title: 'По филиалам', icon: <Store />, path: '/analytics/branches' },
        { title: 'Экспорт Excel/PDF', icon: <Download />, path: '/analytics/export' },
      ],
    },
    {
      header: 'Настройки',
      items: [
        { title: 'Компания', icon: <Settings />, path: '/settings/company' },
        { title: 'Платежи', icon: <Payment />, path: '/settings/payments' },
        { title: 'Интеграции', icon: <Settings />, path: '/settings/integrations' },
      ],
    },
    {
      header: 'Бронирования',
      items: [
        { title: 'Список бронирований', icon: <CalendarToday />, path: '/reservations/list' },
        { title: 'Календарь', icon: <CalendarToday />, path: '/reservations/calendar' },
        { title: 'Детали бронирования', icon: <Info />, path: '/reservations/details' },
        { title: 'Управление', icon: <Settings />, path: '/reservations/management' },
        { title: 'Отчёты', icon: <Description />, path: '/reservations/reports' },
      ],
    },
  ];

  // Render a section header
  const renderSectionHeader = (header: string) => (
    <Typography
      key={header}
      variant="caption"
      sx={{
        fontWeight: 700,
        color: '#8c8c8c',
        textTransform: 'uppercase',
        letterSpacing: 1,
        pl: 2,
        pt: 2,
        pb: 0.5,
      }}
    >
      {header}
    </Typography>
  );

  // Render a sidebar item (with or without children)
  const renderSidebarItem = (item: any, level = 0) => {
    const isExpanded = expandedItems[item.key] || false;
    const isActive = pathname === item.path;
    const paddingLeft = level === 0 ? 2 : 4;

    // Mini mode: only icons, show popover for expandable
    if (collapsed) {
      return (
        <Tooltip key={item.title} title={item.title} placement="right" arrow>
          <ListItem disablePadding sx={{ display: 'block', justifyContent: 'center' }}>
            {item.expandable && item.children ? (
              <IconButton
                sx={{ width: 48, height: 48, color: isActive ? '#6366f1' : '#555', mx: 'auto', my: 0.5, borderRadius: 2, background: isActive ? '#f5f7ff' : 'transparent' }}
                onClick={e => handlePopoverOpen(e, item.children, item.title, 0)}
              >
                {item.icon}
              </IconButton>
            ) : (
              <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }}>
                <IconButton
                  sx={{ width: 48, height: 48, color: isActive ? '#6366f1' : '#555', mx: 'auto', my: 0.5, borderRadius: 2, background: isActive ? '#f5f7ff' : 'transparent' }}
                >
                  {item.icon}
                </IconButton>
              </Link>
            )}
          </ListItem>
        </Tooltip>
      );
    }

    // Normal mode: full sidebar
    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          {item.expandable && item.children ? (
            <ListItemButton
              sx={{
                pl: paddingLeft,
                backgroundColor: isActive ? '#f5f7ff' : 'transparent',
                color: isActive ? '#6366f1' : 'inherit',
                borderRadius: 2,
                fontWeight: isActive ? 700 : 400,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: '#f0f1f7',
                },
              }}
              onClick={() => handleExpand(item.key)}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: isActive ? '#6366f1' : '#bdbdbd', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: level === 0 ? 15 : 14,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#6366f1' : (level === 0 ? '#222' : '#666'),
                }}
              />
            </ListItemButton>
          ) : (
            <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }}>
              <ListItemButton
                sx={{
                  pl: paddingLeft,
                  backgroundColor: isActive ? '#f5f7ff' : 'transparent',
                  color: isActive ? '#6366f1' : 'inherit',
                  borderRadius: 2,
                  fontWeight: isActive ? 700 : 400,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: '#f0f1f7',
                  },
                }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ color: isActive ? '#6366f1' : '#bdbdbd', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: level === 0 ? 15 : 14,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#6366f1' : (level === 0 ? '#222' : '#666'),
                  }}
                />
              </ListItemButton>
            </Link>
          )}
        </ListItem>
        {item.expandable && item.children && (
          <Collapse in={expandedItems[item.key]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ ml: 3, borderLeft: '2px solid #f0f1f7', pl: 1 }}>
              {item.children.map((child: any) => renderSidebarItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: collapsed ? 72 : 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? 72 : 260,
            boxSizing: 'border-box',
            background: '#fff',
            boxShadow: '0 2px 16px 0 rgba(60,72,100,0.08)',
            borderRight: '1px solid #f0f1f7',
            overflowX: 'hidden',
            transition: 'width 0.2s',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#6366f1', letterSpacing: 1, display: collapsed ? 'none' : 'block' }}>
            CoffeeCRM
          </Typography>
          <IconButton onClick={handleCollapseToggle} size="small">
            {collapsed ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ pt: 1, pb: 1 }}>
          {sidebarSections.map(section => (
            <React.Fragment key={section.header}>
              {!collapsed && renderSectionHeader(section.header)}
              <List sx={{ mb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {section.items.map(item => renderSidebarItem(item))}
              </List>
            </React.Fragment>
          ))}
        </Box>
        <Divider sx={{ mt: 'auto' }} />
        {!collapsed && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Copyright © 2025 CoffeeCRM, LLC.
            </Typography>
          </Box>
        )}
      </Drawer>
      {/* Overlay для popover */}
      <Backdrop open={popoverStack.length > 0} sx={{ zIndex: 1200 }} onClick={() => handlePopoverClose(0)} />
      {/* Каскадные popover */}
      {popoverStack.map((popover, idx) => (
        <Popover
          key={idx}
          open={true}
          anchorEl={popover.anchor}
          onClose={() => handlePopoverClose(idx)}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          PaperProps={{ sx: { minWidth: 180, p: 1, ml: idx * 2 } }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>{popover.title}</Typography>
          <List>
            {popover.items.map((child, cidx) => (
              child.expandable && child.children ? (
                <ListItemButton
                  key={child.title}
                  onMouseEnter={e => handlePopoverOpen(e as any, child.children, child.title, idx + 1)}
                  onClick={e => handlePopoverOpen(e as any, child.children, child.title, idx + 1)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText primary={child.title} />
                </ListItemButton>
              ) : (
                <Link key={child.title} href={child.path} style={{ textDecoration: 'none' }} onClick={() => handlePopoverClose(0)}>
                  <ListItemButton sx={{ borderRadius: 1 }}>
                    <ListItemText primary={child.title} />
                  </ListItemButton>
                </Link>
              )
            ))}
          </List>
        </Popover>
      ))}
    </>
  );
};

export default Sidebar;
