'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    TextField,
    Button,
    CircularProgress,
    MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    phone: string;
}

export default function UserEditPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch(`http://localhost:7000/user/${id}`,{
                method: "GET",
                headers: {
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwN2QwYjJkLTg1ZDktNDBkMC04MjdlLTJmOGE4NWEwZTgxMCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInBob25lIjoiKzEyMzQ1Njc4OTAiLCJpYXQiOjE3NTg5OTA3MTksImV4cCI6MTc1ODk5MTYxOX0.NwXyRffjR94zLwxKHaimsekrngGhhw50_m1P10JYEI8`,
                }
            });
            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await fetch(`http://localhost:7000/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            alert('User updated!');
            router.push('/users');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this user?')) return;
        try {
            await fetch(`http://localhost:7000/user/${id}`, {
                method: 'DELETE',
            });
            alert('User deleted!');
            router.push('/users');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (!user) return <p>User not found</p>;

    return (
        <Container>
            <h1>Edit User</h1>
            <form
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <TextField
                    label="Email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <TextField
                    label="Full Name"
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                />
                <TextField
                    label="Role"
                    select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                >
                    <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="MANAGER">MANAGER</MenuItem>
                </TextField>
                <TextField
                    label="Phone"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />

                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </form>
        </Container>
    );
}
