import { deleteProduct, getProductbyId, updateProduct } from '@/controller/productController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminRole, authentication } from '@/middlewares/authentication';
import { adaptMiddleware } from '@/middlewares/adaptMiddleware';
import upload from '@/middlewares/multer';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getProductbyId);
router.put(authentication, adminRole, adaptMiddleware(upload.array('imageProduct', 3)), updateProduct)
router.delete(authentication, adminRole, deleteProduct)

export const config = {
    api: {
        bodyParser: false, // Wajib disable bodyParser bawaan kalau pakai multer
    },
};

export default router.handler();