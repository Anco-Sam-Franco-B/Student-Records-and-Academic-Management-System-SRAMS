import cliProgress from "cli-progress";
import chalk from "chalk";

class StartupLoader {
    constructor() {
        this.steps = [];
        this.bar = new cliProgress.SingleBar(
            {
                format:
                    chalk.cyan("Starting SRAMS") +
                    " |{bar}| {percentage}% | {value}/{total} | {task}",
                barCompleteChar: "█",
                barIncompleteChar: "░",
                hideCursor: true,
                clearOnComplete: true,
            },
            cliProgress.Presets.shades_classic
        );
    }

    add(task, action) {
        this.steps.push({ task, action });
    }

    async run() {
        this.bar.start(this.steps.length, 0, {
            task: "Initializing...",
        });

        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];

            this.bar.update(i, {
                task: step.task,
            });

            try {
                await step.action();

                this.bar.increment({
                    task: `✔ ${step.task}`,
                });

            } catch (error) {
                this.bar.stop();

                console.log(
                    chalk.red(`\n✖ ${step.task} Failed`)
                );

                console.error(chalk.red(error.message));

                process.exit(1);
            }
        }

        this.bar.stop();

        console.log(
            chalk.green.bold("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        );

        console.log(
            chalk.cyan("✔ All startup checks completed")
        );

        console.log(
            chalk.yellow("✔ Server is Ready")
        );

        console.log(
            chalk.blue("🚀 http://localhost:" + process.env.PORT)
        );

        console.log(
            chalk.green.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
        );
    }
}

export default StartupLoader;