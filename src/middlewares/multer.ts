import cloudinary from '../../config/cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: 'fi-commerce',
      format:
        file.mimetype === 'image/png'
          ? 'png'
          : file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'
          ? 'jpg'
          : 'jpg',
      public_id: new Date().toISOString() + '-' + file.originalname,
    };
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true); // File diterima
  } else {
    (cb as Function)(new Error('Unsupported File Format'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
