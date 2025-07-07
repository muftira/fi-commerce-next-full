import { forgotPassword } from '@/controller/userController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(forgotPassword)

export default router.handler();