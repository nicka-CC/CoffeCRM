'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  Button,
} from '@mui/material';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const token = sessionStorage.getItem('access_token');

  const fetchUsers = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const res = await fetch(
          `http://localhost:7000/user/all?page=${page}&limit=${limit}`,{
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
      );
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page, limit]);

  if (loading) return <CircularProgress />;

  return (
      // <Container>
      <>
        <h1>Users</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link href={`/users/${user.id}`}>
                      <Button variant="contained" size="small">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(0);
            }}
        />
        </>
      // </Container>
  );
}
