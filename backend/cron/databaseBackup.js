import cron from "node-cron";
import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();
const backupFolder = "./backups";
fs.ensureDirSync(backupFolder);
async function createBackup() {

    const filename =
        `srams_backup_${Date.now()}.sql`;

    const filepath =
        path.join(
            backupFolder,
            filename
        );

    const command = `
    pg_dump 
    -h ${process.env.DB_HOST}
    -p ${process.env.DB_PORT}
    -U ${process.env.DB_USER}
    -d ${process.env.DB_NAME}
    -f "${filepath}"
    `;

    exec(
        command,
        {
            env: {
                ...process.env,
                PGPASSWORD:
                    process.env.DB_PASSWORD
            }
        },

        async (error) => {
            if (error) {

                console.log(
                    "Backup failed",
                    error
                );

                return;
            }

            const stats =
                fs.statSync(filepath);
            await pool.query(
                `
            INSERT INTO database_backups
            (
                file_name,
                file_path,
                file_size
            )
            VALUES($1,$2,$3)
            `,
                [
                    filename,
                    filepath,
                    stats.size
                ]);
            console.log(
                "Backup saved:",
                filename
            );
        }
    );

}

// Every day 2 AM
cron.schedule(
    "0 2 * * *",
    () => {
        createBackup();
    }
);

export default createBackup;