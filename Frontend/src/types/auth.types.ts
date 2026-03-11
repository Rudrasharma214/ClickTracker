export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    status: number;
    message: string;
    data?: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            createdAt: string;
        };
    };
}
