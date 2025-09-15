'use client';

import React, { useState } from 'react';
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
import { usePathname } from 'next/navigation';
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

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh' }}>
        {/* Top App Bar */}
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
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
        <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
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
