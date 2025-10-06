'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, CircularProgress } from '@mui/material';
import Layout from "@/components/Layout/Layout";
import LayoutAdmin from "@/components/Layout/LayoutAdmin";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:7000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                sessionStorage.setItem('access_token', data.access_token);
                router.push('/users'); // редирект после успешного логина
            } else {
                setError(data.message || 'Ошибка авторизации');
            }
        } catch (err) {
            console.error(err);
            setError('Ошибка сети');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutAdmin
            title="Login"
        >
        <Container maxWidth="sm" style={{ display: 'flex', marginTop:'20px', flexDirection: 'column', gap: '1rem', minWidth:'500px' }}>
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Container>
            </LayoutAdmin>
    );
}
