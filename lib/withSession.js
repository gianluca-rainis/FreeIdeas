import { getSessionMiddleware } from './session';

export function withSession(handler) {
    return async (req, res) => {
        try {
            const sessionMiddleware = await getSessionMiddleware();
            
            return new Promise((resolve, reject) => {
                sessionMiddleware(req, res, (err) => {
                    if (err) {
                        console.error('Session middleware error: ', err);
                        reject(err);
                    }
                    else {
                        resolve(handler(req, res));
                    }
                });
            });
        } catch (error) {
            console.error('Error in withSession:', error);
            res.status(500).json({ error: 'Session initialization failed' });
        }
    };
}