import { useMutation } from '@tanstack/react-query';
import { signup } from '../../api/authService';
import type { SignupPayload } from '../../types/auth.types';

export const useSignupMutation = () => {
    return useMutation({
        mutationFn: (payload: SignupPayload) => signup(payload),
    });
};
