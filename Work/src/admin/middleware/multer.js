import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/faculty";
    console.log("Multer Destination - Field:", file.fieldname);
    if (!fs.existsSync(dir)) {
      console.log("Multer Destination - Creating dir:", dir);
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    console.log("Multer Filename - saving as:", fileName);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("Multer FileFilter - Mimetype:", file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    console.warn("Multer FileFilter - Rejected mimetype:", file.mimetype);
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});
