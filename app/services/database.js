import pg from "pg";

const client = new pg.Pool({
    connectionString : process.env.DATABASE_URL,
    ssl : {
        rejectUnauthorized : true
    }
});
client.connect();

export {client};