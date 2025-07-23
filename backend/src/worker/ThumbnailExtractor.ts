import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export async function extractThumbnail(
  videoPath: string,
  outputDir: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName =
      path.basename(videoPath, path.extname(videoPath)) + "_thumb.jpg";
    const outputPath = path.join(outputDir, fileName);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    ffmpeg(videoPath)
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .screenshots({
        timestamps: ["00:00:01"], // 1 second into the video
        filename: fileName,
        folder: outputDir,
        size: "320x240", // You can change resolution here
      });
  });
}
