import BreeScheduler from "bree";
import { interval } from "drizzle-orm/pg-core";

const bree = new BreeScheduler({
  root: "./", // directory for workers

  jobs: [
    {
      name: "file-search-job",
      path: "SearchFiles.worker.ts",
      timeout: false,
      interval: "10m", // "3h",
    },
  ],

  errorHandler: (error, workerMetadata) => {
    if (workerMetadata?.name) {
      console.error(`[Main] Error in worker ${workerMetadata.name}:`, error);
    } else {
      console.error("[Main] Bree error:", error);
    }
  },
});
bree.on("worker created", (name) => {
  console.log("worker created", name);
  console.log(bree.workers.get(name));
});

bree.on("worker deleted", (name) => {
  console.log("worker deleted", name);
  console.log(!bree.workers.has(name));
});

async function startScheduler() {
  try {
    await bree.start();
    console.log(
      "Bree scheduler started successfully. Jobs will run as scheduled."
    );
    // Optionally, list active jobs
    console.log(
      "Active Bree jobs:",
      bree.config.jobs.map((job) => job.name)
    );
  } catch (error) {
    console.error("Failed to start Bree scheduler:", error);
  }
}

// Start the scheduler when your application initializes
startScheduler();

// Optional: Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT signal received: Shutting down Bree...");
  await bree.stop();
  console.log("Bree stopped. Exiting.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: Shutting down Bree...");
  await bree.stop();
  console.log("Bree stopped. Exiting.");
  process.exit(0);
});
