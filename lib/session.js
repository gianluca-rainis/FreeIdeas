import { getIronSession } from 'iron-session';
import { query } from './db_connection';

const cookieDomain = process.env.NODE_ENV==='production'?(process.env.COOKIE_DOMAIN || undefined):undefined;

export const sessionOptions = {
    cookieName: 'freeideas-session',
    password: process.env.SECRET_COOKIE_PASSWORD,
    ttl: 60 * 60 * 24,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        domain: cookieDomain,
    },
};

export async function getSession(req, res, options = sessionOptions) {
    const session = await getIronSession(req, res, options);

    function invalidateSession() {
        for (const key of Object.keys(session)) {
            delete session[key];
        }

        return session;
    }

    if (session.account) {
        const accounts = await query(
            'SELECT sessionVersion FROM accounts WHERE id=?;',
            [session.account.id]
        );

        if (accounts.length === 0
            || Number(accounts[0].sessionVersion) !== Number(session.account.sessionVersion || 0)) {
            return invalidateSession();
        }
    }

    if (session.administrator) {
        const administrators = await query(
            'SELECT sessionVersion FROM reservedareaaccounts WHERE id=?;',
            [session.administrator.id]
        );

        if (administrators.length === 0
            || Number(administrators[0].sessionVersion) !== Number(session.administrator.sessionVersion || 0)) {
            return invalidateSession();
        }
    }

    return session;
}