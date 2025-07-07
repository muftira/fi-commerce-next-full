import { errorResponse } from '@/utils/errorResponse';
import { ApiError } from '@/utils/response';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
import { JwtPayload } from '@/types'

export const authentication = (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: 'Invalid Token !!!',
                });
            } else {
                req.user = user as JwtPayload;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Invalid or Expired Token !!!',
        });
    }
};

export const adminRole = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    try {
        const user = req.user;

        if (!user) {
            throw new errorResponse("Unauthorized", 401);
        }

        if (user.role !== 'admin') {
            throw new errorResponse("you don't have permission to access this resource", 403);
        }

        next();
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};
