const cookieDomain = process.env.NODE_ENV==='production'?(process.env.COOKIE_DOMAIN || undefined):undefined;

export const sessionOptions = {
    cookieName: 'freeideas-session',
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: cookieDomain,
    },
};