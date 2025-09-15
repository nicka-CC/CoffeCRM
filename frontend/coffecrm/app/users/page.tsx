import Layout from '../../components/Layout/Layout';
import UsersList from '../../components/Users/UsersList';

export default function UsersPage() {
  return (
    <Layout 
      title="Users" 
      subtitle="Manage user accounts and permissions. View and edit user information."
    >
      <UsersList />
    </Layout>
  );
}

