import Layout from '../components/Layout/Layout';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People,
  AdminPanelSettings,
  ShoppingCart,
  Assessment,
  TrendingUp,
  Security,
} from '@mui/icons-material';

export default function Home() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: <People />,
      color: '#6366f1',
    },
    {
      title: 'Active Roles',
      value: '8',
      change: '+2',
      icon: <AdminPanelSettings />,
      color: '#10b981',
    },
    {
      title: 'Total Orders',
      value: '5,678',
      change: '+8%',
      icon: <ShoppingCart />,
      color: '#f59e0b',
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+15%',
      icon: <TrendingUp />,
      color: '#ef4444',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and edit user accounts',
      icon: <People />,
      path: '/users',
      color: '#6366f1',
    },
    {
      title: 'Role Management',
      description: 'Configure roles and permissions',
      icon: <AdminPanelSettings />,
      path: '/roles',
      color: '#10b981',
    },
    {
      title: 'Create Role',
      description: 'Add new user roles',
      icon: <Security />,
      path: '/roles/create',
      color: '#f59e0b',
    },
    {
      title: 'Analytics',
      description: 'View system analytics',
      icon: <Assessment />,
      path: '/analytics',
      color: '#ef4444',
    },
  ];

  return (
    <Layout 
      title="Dashboard" 
      subtitle="Welcome to CoffeeCRM. Manage your business operations efficiently."
    >
      <Box>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ backgroundColor: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      backgroundColor: stat.change.startsWith('+') ? '#dcfce7' : '#fef2f2',
                      color: stat.change.startsWith('+') ? '#166534' : '#dc2626',
                      fontWeight: 'medium'
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ backgroundColor: action.color, mr: 2 }}>
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    sx={{ 
                      color: action.color,
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    Go to {action.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}
