import { sendEmail } from "../services/emailService.js";
import dotenv from 'dotenv'

dotenv.config()


export async function sendStartupNotification(){

    const memory =
    process.memoryUsage();


    await sendEmail({
        to:
        process.env.SMTP_EMAIL,
        subject:
        "🚀 SRAMS Server Started Successfully",
        template:
        "startup",
        data:{
            environment:
            process.env.NODE_ENV || "development",
            version:
            process.env.APP_VERSION || "1.0.0",
            region:
            process.env.SERVER_REGION || "Kigali Cloud",
            deploymentId:
            `DEP-${crypto.randomUUID()}`,
            startedAt:
            new Date().toISOString(),
            uptime:
            `${Math.floor(process.uptime())} seconds`,
            memory:
            `${(
                memory.heapUsed /
                1024 /
                1024
            ).toFixed(2)} MB`,
            requests:
            "0",
            dashboardUrl:
            process.env.CLIENT_URL

        }

    });

}