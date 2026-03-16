import type { AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';
import type { LoginPayload, SignupPayload, AuthResponse } from '../types/auth.types';

export const signup = (payload: SignupPayload): Promise<AxiosResponse<AuthResponse>> => {
    return axiosInstance.post('/api/auth/signup', payload);
};

export const login = (payload: LoginPayload): Promise<AxiosResponse<AuthResponse>> => {
    return axiosInstance.post('/api/auth/login', payload);
};

export const logout = (): Promise<AxiosResponse<AuthResponse>> => {
    return axiosInstance.post('/api/auth/logout');
};

export const refreshToken = (): Promise<AxiosResponse<AuthResponse>> => {
    return axiosInstance.post('/api/auth/refresh-token');
};
