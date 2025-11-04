import { getAllProductsbyUserId } from '@/controller/productController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminRole, authentication } from '@/middlewares/authentication';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(authentication, adminRole, getAllProductsbyUserId);

export const config = {
    api: {
        bodyParser: false, // Wajib disable bodyParser bawaan kalau pakai multer
    },
};

export default router.handler();