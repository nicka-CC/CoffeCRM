import Layout from '../../components/Layout/Layout';
import RolesList from '../../components/Roles/RolesList';

export default function RolesPage() {
  return (
    <Layout 
      title="Roles" 
      subtitle="Manage user roles and permissions. Create and configure access levels."
    >
      <RolesList />
    </Layout>
  );
}

