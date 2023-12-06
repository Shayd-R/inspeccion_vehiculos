import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '', // Utiliza una cadena vacía si DB_PASSWORD no está definido
    database: process.env.DB_DATABASE
});

export default pool;
