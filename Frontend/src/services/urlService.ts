import type { AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';
import type { ShortenPayload, UpdateUrlPayload, Url, UrlsQueryParams } from '../types/url.types';

interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data?: T;
}

export const shortenUrl = (payload: ShortenPayload): Promise<AxiosResponse<ApiResponse<Url>>> => {
    return axiosInstance.post('/api/urls/shorten', payload);
};

export const getUrls = (
    params?: UrlsQueryParams,
): Promise<AxiosResponse<ApiResponse<{ urls: Url[]; total: number }>>> => {
    return axiosInstance.get('/api/urls', { params });
};

export const getUrlById = (id: string): Promise<AxiosResponse<ApiResponse<Url>>> => {
    return axiosInstance.get(`/api/urls/${encodeURIComponent(id)}`);
};

export const updateUrl = (
    id: string,
    payload: UpdateUrlPayload,
): Promise<AxiosResponse<ApiResponse<Url>>> => {
    return axiosInstance.patch(`/api/urls/${encodeURIComponent(id)}`, payload);
};

export const deleteUrl = (id: string): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axiosInstance.delete(`/api/urls/${encodeURIComponent(id)}`);
};
