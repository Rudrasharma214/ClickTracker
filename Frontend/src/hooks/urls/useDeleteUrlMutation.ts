import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUrl } from '../../services/urlService';

export const useDeleteUrlMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteUrl(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
    });
};
