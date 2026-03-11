import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';

export const useLogoutMutation = () => {
    const { clearAuth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            clearAuth();
            queryClient.clear();
        },
    });
};
