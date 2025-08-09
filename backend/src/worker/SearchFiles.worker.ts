import { promises as fs, Stats } from "fs"; // <-- Corrected: Import Stats explicitly
import * as path from "path";
import { parentPort } from "worker_threads"; // Required for worker communication

/**
 * Recursively searches a directory for files and folders matching specified file types.
 * This function is included here for completeness, assuming it's part of the worker's scope
 * or imported from another utility file.
 *
 * @param {string} startPath The starting directory path to search from.
 * @param {string[]} fileTypes An array of file extensions (e.g., ['.mp4', '.pdf', '.mp3']) to search for.
 * @returns {Promise<{files: string[], folders: string[]}>} A promise that resolves to an object
 * containing two arrays: 'files' (paths of found files) and 'folders' (paths of found folders).
 */
async function searchFileSystem(
  startPath: string,
  fileTypes: string[]
): Promise<{ files: string[]; folders: string[] }> {
  const foundFiles: string[] = [];
  const foundFolders: string[] = [];

  const normalizedFileTypes: string[] = fileTypes.map((type) =>
    type.startsWith(".") ? type : `.${type}`
  );

  async function traverseDirectory(currentPath: string): Promise<void> {
    try {
      const items = await fs.readdir(currentPath);

      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        let stats: Stats; // <-- Now 'Stats' is correctly typed
        try {
          stats = await fs.stat(itemPath);
        } catch (statErr: any) {
          console.warn(
            `Warning: Could not access ${itemPath}: ${statErr.message}`
          );
          continue;
        }

        if (stats.isDirectory()) {
          foundFolders.push(itemPath);
          await traverseDirectory(itemPath);
        } else if (stats.isFile()) {
          const fileExtension = path.extname(itemPath).toLowerCase();
          if (normalizedFileTypes.includes(fileExtension)) {
            foundFiles.push(itemPath);
          }
        }
      }
    } catch (dirReadErr: any) {
      console.error(
        `Error reading directory ${currentPath}: ${dirReadErr.message}`
      );
    }
  }

  await traverseDirectory(startPath);
  return { files: foundFiles, folders: foundFolders };
}

// This is the main function that Bree will execute in the worker thread.
async function runSearchJob() {
  console.log(
    `[Worker] Starting file search job at ${new Date().toLocaleString()}`
  );

  const searchDirectory = "./test_files"; // ⬅️ IMPORTANT: Set your actual target directory
  const typesToFind = [".mp4", "pdf", ".mp3", ".txt"]; // ⬅️ IMPORTANT: Set your desired file types

  try {
    // You might want to remove the dummy file creation in a real production setup
    // For demonstration, let's ensure the test_files exist before searching
    await fs.mkdir(searchDirectory, { recursive: true });
    await fs.mkdir(path.join(searchDirectory, "videos"), { recursive: true });
    await fs.mkdir(path.join(searchDirectory, "documents"), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(searchDirectory, "report.pdf"),
      "This is a PDF content."
    );
    await fs.writeFile(
      path.join(searchDirectory, "videos", "holiday.mp4"),
      "Video content."
    );
    await fs.writeFile(
      path.join(searchDirectory, "videos", "song.mp3"),
      "Audio content."
    );

    const results = await searchFileSystem(searchDirectory, typesToFind);

    console.log(
      `[Worker] Search completed. Found ${results.files.length} files and ${results.folders.length} folders.`
    );
    console.log("[Worker] Found Files:", results.files);
    // You can add logic here to save results, send notifications, etc.

    // Send a message back to the main thread (optional)
    if (parentPort) {
      parentPort.postMessage({
        status: "completed",
        filesFound: results.files.length,
      });
    }
  } catch (error: any) {
    console.error(`[Worker] Error during file search job: ${error.message}`);
    if (parentPort) {
      parentPort.postMessage({ status: "error", error: error.message });
    }
  } finally {
    console.log(
      `[Worker] File search job finished at ${new Date().toLocaleString()}`
    );
  }
}

// When this worker script is run, execute the job function.
// Bree handles calling this.
runSearchJob();
