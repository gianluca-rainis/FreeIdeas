// Configurations for the API
const API_CONFIG = {
    // Base URL for the API - relative paths for Next.js
    baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
    
    // Endpoints API
    endpoints: {
        getSessionData: '/api/getSessionData',
        getRandomIdeaId: '/api/getRandomIdeaId',
        login: '/api/login',
        logout: '/api/logout',
        setNotificationAsRead: '/api/setNotificationAsRead',
        deleteNotification: '/api/deleteNotification',
        changePassword: '/api/changePassword'
    },
    
    // Default options for the fetch
    defaultOptions: {
        credentials: 'include'
    }
};

// Helper function to build the URL
export function getApiUrl(endpoint) {
    return `${API_CONFIG.baseURL}${API_CONFIG.endpoints[endpoint] || endpoint}`;
}

// Helper function for fetch with default configurations
export async function apiCall(endpoint, options = {}) {
    const url = getApiUrl(endpoint);

    const finalOptions = {
        ...API_CONFIG.defaultOptions,
        ...options
    };
    
    // Add Content-Type only if not body: FormData
    if (!(options.body instanceof FormData)) {
        finalOptions.headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
    }
    
    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API call error for ${endpoint}:`, error);
        throw error;
    }
}

export default API_CONFIG;