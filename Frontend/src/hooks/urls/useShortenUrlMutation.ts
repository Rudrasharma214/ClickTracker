import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shortenUrl } from '../../services/urlService';
import type { ShortenPayload } from '../../types/url.types';

export const useShortenUrlMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ShortenPayload) => shortenUrl(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
    });
};
