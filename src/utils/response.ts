import type { NextApiResponse } from 'next';

export const successResponse = <T>(
    res: NextApiResponse,
    data: T,
    message = 'Success',
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const ApiError = <T>(
    res: NextApiResponse,
    message: T,
    statusCode = 500,
    error?: unknown
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error,
    });
};
