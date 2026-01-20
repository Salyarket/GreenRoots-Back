// declare module "slugify";

// global.d.ts ou un fichier .d.ts dédié

import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      body: any; // pour que req.body ne soit plus souligné
      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

declare module "slugify";
