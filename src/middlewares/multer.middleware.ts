import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config stockage (ici en local dans /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/arbres");
    // crée le dossier si inexistant
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, "uploads/arbres"); // dossier où stocker
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// File filter pour n’accepter que les images
const fileFilter = (req, file, cb) => {
  // MIME types autorisés
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];

  // Extensions autorisées
  const allowedExts = [".jpeg", ".jpg", ".png", ".gif", ".webp"];

  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(fileExt)) {
    cb(null, true); // accepte le fichier
  } else {
    cb(new Error(`Fichier non autorisé: ${file.originalname}`), false); // refuse le fichier
  }
};

export const upload = multer({ storage, fileFilter });
