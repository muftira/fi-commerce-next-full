import { addProduct } from '@/controller/productController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminRole, authentication } from '@/middlewares/authentication';
import { adaptMiddleware } from '@/middlewares/adaptMiddleware';
import upload from '@/middlewares/multer';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(authentication, adminRole, adaptMiddleware(upload.array('imageProduct', 3)), addProduct);

export const config = {
    api: {
        bodyParser: false, // Wajib disable bodyParser bawaan kalau pakai multer
    },
};

export default router.handler();