import { addUser } from '@/controller/userController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import upload from '@/middlewares/multer'
import { adaptMiddleware } from '@/middlewares/adaptMiddleware';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(adaptMiddleware(upload.single('imageProfile')), addUser);

export const config = {
  api: {
    bodyParser: false, // Wajib disable bodyParser bawaan kalau pakai multer
  },
};
export default router.handler();