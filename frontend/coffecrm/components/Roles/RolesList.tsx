'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Pagination,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  ArrowUpward,
  ArrowDownward,
  AdminPanelSettings,
  People,
} from '@mui/icons-material';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  isSystem: boolean;
  color: string;
}

const RolesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Mock data
  const roles: Role[] = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['users.create', 'users.read', 'users.update', 'users.delete', 'roles.manage'],
      userCount: 2,
      createdAt: '2024-01-01',
      isSystem: true,
      color: '#ef4444',
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access with most permissions',
      permissions: ['users.create', 'users.read', 'users.update', 'products.manage'],
      userCount: 5,
      createdAt: '2024-01-15',
      isSystem: false,
      color: '#f59e0b',
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Management access for team oversight',
      permissions: ['users.read', 'products.manage', 'orders.manage'],
      userCount: 8,
      createdAt: '2024-02-01',
      isSystem: false,
      color: '#3b82f6',
    },
    {
      id: 4,
      name: 'Editor',
      description: 'Content editing and product management',
      permissions: ['products.create', 'products.update', 'content.edit'],
      userCount: 12,
      createdAt: '2024-02-15',
      isSystem: false,
      color: '#10b981',
    },
    {
      id: 5,
      name: 'User',
      description: 'Basic user access with limited permissions',
      permissions: ['profile.read', 'profile.update'],
      userCount: 150,
      createdAt: '2024-03-01',
      isSystem: false,
      color: '#6b7280',
    },
  ];

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, role: Role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRoles = [...filteredRoles].sort((a, b) => {
    const aValue = a[sortBy as keyof Role];
    const bValue = b[sortBy as keyof Role];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getRoleIcon = (role: Role) => {
    if (role.name.toLowerCase().includes('admin')) {
      return <AdminPanelSettings sx={{ color: role.color }} />;
    }
    return <People sx={{ color: role.color }} />;
  };

  return (
    <Box>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Roles Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: '#6366f1',
            '&:hover': { backgroundColor: '#5b5bd6' }
          }}
        >
          Create New Role
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Role Name</MenuItem>
              <MenuItem value="userCount">User Count</MenuItem>
              <MenuItem value="createdAt">Created Date</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
          >
            More Filters
          </Button>
        </Box>
      </Paper>

      {/* Roles Count */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#6366f1',
            color: '#6366f1',
            textTransform: 'none',
            px: 2
          }}
        >
          {filteredRoles.length} Roles
        </Button>
      </Box>

      {/* Roles Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>ROLE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DESCRIPTION</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PERMISSIONS</TableCell>
              <TableCell 
                sx={{ fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('userCount')}
              >
                USERS
                {sortBy === 'userCount' && (
                  sortOrder === 'asc' ? <ArrowUpward sx={{ ml: 1, fontSize: 16 }} /> : 
                  <ArrowDownward sx={{ ml: 1, fontSize: 16 }} />
                )}
              </TableCell>
              <TableCell 
                sx={{ fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('createdAt')}
              >
                CREATED
                {sortBy === 'createdAt' && (
                  sortOrder === 'asc' ? <ArrowUpward sx={{ ml: 1, fontSize: 16 }} /> : 
                  <ArrowDownward sx={{ ml: 1, fontSize: 16 }} />
                )}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>TYPE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRoles.map((role) => (
              <TableRow key={role.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: '#f3f4f6' }}>
                      {getRoleIcon(role)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {role.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {role.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.permissions.slice(0, 2).map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        size="small"
                        sx={{
                          backgroundColor: '#f3f4f6',
                          color: 'text.primary',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                    {role.permissions.length > 2 && (
                      <Chip
                        label={`+${role.permissions.length - 2} more`}
                        size="small"
                        sx={{
                          backgroundColor: '#6366f1',
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Badge badgeContent={role.userCount} color="primary">
                    <People sx={{ color: 'text.secondary' }} />
                  </Badge>
                </TableCell>
                <TableCell>{role.createdAt}</TableCell>
                <TableCell>
                  <Chip
                    label={role.isSystem ? 'System' : 'Custom'}
                    size="small"
                    color={role.isSystem ? 'warning' : 'default'}
                    sx={{
                      backgroundColor: role.isSystem ? '#fef3c7' : '#f3f4f6',
                      color: role.isSystem ? '#92400e' : 'text.primary'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, role)}
                    size="small"
                    disabled={role.isSystem}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredRoles.length / 10)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Role</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete Role</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default RolesList;

