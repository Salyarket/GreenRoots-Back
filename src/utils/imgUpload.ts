import fs from "fs";
import path from "path";

export async function deleteFiles(paths: string[]) {
  await Promise.all(
    paths.map(async (filePath) => {
      try {
        const fullPath = path.resolve(filePath);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
        }
      } catch (err) {
        console.error(`Failed to delete file ${filePath}:`, err);
      }
    })
  );
}