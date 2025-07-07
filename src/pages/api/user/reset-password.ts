import { resetPassword } from '@/controller/userController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(resetPassword)

export default router.handler();