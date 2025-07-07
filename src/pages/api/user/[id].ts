import { deleteUser, getUserbyId, updateUser } from '@/controller/userController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminRole, authentication } from '@/middlewares/authentication';
import { adaptMiddleware } from '@/middlewares/adaptMiddleware';
import upload from '@/middlewares/multer';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(authentication, getUserbyId);
router.put(adaptMiddleware(upload.single('imageProfile')), authentication, updateUser)
router.delete(authentication, adminRole, deleteUser)

export const config = {
    api: {
        bodyParser: false, // Wajib disable bodyParser bawaan kalau pakai multer
    },
};

export default router.handler();