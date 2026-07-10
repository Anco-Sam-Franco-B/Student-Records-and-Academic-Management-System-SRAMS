import cron from "node-cron";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const backupFolder = path.resolve("backups");

fs.ensureDirSync(backupFolder);


// CREATE BACKUP
async function createBackup() {

    try {

        const tables = [
            "roles",
            "users",
            "teachers",
            "students",
            "classes",
            "subjects",
            "marks",
            "attendance"
        ];


        const backup = {};


        for (const table of tables) {

            const result = await pool.query(
                `SELECT * FROM ${table}`
            );

            backup[table] = result.rows;

        }


        const filename =
            `srams_backup_${Date.now()}.json`;


        const filepath =
            path.join(
                backupFolder,
                filename
            );


        await fs.writeJson(
            filepath,
            backup,
            {
                spaces: 2
            }
        );


        const stats =
            await fs.stat(filepath);


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
            ]
        );


        return {
            filename,
            filepath,
            size: stats.size
        };


    } catch(error){

        console.error(
            "Backup failed:",
            error
        );

        throw error;

    }

}



// RESTORE BACKUP
export async function restoreBackup(filepath){

    const backup =
        await fs.readJson(filepath);


    const tables = Object.keys(backup);


    await pool.query("BEGIN");


    try {


        for(const table of tables){


            await pool.query(
                `
                TRUNCATE TABLE ${table}
                RESTART IDENTITY
                CASCADE
                `
            );


            for(const row of backup[table]){


                const columns =
                    Object.keys(row);


                const values =
                    Object.values(row);


                const placeholders =
                    columns
                    .map(
                        (_,index)=>`$${index+1}`
                    )
                    .join(",");


                await pool.query(
                    `
                    INSERT INTO ${table}
                    (${columns.join(",")})
                    VALUES(${placeholders})
                    `,
                    values
                );


            }

        }


        await pool.query("COMMIT");


    } catch(error){


        await pool.query("ROLLBACK");

        throw error;

    }

}



// Automatic backup
cron.schedule(
    "0 2 * * *",
    async()=>{

        console.log(
            "Running scheduled backup..."
        );

        await createBackup();

    }
);



export default createBackup;