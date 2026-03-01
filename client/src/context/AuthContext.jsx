import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.user);
        } catch {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = (token) => {
        localStorage.setItem('token', token);
        fetchUser();
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // ignore
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (data) => {
        try {
            const response = await api.put('/auth/profile', data);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
