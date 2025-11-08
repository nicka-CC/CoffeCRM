'use client';

import React, {useEffect, useState} from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Feedback,
  GridView,
} from '@mui/icons-material';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token'); // или localStorage
    if (!token) {
      router.replace('/login'); // сразу редирект
    } else {
      setAuthorized(true); // рендерим только если есть токен
    }
  }, [router]);

  if (!authorized) {
    return (<div style={{ display: 'flex', backgroundColor:'white', width:'100%',height:'100%' }}></div>); // пока редирект, ничего не рендерим (нет мигания)
  }
  return (
    <Box sx={{ display: 'flex', backgroundColor:'white' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100%' }}>
        {/* Top App Bar */}
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setSidebarOpen(true)}
              sx={{  }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Box sx={{
                width: 32,
                height: 32,
                backgroundColor: '#6366f1',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1
              }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>C</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6366f1' }}>
                CoffeeCRM
              </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname === '/' ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname === '/' ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Dashboard
                </Typography>
              </Link>
              <Link href="/users" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname === '/users' ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname === '/users' ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Users
                </Typography>
              </Link>
              <Link href="/roles" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname === '/roles' ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname === '/roles' ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Roles
                </Typography>
              </Link>
              <Link href="/roles/create" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname === '/roles/create' ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname === '/roles/create' ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Create Role
                </Typography>
              </Link>
              <Link href="/branches" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname?.startsWith('/branches') ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname?.startsWith('/branches') ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Branches
                </Typography>
              </Link>
              <Link href="/products" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname === '/products' ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname === '/products' ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Products
                </Typography>
              </Link>
              <Link href="/inventory" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname === '/inventory' ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname === '/inventory' ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Inventory
                </Typography>
              </Link>
              <Link href="/orders" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname?.startsWith('/orders') ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname?.startsWith('/orders') ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Orders
                </Typography>
              </Link>
              <Link href="/employees" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname?.startsWith('/employees') ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname?.startsWith('/employees') ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Employees
                </Typography>
              </Link>
              <Link href="/categories" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname === '/categories' ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname === '/categories' ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Categories
                </Typography>
              </Link>
              <Link href="/bookings" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname?.startsWith('/bookings') ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname?.startsWith('/bookings') ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Bookings
                </Typography>
              </Link>
              <Link href="/customers" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname?.startsWith('/customers') ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname?.startsWith('/customers') ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Customers
                </Typography>
              </Link>
              <Link href="/analytics" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname?.startsWith('/analytics') ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname?.startsWith('/analytics') ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Analytics
                </Typography>
              </Link>
              <Link href="/settings" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: pathname?.startsWith('/settings') ? '#6366f1' : 'text.secondary',
                    borderBottom: pathname?.startsWith('/settings') ? '2px solid #6366f1' : 'none',
                    pb: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  Settings
                </Typography>
              </Link>
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: '#6366f1',
                    color: '#6366f1'
                  }
                }}
              >
                Feedback
              </Button>

              <IconButton size="small">
                <GridView />
              </IconButton>

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, backgroundColor: '#6366f1' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Page Content */}
        <Box sx={{  backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
          {title && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
