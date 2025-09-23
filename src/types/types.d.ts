
declare module "express-serve-static-core" {
  interface Request {
    files?: Express.Multer.File[];
    // ou si tu utilises upload.fields(...):
    // files?: { [fieldname: string]: Express.Multer.File[] };
  }
}