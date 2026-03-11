import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUrl } from '../../api/urlService';

export const useDeleteUrlMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteUrl(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
    });
};
