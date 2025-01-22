import { Request } from "express";
import multer, { StorageEngine } from "multer";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import fs from "fs";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueFilename = `${uuidv4()}.${
      mime.extension(file.mimetype) || "bin"
    }`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    req.fileValidationError = "Only image files are allowed!";
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
