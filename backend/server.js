import express from "express";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { constants } from "fs";
import StartupLoader from "./utils/startupLoader.js";
import { startCronJobs } from "./cron/index.js";
import jwt from "jsonwebtoken";
import transporter from "./config/mail.js";
import logger from "./config/logger.js";
import { sendStartupNotification } from "./utils/startupNotification.js";
import { initializeDatabase } from "./database/initDatabase.js";
import pool from "./config/db.js";
import "./cron/databaseBackup.js";
import sramsRoutes from "./routes/index.js";
import cors from 'cors'
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const loader = new StartupLoader();

const strictCorsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],      // Block unapproved HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],       // Define explicit headers
    credentials: true,
    withCredentials:true,                                       // Allow cookies/auth sessions
};

loader.add("Loading Environment Variables", async () => {
    if (!process.env.PORT)
        throw new Error("PORT missing");
    if (!process.env.DATABASE_URL)
        throw new Error("DATABASE_URL missing");

});
loader.add("Checking PostgreSQL Connection", async () => {
    await pool.query("SELECT NOW()");
});
loader.add("Initializing Database Schema", async () =>{
    await initializeDatabase();
})
loader.add("Loading Middleware", async () => {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    app.use(cors(strictCorsOptions))
    app.use(cookieParser())
});
loader.add("Loading Routes", async () => {
    app.get("/", (req, res) => {
        res.send("SRAMS API Running");
    });
    app.use('/api/v1', sramsRoutes);
});
loader.add("Checking Upload Folder", async () => {
    //Create the folder if it doesn't exist
    const uploadPath = path.join(process.cwd(), "uploads");

    try {
        await fs.access(uploadPath);
    } catch {
        await fs.mkdir(uploadPath, { recursive: true });
    }
    //Verify write permissions
    await fs.mkdir(uploadPath, {
        recursive: true,
    });

    await fs.access(
        uploadPath,
        constants.W_OK
    );
});
loader.add("Checking SMTP Server", async () => {

    if (
        !process.env.SMTP_HOST ||
        !process.env.SMTP_PORT ||
        !process.env.SMTP_EMAIL ||
        !process.env.SMTP_PASSWORD
    ) {
        throw new Error("SMTP configuration is incomplete.");
    }

    await transporter.verify();

});
loader.add("Testing Email Service", async () => {

    await transporter.verify();

    if (process.env.NODE_ENV === "development") {

        await sendStartupNotification()

    }

});
loader.add("Checking Upload Directory", async () => {
    const uploadDir = path.join(process.cwd(), "uploads");

    // Create the directory if it doesn't exist
    await fs.mkdir(uploadDir, {
        recursive: true,
    });

    // Verify it exists and is writable
    await fs.access(uploadDir, constants.W_OK);
});
loader.add("Loading Winston Logger", async () => {
    if (!logger) {
        throw new Error("Winston logger is not initialized.");
    }

    logger.info("========================================");
    logger.info("SRAMS Logger Initialized");
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Started At: ${new Date().toISOString()}`);
    logger.info("========================================");

});
loader.add("Loading Authentication", async () => {

    const required = [
        "JWT_SECRET",
        "JWT_EXPIRES_IN",
        "REFRESH_TOKEN_SECRET",
        "REFRESH_TOKEN_EXPIRES_IN",
    ];

    for (const env of required) {
        if (!process.env[env]) {
            throw new Error(`${env} is missing in .env`);
        }
    }

    const token = jwt.sign(
        { id: 1 },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );

    jwt.verify(token, process.env.JWT_SECRET);
});
loader.add("Loading Scheduler", async () => {
    startCronJobs();
});
loader.add("Starting HTTP Server", async () => {
    await new Promise((resolve) => {
        app.listen(process.env.PORT, () => {
            resolve();
        });
    });
});

await loader.run();