import { useQuery } from '@tanstack/react-query';
import { getUrls } from '../../api/urlService';
import type { UrlsQueryParams } from '../../types/url.types';

export const useUrlsQuery = (params?: UrlsQueryParams) => {
    return useQuery({
        queryKey: ['urls', params],
        queryFn: () => getUrls(params).then((res) => res.data.data!),
    });
};
