import cron from "node-cron";

export function startCronJobs() {

    if (!cron.validate("*/10 * * * *")) {
        throw new Error("Invalid cron expression.");
    }

    cron.schedule("*/10 * * * *", async () => {
        console.log("Attendance sync...");
    });

    cron.schedule("0 0 * * *", async () => {
        console.log("Automatic database backup...");
    });

    // Runs every day at midnight
    cron.schedule("0 0 * * *", () => {
        console.log("Running daily backup...");
    });

    // Every 10 minutes
    cron.schedule("*/10 * * * *", () => {
        console.log("Checking student attendance...");
    });

    // Every hour
    cron.schedule("0 * * * *", () => {
        console.log("Generating reports...");
    });

    console.log("Cron jobs initialized.");
    return true
}