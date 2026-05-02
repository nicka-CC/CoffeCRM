'use client';

import React, {useState} from 'react';
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
    Inventory2 as Inventory,
    Warehouse,
    Delete,
    LocalShipping,
    Person,
    Star,
    VpnKey,
    Download,
    CalendarToday,
    Description,
    Category,
    Group,
    Assignment,
} from '@mui/icons-material';
import {usePathname, useRouter} from 'next/navigation';
import {useSidebar} from './SidebarContext';
import Image from "next/image";
import ico from "@/public/cup.svg";
import {usePermissions} from "@/components/hooks/usePermissions";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({open, onClose}) => {
    const pathname = usePathname();
    const router = useRouter();
    const {collapsed, setCollapsed} = useSidebar();
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
    // Для каскадных popover
    const { canEditResource } = usePermissions();
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
        setCollapsed(!collapsed);
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

    // Мгновенная навигация без ожидания загрузки данных
    const handleNavigation = (path: string) => {
        // Мгновенный переход на страницу
        router.push(path);
    };

    // Sidebar sections and items for a modern, clean look
    const sidebarSections = [
        {
            header: 'Основное',
            items: [
                {title: 'Дашборд', icon: <Dashboard/>, path: '/'},
            ],
        },
        {
            header: 'Пользователи',
            items: [
                {title: 'Пользователи', icon: <People/>, path: '/users'},
            ],
        },
        {
            header: 'Филиалы',
            items: [
                {title: 'Филиалы', icon: <Store/>, path: '/branches'},
            ],
        },
        {
            header: 'Товары',
            items: [
                {title: 'Товары', icon: <Coffee/>, path: '/products'},
                {title: 'Категории', icon: <Category/>, path: '/categories'},
            ],
        },
        {
            header: 'Склад',
            items: [
                {title: 'Склад', icon: <Inventory/>, path: '/inventory'},
            ],
        },
        {
            header: 'Заказы',
            items: [
                {title: 'Заказы', icon: <ShoppingCart/>, path: '/orders'},
            ],
        },
        {
            header: 'Клиенты',
            items: [
                {title: 'Клиенты', icon: <Person/>, path: '/customers'},
            ],
        },
        {
            header: 'Сотрудники',
            items: [
                {title: 'Сотрудники', icon: <Group/>, path: '/employees'},
            ],
        },
        {
            header: 'Бронирования',
            items: [
                {title: 'Бронирования', icon: <CalendarToday/>, path: '/bookings'},
            ],
        },
        {
            header: 'Аналитика',
            items: [
                {title: 'Аналитика', icon: <TrendingUp/>, path: '/analytics'},
            ],
        },
        ...(canEditResource('products', '1') ? [{
            header: 'Настройки',
            items: [
                { title: 'Настройки', icon: <Settings />, path: '/settings' },
            ],
        }] : []),
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
        // Проверяем активный путь: точное совпадение или начинается с пути (для вложенных страниц)
        const isActive = item.path === '/'
            ? pathname === '/'
            : pathname === item.path || pathname?.startsWith(item.path + '/');
        const paddingLeft = level === 0 ? 2 : 4;

        // Mini mode: only icons, show popover for expandable
        if (collapsed) {
            return (
                <Tooltip key={item.title} title={item.title} placement="right" arrow>
                    <ListItem disablePadding sx={{display: 'block', justifyContent: 'center'}}>
                        {item.expandable && item.children ? (
                            <IconButton
                                sx={{
                                    width: 48,
                                    height: 48,
                                    color: isActive ? '#6366f1' : '#555',
                                    mx: 'auto',
                                    my: 0.5,
                                    borderRadius: 2,
                                    background: isActive ? '#f5f7ff' : 'transparent'
                                }}
                                onClick={e => handlePopoverOpen(e, item.children, item.title, 0)}
                            >
                                {item.icon}
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    color: isActive ? '#6366f1' : '#555',
                                    mx: 'auto',
                                    my: 0.5,
                                    borderRadius: 2,
                                    background: isActive ? '#f5f7ff' : 'transparent'
                                }}
                            >
                                {item.icon}
                            </IconButton>
                        )}
                    </ListItem>
                </Tooltip>
            );
        }

        // Normal mode: full sidebar
        return (
            <React.Fragment key={item.title}>
                <ListItem disablePadding sx={{display: 'block'}}>
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
                                <ListItemIcon sx={{color: isActive ? '#6366f1' : '#bdbdbd', minWidth: 36}}>
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
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
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
                                <ListItemIcon sx={{color: isActive ? '#6366f1' : '#bdbdbd', minWidth: 36}}>
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
                    )}
                </ListItem>
                {item.expandable && item.children && (
                    <Collapse in={expandedItems[item.key]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ml: 3, borderLeft: '2px solid #f0f1f7', pl: 1}}>
                            {item.children.map((child: any) => renderSidebarItem(child, level + 1))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    display: {xs: 'block', sm: 'block'},
                    '& .MuiDrawer-paper': {
                        width: collapsed ? 72 : 260,
                        boxSizing: 'border-box',
                        background: '#fff',
                        boxShadow: '0 2px 16px 0 rgba(60,72,100,0.08)',
                        borderRight: '1px solid #f0f1f7',
                        overflowX: 'hidden',
                        transition: 'width 0.3s ease',
                        position: 'fixed',
                        height: '100vh',
                        zIndex: 1100,
                    },
                }}
            >
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between'
                }}>
                    <Box sx={{
                        width: 32,
                        height: 32,

                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1
                    }}>
                        <Image
                            src={ico}
                            width={40}
                            height={40}
                            alt={'f'}
                        >
                        </Image>
                    </Box>
                    {!collapsed ? <Typography variant="h6" sx={{fontWeight: 'bold', color: '#6366f1'}}>
                        CoffeeCRM
                    </Typography> : <Image
                        src={ico}
                        width={40}
                        height={40}
                        alt={'f'}
                    >
                    </Image>}
                    <IconButton onClick={handleCollapseToggle} size="small">
                        {collapsed ? <ExpandMore/> : <ExpandLess/>}
                    </IconButton>
                </Box>
                <Divider/>
                <Box sx={{pt: 1, pb: 1, overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 80px)'}}>
                    {sidebarSections.map((section :any):any => (
                        <React.Fragment key={section.header}>
                            {!collapsed && renderSectionHeader(section.header)}
                            <List sx={{mb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                {section.items.map((item :any) => renderSidebarItem(item))}
                            </List>
                        </React.Fragment>
                    ))}
                </Box>
                <Divider sx={{mt: 'auto'}}/>
            </Drawer>
            {/* Overlay для popover */}
            {popoverStack.length > 0 &&
                <Backdrop open={true} sx={{zIndex: 1200}} onClick={() => handlePopoverClose(0)}/>}
            {/* Каскадные popover */}
            {popoverStack.map((popover, idx) => (
                <Popover
                    key={idx}
                    open={true}
                    anchorEl={popover.anchor}
                    onClose={() => handlePopoverClose(idx)}
                    anchorOrigin={{vertical: 'center', horizontal: 'right'}}
                    transformOrigin={{vertical: 'center', horizontal: 'left'}}
                    PaperProps={{sx: {minWidth: 180, p: 1, ml: idx * 2, zIndex: 1300}}}
                >
                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 1}}>{popover.title}</Typography>
                    <List>
                        {popover.items.map((child, cidx) => (
                            child.expandable && child.children ? (
                                <ListItemButton
                                    key={child.title}
                                    onMouseEnter={e => handlePopoverOpen(e as any, child.children, child.title, idx + 1)}
                                    onClick={e => handlePopoverOpen(e as any, child.children, child.title, idx + 1)}
                                    sx={{borderRadius: 1}}
                                >
                                    <ListItemText primary={child.title}/>
                                </ListItemButton>
                            ) : (
                                <ListItemButton 
                                    key={child.title}
                                    onClick={() => {
                                        handlePopoverClose(0);
                                        handleNavigation(child.path);
                                    }}
                                    sx={{borderRadius: 1}}
                                >
                                    <ListItemText primary={child.title}/>
                                </ListItemButton>
                            )
                        ))}
                    </List>
                </Popover>
            ))}
        </>
    );
};

export default Sidebar;
