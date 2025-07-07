import type { NextApiRequest, NextApiResponse } from 'next';
import type { RequestHandler } from 'express';
import type { NextHandler } from 'next-connect';

export function adaptMiddleware(middleware: RequestHandler) {
  return (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    middleware(req as any, res as any, next);
  };
}
