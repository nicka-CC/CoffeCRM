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
import { usePermissions } from '@/components/hooks/usePermissions';
import { useSidebar } from './SidebarContext';
import ico from "@/public/cup.svg"
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const { userId } = usePermissions();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token'); // или localStorage
    if (!token) {
      router.replace('/login'); // сразу редирект
    } else {
      setAuthorized(true); // рендерим только если есть токен
    }
  }, [router]);

  useEffect(() => {
    // Fetch current user profile to get avatar/icon
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        if (!token || !userId) return;
        const res = await fetch(`http://localhost:7000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.icon) {
          // backend returns path like /uploads/..., prepend host if needed
          setAvatarUrl(data.icon.startsWith('http') ? data.icon : `http://localhost:7000${data.icon}`);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchProfile();
  }, [userId]);

  if (!authorized) {
    return (<div style={{ display: 'flex', backgroundColor:'white', width:'100%',height:'100%' }}></div>); // пока редирект, ничего не рендерим (нет мигания)
  }
  return (
    <Box sx={{ display: 'flex', backgroundColor:'white' }}>
      {/* Sidebar */}
      <Sidebar open={true} onClose={() => {}} />
      
      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        minHeight: '100vh',
        marginLeft: collapsed ? '72px' : '260px',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        width: '0'
      }}>
        {/* Top App Bar */}
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0', minWidth: 0 }}>
          <Toolbar sx={{ overflow: 'hidden', '& > *': { minWidth: 0 } }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              {/*<Box sx={{*/}
              {/*  width: 32,*/}
              {/*  height: 32,*/}

              {/*  borderRadius: '6px',*/}
              {/*  display: 'flex',*/}
              {/*  alignItems: 'center',*/}
              {/*  justifyContent: 'center',*/}
              {/*  mr: 1*/}
              {/*}}>*/}
              {/*  <Image*/}
              {/*      src={ico}*/}
              {/*      width={45}*/}
              {/*      height={45}*/}
              {/*      alt={'f'}*/}
              {/*  >*/}
              {/*  </Image>*/}
              {/*</Box>*/}
              {/*<Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6366f1' }}>*/}
              {/*  CoffeeCRM*/}
              {/*</Typography>*/}
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>

            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  src={avatarUrl || undefined}
                  sx={{ width: 32, height: 32, backgroundColor: avatarUrl ? undefined : '#6366f1' }}
                >
                  {!avatarUrl && <AccountCircle />}
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
                <MenuItem onClick={() => { handleClose(); if (userId) router.push(`/users/${userId}`); }}>My account</MenuItem>
                <MenuItem onClick={() => {
                  handleClose();
                  // Clear auth tokens and redirect to login
                  try { sessionStorage.removeItem('access_token'); sessionStorage.removeItem('refresh_token'); } catch(e){}
                  try { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); } catch(e){}
                  router.replace('/login');
                }}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Page Content */}
        <Box sx={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', p: 3, overflow: 'auto', flex: 1, minWidth: 0 }}>
          {title && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, wordBreak: 'break-word',  color: 'black' }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body1" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
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
