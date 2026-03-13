import { useMutation } from '@tanstack/react-query';
import { login, refreshToken } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import type { LoginPayload } from '../../types/auth.types';

export const useLoginMutation = () => {
    const { updateAuth } = useAuth();

    return useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
        onSuccess: async () => {
            // Backend returns data: null on login — tokens are set as httpOnly cookies.
            // Call refresh-token to get the new access token + user info.
            const { data } = await refreshToken();
            const payload = data.data;
            if (payload?.accessToken) {
                updateAuth(
                    {
                        id: payload.user!.id,
                        name: payload.user!.name,
                        email: payload.user!.email,
                        createdAt: payload.user!.createdAt,
                    },
                    payload.accessToken,
                );
            }
        },
    });
};
