/* import mysql from 'mysql2/promise'; */
import { createClient } from "@libsql/client";

export async function query(sql, values) {
    const conn = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    /* const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }); */

    // const [results] = await conn.execute(sql, values);
    const results = await conn.execute(sql, values);
    
    // await conn.end();
    await conn.close();

    const rows = results.rows || [];

    if (results.lastInsertRowid !== undefined && results.lastInsertRowid !== null) {
        rows.insertId = Number(results.lastInsertRowid);
    }

    if (results.rowsAffected !== undefined && results.rowsAffected !== null) {
        rows.rowsAffected = Number(results.rowsAffected);
    }

    return rows;
}