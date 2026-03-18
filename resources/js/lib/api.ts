import { router } from '@inertiajs/react';
import axios from 'axios';

/**
 * Common API Utilities
 */

// Example helper for Inertia Post calls
export const apiPost = (
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    options = {},
) => {
    return router.post(url, data, {
        preserveScroll: true,
        ...options,
    });
};

export const apiPut = (
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    options = {},
) => {
    return router.put(url, data, {
        preserveScroll: true,
        ...options,
    });
};

export const apiDelete = (url: string, options = {}) => {
    return router.delete(url, {
        preserveScroll: true,
        ...options,
    });
};

// Raw Axios helpers for background / stateful API calls that shouldn't reload Inertia props
export const fetchApi = async <T>(url: string): Promise<T> => {
    const response = await axios.get<T>(url);
    return response.data;
};
