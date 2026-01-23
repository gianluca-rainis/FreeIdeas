import session from 'express-session';
import { createClient } from 'redis';

let sessionMiddleware = null;

class MemoryStore extends session.Store {
    constructor() {
        super();
        this.sessions = {};
    }

    get(sid, callback) {
        process.nextTick(() => {
            callback(null, this.sessions[sid]);
        });
    }

    set(sid, sess, callback) {
        this.sessions[sid] = sess;
        callback();
    }

    destroy(sid, callback) {
        delete this.sessions[sid];
        callback();
    }
}

export async function getSessionMiddleware() {
    if (sessionMiddleware) {
        return sessionMiddleware;
    }
    
    try {
        let store;

        if (process.env.NODE_ENV === 'production') {
            try {
                const RedisStore = (await import('connect-redis')).default;
                const redisClient = createClient({
                    url: process.env.REDIS_URL || 'redis://localhost:6379'
                });
                
                await redisClient.connect();
                console.log('Connected to Redis');
                
                store = new RedisStore({
                    client: redisClient,
                    prefix: 'freeideas:'
                });
            } catch (error) {
                console.warn('Redis not available, falling back to memory store');
                store = new MemoryStore();
            }
        }
        else {
            console.log('Using in-memory session store (development)');
            store = new MemoryStore();
        }
        
        sessionMiddleware = session({
            store,
            secret: process.env.SECRET_COOKIE_PASSWORD || 'default-secret-change-me',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24 * 7
            }
        });
        
        return sessionMiddleware;
    } catch (error) {
        console.error('Error initializing session middleware: ', error.message);
        throw error;
    }
}