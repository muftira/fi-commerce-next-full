import { getUserEmail } from '@/controller/userController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getUserEmail)

export default router.handler();