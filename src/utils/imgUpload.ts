import fs from "fs";
import { z } from "zod";
import path from "path";
import {
  productSchemaForCreate,
  productSchemaForUpdate,
} from "../schemas/product.schema.js";

export function ImgCreatePath(
  data: z.infer<typeof productSchemaForCreate>,
  files?: Express.Multer.File[]
) {
  return {
    ...data,
    image_urls: files ? files.map((f) => f.path) : data.image_urls,
  };
}

// Update
export function ImgUpdatePath(
  existing: { image_urls: string[] },
  data: z.infer<typeof productSchemaForUpdate>,
  files?: Express.Multer.File[]
) {
  // replace_images booléén qui a "true" remplace les images et a false "ajoute les images"
  const { replace_images, ...rest } = data;

  const updated = { ...rest };

  // Gestion des images uploadées dans l'update
  const newImagePaths = files ? files.map((f) => f.path) : [];

  if (newImagePaths.length > 0) {
    if (replace_images) {
      if (newImagePaths.length > 3) {
        throw new Error("Vous ne pouvez uploader que 3 images maximum");
      }
      updated.image_urls = newImagePaths;
    } else {
      if (existing.image_urls.length + newImagePaths.length > 3) {
        throw new Error(
          `Vous pouvez seulement ajouter ${
            3 - existing.image_urls.length
          } image(s)`
        );
      }
      updated.image_urls = [...existing.image_urls, ...newImagePaths];
    }
  }

  return updated;
}

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
