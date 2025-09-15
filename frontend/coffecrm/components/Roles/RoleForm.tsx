'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Chip,
  IconButton,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save,
  Cancel,
  Add,
  Delete,
  AdminPanelSettings,
  People,
  ShoppingCart,
  Assessment,
  Settings,
} from '@mui/icons-material';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

const RoleForm: React.FC = () => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: [],
    color: '#6366f1',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock permissions data
  const permissions: Permission[] = [
    // User Management
    { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management' },
    { id: 'users.read', name: 'View Users', description: 'View user profiles and information', category: 'User Management' },
    { id: 'users.update', name: 'Edit Users', description: 'Edit user information and settings', category: 'User Management' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'User Management' },
    
    // Role Management
    { id: 'roles.create', name: 'Create Roles', description: 'Create new user roles', category: 'Role Management' },
    { id: 'roles.read', name: 'View Roles', description: 'View role definitions', category: 'Role Management' },
    { id: 'roles.update', name: 'Edit Roles', description: 'Edit role permissions', category: 'Role Management' },
    { id: 'roles.delete', name: 'Delete Roles', description: 'Remove user roles', category: 'Role Management' },
    
    // Product Management
    { id: 'products.create', name: 'Create Products', description: 'Add new products to catalog', category: 'Product Management' },
    { id: 'products.read', name: 'View Products', description: 'View product information', category: 'Product Management' },
    { id: 'products.update', name: 'Edit Products', description: 'Edit product details', category: 'Product Management' },
    { id: 'products.delete', name: 'Delete Products', description: 'Remove products from catalog', category: 'Product Management' },
    
    // Order Management
    { id: 'orders.create', name: 'Create Orders', description: 'Process new orders', category: 'Order Management' },
    { id: 'orders.read', name: 'View Orders', description: 'View order details', category: 'Order Management' },
    { id: 'orders.update', name: 'Edit Orders', description: 'Modify order information', category: 'Order Management' },
    { id: 'orders.delete', name: 'Delete Orders', description: 'Cancel or delete orders', category: 'Order Management' },
    
    // Analytics
    { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard', category: 'Analytics' },
    { id: 'reports.generate', name: 'Generate Reports', description: 'Create and download reports', category: 'Analytics' },
    
    // System Settings
    { id: 'settings.general', name: 'General Settings', description: 'Modify general system settings', category: 'System Settings' },
    { id: 'settings.security', name: 'Security Settings', description: 'Configure security policies', category: 'System Settings' },
  ];

  const categories = [...new Set(permissions.map(p => p.category))];

  const handleInputChange = (field: keyof RoleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }));
  };

  const handleSelectAll = (category: string, checked: boolean) => {
    const categoryPermissions = permissions
      .filter(p => p.category === category)
      .map(p => p.id);

    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...categoryPermissions])]
        : prev.permissions.filter(id => !categoryPermissions.includes(id))
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Role description is required';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log('Form submitted:', formData);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        permissions: [],
        color: '#6366f1',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      color: '#6366f1',
    });
    setErrors({});
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'User Management':
        return <People />;
      case 'Role Management':
        return <AdminPanelSettings />;
      case 'Product Management':
        return <ShoppingCart />;
      case 'Order Management':
        return <Assessment />;
      case 'Analytics':
        return <Assessment />;
      case 'System Settings':
        return <Settings />;
      default:
        return <Settings />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Create New Role
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Cancel />}
          onClick={handleCancel}
          sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
        >
          Cancel
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                Basic Information
              </Typography>
              
              <TextField
                fullWidth
                label="Role Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
                placeholder="e.g., Manager, Editor, Viewer"
              />
              
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                sx={{ mb: 2 }}
                placeholder="Describe the role's purpose and responsibilities"
              />
              
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                sx={{ mb: 2 }}
              />
            </Paper>
          </Grid>

          {/* Permissions */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                Permissions
              </Typography>
              
              {errors.permissions && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.permissions}
                </Alert>
              )}

              {categories.map((category) => {
                const categoryPermissions = permissions.filter(p => p.category === category);
                const selectedCount = categoryPermissions.filter(p => 
                  formData.permissions.includes(p.id)
                ).length;
                const allSelected = selectedCount === categoryPermissions.length;

                return (
                  <Box key={category} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getCategoryIcon(category)}
                      <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
                        {category}
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {selectedCount}/{categoryPermissions.length} selected
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handleSelectAll(category, !allSelected)}
                          sx={{ textTransform: 'none' }}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      </Box>
                    </Box>

                    <FormControl component="fieldset" fullWidth>
                      <FormGroup>
                        <Grid container spacing={1}>
                          {categoryPermissions.map((permission) => (
                            <Grid item xs={12} sm={6} key={permission.id}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                      {permission.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {permission.description}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </FormGroup>
                    </FormControl>

                    {category !== categories[categories.length - 1] && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                );
              })}
            </Paper>
          </Grid>
        </Grid>

        {/* Selected Permissions Summary */}
        {formData.permissions.length > 0 && (
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Selected Permissions ({formData.permissions.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.permissions.map((permissionId) => {
                const permission = permissions.find(p => p.id === permissionId);
                return permission ? (
                  <Chip
                    key={permissionId}
                    label={permission.name}
                    size="small"
                    onDelete={() => handlePermissionChange(permissionId, false)}
                    deleteIcon={<Delete />}
                    sx={{
                      backgroundColor: '#f3f4f6',
                      color: 'text.primary'
                    }}
                  />
                ) : null;
              })}
            </Box>
          </Paper>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            sx={{
              backgroundColor: '#6366f1',
              '&:hover': { backgroundColor: '#5b5bd6' }
            }}
          >
            Create Role
          </Button>
        </Box>
      </form>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Role created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleForm;

