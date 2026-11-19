import { createClient } from "@libsql/client";

let client;

function getClient() {
    if (!client) {
        client = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });
    }

    return client;
}

export async function query(sql, values) {
    const results = await getClient().execute(sql, values);

    const rows = results.rows || [];

    if (results.lastInsertRowid !== undefined && results.lastInsertRowid !== null) {
        rows.insertId = Number(results.lastInsertRowid);
    }

    if (results.rowsAffected !== undefined && results.rowsAffected !== null) {
        rows.rowsAffected = Number(results.rowsAffected);
    }

    return rows;
}