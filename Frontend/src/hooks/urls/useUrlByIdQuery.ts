import { useQuery } from '@tanstack/react-query';
import { getUrlById } from '../../services/urlService';

export const useUrlByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['urls', id],
        queryFn: () => getUrlById(id).then((res) => res.data.data!),
        enabled: !!id,
    });
};
