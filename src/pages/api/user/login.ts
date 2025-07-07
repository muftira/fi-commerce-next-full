import { loginUser } from '@/controller/userController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(loginUser)

export default router.handler();