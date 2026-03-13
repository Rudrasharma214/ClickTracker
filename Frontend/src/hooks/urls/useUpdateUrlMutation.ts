import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUrl } from '../../services/urlService';
import type { UpdateUrlPayload } from '../../types/url.types';

export const useUpdateUrlMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateUrlPayload }) =>
            updateUrl(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
    });
};
