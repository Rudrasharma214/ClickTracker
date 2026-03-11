import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { refreshToken as refreshTokenApi } from '../api/authService';
import { setAccessToken } from '../api/axiosInstance';
import type { User } from '../types/auth.types';

interface AuthContextValue {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    updateAuth: (user: User | null, token: string | null) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const { data } = await refreshTokenApi();
                const payload = data.data;
                if (payload?.accessToken) {
                    setToken(payload.accessToken);
                    setAccessToken(payload.accessToken);
                    setUser({
                        id: payload.user!.id,
                        name: payload.user!.name,
                        email: payload.user!.email,
                        createdAt: payload.user!.createdAt,
                    });
                }
            } catch {
                setToken(null);
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const updateAuth = (newUser: User | null, token: string | null) => {
        setUser(newUser);
        setToken(token);
        setAccessToken(token);
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated: !!user && !!accessToken,
                isLoading,
                updateAuth,
                clearAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
