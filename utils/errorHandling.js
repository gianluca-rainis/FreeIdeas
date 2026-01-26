// Error types
export class APIError extends Error {
    constructor(message, endpoint, statusCode = null) {
        super(message);
        this.name = 'APIError';
        this.endpoint = endpoint;
        this.statusCode = statusCode;
    }
}

export class AuthenticationError extends Error {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends Error {
    constructor(message, field = null) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

// Main handle error
export function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}: `, error);
    
    if (error instanceof APIError) {
        return {
            type: 'api',
            message: error.message,
            endpoint: error.endpoint,
            statusCode: error.statusCode
        };
    }
    
    if (error instanceof AuthenticationError) {
        return {
            type: 'auth',
            message: error.message
        };
    }
    
    if (error instanceof ValidationError) {
        return {
            type: 'validation',
            message: error.message,
            field: error.field
        };
    }
    
    // Generic error
    return {
        type: 'generic',
        message: error.message || 'An unexpected error occurred'
    };
}

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection problem. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    REQUIRED_FIELD: 'This field is required.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Helper for error messages
export function getUserFriendlyErrorMessage(error) {
    if (typeof error === 'string') {
        return error;
    }
    
    if (error.message) {
        // If is a known error
        const knownErrors = {
            'Failed to fetch': ERROR_MESSAGES.NETWORK_ERROR,
            'NetworkError': ERROR_MESSAGES.NETWORK_ERROR,
            'Invalid email or password': ERROR_MESSAGES.INVALID_CREDENTIALS,
            'Insert a valid email': ERROR_MESSAGES.INVALID_EMAIL
        };
        
        for (const [key, message] of Object.entries(knownErrors)) {
            if (error.message.includes(key)) {
                return message;
            }
        }
        
        return error.message;
    }
    
    return ERROR_MESSAGES.UNKNOWN_ERROR;
}