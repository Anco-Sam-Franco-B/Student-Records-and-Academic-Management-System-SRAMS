import express from "express";
import pool from "../config/db.js";
import path from "path";

const BackupRouter = express.Router();

BackupRouter.get("/", async (req, res) => {

    const result =
        await pool.query(
            `
        SELECT *
        FROM database_backups
        ORDER BY created_at DESC
        `
        );


    res.json(
        result.rows
    );

});


BackupRouter.get("/download/:id",async (req, res) => {
    const result =await pool.query(`SELECT file_path,file_name FROM database_backups WHERE id=$1`,[req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404)
                .json({
                    message: "Backup not found"
                });
        }

        const backup =result.rows[0];
        res.download(path.resolve(backup.file_path),backup.file_name);
});


export default BackupRouter;