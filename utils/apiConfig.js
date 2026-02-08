// Configurations for the API
const API_CONFIG = {
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

export function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    
    return '';
}

// Helper function to build the URL
export function getApiUrl(endpoint) {
    // If endpoint is an URL, return it
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        return endpoint;
    }
    
    const baseURL = getBaseUrl();
    
    return `${baseURL}${API_CONFIG.endpoints[endpoint] || endpoint}`;
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
        
        const data = await response.json();

        return data;
    } catch (error) {
        // Don't log AbortErrors (intentional errors)
        if (error.name !== 'AbortError') {
            console.error(`API call error for ${endpoint}:`, error);
        }

        throw error;
    }
}

export default API_CONFIG;