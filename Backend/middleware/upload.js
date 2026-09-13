import multer from "multer";
import path from "path";
import fs from "fs";

/* Ensure uploads folder exists */
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* Storage config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1e9
      ) +
      path.extname(
        file.originalname
      );

    cb(null, uniqueName);
  }
});

/* File filter */
const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes =
    /jpeg|jpg|png|webp|svg/;

  const extname =
    allowedTypes.test(
      path
        .extname(
          file.originalname
        )
        .toLowerCase()
    );

  const mimetype =
    allowedTypes.test(
      file.mimetype
    );

  if (
    extname &&
    mimetype
  ) {
    return cb(
      null,
      true
    );
  }

  cb(
    new Error(
      "Only images are allowed (jpg, png, webp)"
    )
  );
};

/* Multer instance */
const upload =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize:
        5 *
        1024 *
        1024 // 5MB
    }
  });

export default upload;