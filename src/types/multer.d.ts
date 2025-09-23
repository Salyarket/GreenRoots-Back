declare module "multer" {
  import { Request } from "express";

  interface MulterFile {
    /** Nom du champ dans le formulaire */
    fieldname: string;
    /** Nom du fichier sur le PC du client */
    originalname: string;
    /** Encodage */
    encoding: string;
    /** Type MIME */
    mimetype: string;
    /** Taille du fichier en octets */
    size: number;
    /** Nom généré dans le dossier de destination */
    filename: string;
    /** Chemin complet sur le disque */
    path: string;
    /** Buffer si memoryStorage */
    buffer: Buffer;
  }

  interface StorageEngine {
    _handleFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error?: any, info?: Partial<MulterFile>) => void
    ): void;

    _removeFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null) => void
    ): void;
  }

  interface MulterOptions {
    dest?: string;
    storage?: StorageEngine;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      parts?: number;
      headerPairs?: number;
    };
    preservePath?: boolean;
    fileFilter?(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, acceptFile: boolean) => void
    ): void;
  }

  interface Multer {
    (options?: MulterOptions): MulterInstance;
    diskStorage(options: {
      destination?:
        | string
        | ((
            req: Request,
            file: Express.Multer.File,
            cb: (error: Error | null, destination: string) => void
          ) => void);
      filename?(
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
      ): void;
    }): StorageEngine;
    memoryStorage(): StorageEngine;
  }

  interface MulterInstance {
    single(fieldname: string): any;
    array(fieldname: string, maxCount?: number): any;
    fields(fields: { name: string; maxCount?: number }[]): any;
    none(): any;
    any(): any;
  }

  const multer: Multer;
  export = multer;
}

declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}
