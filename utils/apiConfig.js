// Configurations for the API
const API_CONFIG = {
    // Base URL for the API - relative paths for Next.js
    baseURL: process.env.DB_HOST || (typeof window !== 'undefined' ? window.location.origin : ''),
    
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
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
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