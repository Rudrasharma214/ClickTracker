import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';
import type { LoginPayload } from '../../types/auth.types';

export const useLoginMutation = () => {
    const { updateAuth } = useAuth();

    return useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
        onSuccess: (response) => {
            const data = response.data.data;
            if (data) {
                updateAuth(
                    { id: data.id, name: data.name, email: data.email, createdAt: data.createdAt },
                    data.accessToken ?? null,
                );
            }
        },
    });
};
