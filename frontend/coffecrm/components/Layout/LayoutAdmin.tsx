'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,

} from '@mui/material';


interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const LayoutAdmin: React.FC<LayoutProps> = ({ children, title}) => {

  return (
    <Box sx={{ display: 'flex', backgroundColor:'white', height: '100vh', width: '100%' }}>
        <Box sx={{ p: 3, backgroundColor: '#f8fafc', height: 'auto', margin:'auto auto', borderRadius:'15px' }}>
          {title && (
            <Box sx={{  }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 , color: 'text.secondary', textAlign:'center'}}>
                {title}
              </Typography>

            </Box>
          )}
          {children}
        </Box>
    </Box>
  );
};

export default LayoutAdmin;
