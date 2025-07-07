import { getAllUsers } from '@/controller/userController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authentication, adminRole } from '@/middlewares/authentication';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(authentication, adminRole, getAllUsers);

export default router.handler();