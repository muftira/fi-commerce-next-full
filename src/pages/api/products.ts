import { getAllProducts } from '@/controller/productController';
import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getAllProducts);

export default router.handler();