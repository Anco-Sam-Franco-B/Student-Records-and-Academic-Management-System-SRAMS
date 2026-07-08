import fs from "fs/promises";
import path from "path";
import pool from "../config/db.js";
import logger from "../config/logger.js";

export async function initializeDatabase() {

    try {

        logger.info(
            "Checking database connection..."
        );

        await pool.query(
            "SELECT NOW()"
        );

        logger.info(
            "Database connected"
        );

        const schemaPath =
            path.join(
                process.cwd(),
                "database",
                "schema.sql"
            );

        const schema =
            await fs.readFile(
                schemaPath,
                "utf8"
            );

        logger.info(
            "Loading database schema..."
        );

        await pool.query(schema);

        logger.info(
            "Database schema loaded successfully"
        );
    }

    catch (error) {
        logger.error(
            "Database initialization failed",
            {
                error: error.message
            }
        );
        throw error;
    }
}