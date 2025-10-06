'use client';

import { useEffect, useState, useRef } from 'react';
import {
    Container,
    TextField,
    Button,
    CircularProgress,
    MenuItem,
    Avatar,
    Box,
    IconButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Layout from "@/components/Layout/Layout";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    phone: string;
    icon?: string; // URL или base64 изображения
}

export default function UserEditPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const token = sessionStorage.getItem("access_token");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchUser = async () => {
        try {
            const res = await fetch(`http://localhost:7000/user/${id}`,{
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await res.json();
            setUser(data);
            // Если у пользователя уже есть аватар, устанавливаем превью
            if (data.icon) {
                setAvatarPreview(`http://localhost:7000${data.icon}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            // Создаем превью для отображения
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarRemove = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();

            // Добавляем текстовые поля
            formData.append('fullName', user?.fullName || '');
            formData.append('phone', user?.phone || '');
            formData.append('email', user?.email || '');

            // Добавляем аватар только если он был изменен
            if (avatarFile) {
                formData.append('icon', avatarFile);
            }

            await fetch(`http://localhost:7000/user/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
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
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
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
        <Layout>
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    maxWidth: 400,
                    backgroundColor: 'gray',
                    padding: '2rem',
                    borderRadius: '1rem'
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                {/* Аватар с возможностью загрузки */}
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Avatar
                        src={avatarPreview || undefined}
                        sx={{ width: 100, height: 100 }}
                    />
                    <Box display="flex" gap={1}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCamera />}
                            size="small"
                        >
                            Upload
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </Button>
                        {avatarPreview && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={handleAvatarRemove}
                            >
                                Remove
                            </Button>
                        )}
                    </Box>
                </Box>

                <TextField
                    label="Email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                />
                <TextField
                    label="Full Name"
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    required
                />
                <TextField
                    label="Role"
                    select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    required
                >
                    <MenuItem value="ADMIN">Администратор</MenuItem>
                    <MenuItem value="EDIT">Редактор</MenuItem>
                    <MenuItem value="READ">Читатель</MenuItem>
                </TextField>
                <TextField
                    label="Phone"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    required
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
        </Layout>
    );
}