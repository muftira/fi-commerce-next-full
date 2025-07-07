import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { ApiError, successResponse } from '@/utils/response';
import { errorResponse } from '@/utils/errorResponse';
import bcrypt from 'bcrypt';
import Validator from 'fastest-validator';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '@/services/emailService';

const v = new Validator();


export const getAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const users = await prisma.user.findMany(
        );
        if (users) {
            throw new errorResponse('User is not found', 401);
        }
        return successResponse(res, users, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};

export const getUserbyId = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!user) {
            throw new errorResponse('User is not found', 401);
        }

        return successResponse(res, user, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}

export const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { fullName, email, password, address, phone, roleName } = req.body;

        const checkUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

        const schema = {
            email: { type: 'email', optional: false },
            password: { type: 'string', min: 5, max: 255, optional: false },
        };
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        if (checkUser) {
            // validate Email
            if (checkUser.email == email.toLowerCase()) {
                if (req.file) {
                    const deletedImageUpload = cloudinary.uploader.destroy(req.file.filename);
                }
                throw new errorResponse('Email Already Exist', 401);
            } else {
                // Validate Data
                const validationResult = v.validate({ email, password }, schema);

                if (validationResult !== true) {
                    throw new errorResponse('Validation Failed', 401, validationResult);
                } else {
                    const checkRole = await prisma.role.findFirst({ where: { roleName: roleName.toLowerCase() } });
                    if (checkRole) {
                        const result = await prisma.user.create({
                            data: {
                                fullName,
                                email: email.toLowerCase(),
                                password: hash,
                                address,
                                phone,
                                roleId: checkRole.id,
                            }
                        });
                        if (req.file) {
                            const imageProfile = await prisma.imageUser.create({
                                data: {
                                    cloudinaryId: req.file.filename,
                                    url: req.file.path,
                                    userId: result.id,
                                }
                            });
                        }
                        return successResponse(res, result, 'Success', 200);
                    }

                    const role = await prisma.role.create({ data: { roleName: roleName.toLowerCase() } });
                    const result = await prisma.user.create({
                        data: {
                            fullName,
                            email: email.toLowerCase(),
                            password: hash,
                            address,
                            phone,
                            roleId: role.id,
                        }
                    });
                    if (req.file) {
                        const imageProfile = await prisma.imageUser.create({
                            data: {
                                cloudinaryId: req.file.filename,
                                url: req.file.path,
                                userId: result.id,
                            }
                        });
                    }
                    return successResponse(res, result, 'Success', 200);
                }
            }
        } else {
            // Validate Data
            const validationResult = v.validate({ email, password }, schema);

            if (validationResult !== true) {
                throw new errorResponse('Validation Failed', 401, validationResult);
            } else {
                const checkRole = await prisma.role.findFirst({ where: { roleName: roleName.toLowerCase() } });
                if (checkRole) {
                    const result = await prisma.user.create({
                        data: {
                            fullName,
                            email: email.toLowerCase(),
                            password: hash,
                            address,
                            phone,
                            roleId: checkRole.id,
                        }
                    });
                    if (req.file) {
                        const imageProfile = await prisma.imageUser.create({
                            data: {
                                cloudinaryId: req.file.filename,
                                url: req.file.path,
                                userId: result.id,
                            }
                        });
                    }
                    return successResponse(res, result, 'Success', 201);
                }
                const role = await prisma.role.create({ data: { roleName: roleName.toLowerCase() } });
                const result = await prisma.user.create({
                    data: {
                        fullName,
                        email: email.toLowerCase(),
                        password: hash,
                        address,
                        phone,
                        roleId: role.id,
                    }
                });
                if (req.file) {
                    const imageProfile = await prisma.imageUser.create({
                        data: {
                            cloudinaryId: req.file.filename,
                            url: req.file.path,
                            userId: result.id,
                        }
                    });
                }
                return successResponse(res, result, 'Success', 201);
            }
        }
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}

export const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email, password } = req.body;
        const checkUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                imageUser: true,
                role: true
            }
        });

        if (!checkUser) {
            throw new errorResponse('Email not Found', 401, {});
        }

        const checkPassword = bcrypt.compareSync(password, checkUser.password);

        if (!checkPassword) {
            throw new errorResponse('Wrong Password', 401, {});
        }

        const _token = jwt.sign(
            {
                id: checkUser.id,
                role: checkUser.role.roleName,
                email: email.toLowerCase(),
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            status: true,
            message: 'Login success',
            token: _token,
            data: checkUser,
        });
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}


export const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;
        const { fullName, email, password, address, phone } = req.body;
        const checkUser = await prisma.user.findUnique({ where: { id: Number(id) } });
        const schema = {
            email: { type: 'email', optional: true },
            password: { type: 'string', min: 5, max: 255, optional: true },
        };
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        if (!checkUser) {
            throw new errorResponse('User Not Found', 401, {});
        }

        if (checkUser) {
            // Validate Data
            const validationResult = v.validate({ email, password }, schema);

            if (validationResult !== true) {
                throw new errorResponse('Validation Failed', 401, validationResult);
            } else {
                const result = await prisma.user.update(
                    {
                        where: {
                            id: Number(id),
                        },
                        data: {
                            fullName,
                            password: hash,
                            address,
                            phone,
                            updatedAt: new Date(),

                        }
                    },

                );
                if (req.file) {
                    const checkImageUser = await prisma.imageUser.findUnique({
                        where: { userId: Number(id) },
                    });
                    if (checkImageUser) {
                        const deleteImageCloudinary = await cloudinary.uploader.destroy(
                            checkImageUser.cloudinaryId
                        );
                        const updateImageProfile = await prisma.imageUser.update(

                            {
                                where: { userId: Number(id) }, data: {

                                    cloudinaryId: req.file.filename,
                                    url: req.file.path,
                                    updatedAt: new Date(),

                                }
                            },

                        );
                    } else {
                        const imageProfile = await prisma.imageUser.create({
                            data: {
                                cloudinaryId: req.file.filename,
                                url: req.file.path,
                                userId: Number(id),
                            }
                        });
                    }
                }
                return successResponse(res, result, 'Success', 200);
            }

        } else {
            // Validate Data
            const validationResult = v.validate({ email, password }, schema);

            if (validationResult !== true) {
                throw new errorResponse('Validation Failed', 401, validationResult);
            } else {
                const result2 = await prisma.user.update(
                    {
                        where: {
                            id: Number(id)
                        },
                        data: {
                            fullName,
                            email: email,
                            password: hash,
                            address,
                            phone,
                            updatedAt: new Date(),
                        },
                    }
                );
                if (req.file) {
                    const checkImageUser = await prisma.imageUser.findUnique({
                        where: { userId: Number(id) },
                    });
                    if (checkImageUser) {
                        const deleteImageCloudinary = await cloudinary.uploader.destroy(
                            checkImageUser.cloudinaryId
                        );
                        const updateImageProfile = await prisma.imageUser.update(
                            {
                                where: { userId: Number(id) }, data: {
                                    cloudinaryId: req.file.filename,
                                    url: req.file.path,
                                    updatedAt: new Date(),
                                },
                            }
                        );
                    } else {
                        const imageProfile = await prisma.imageUser.create({
                            data: {
                                cloudinaryId: req.file.filename,
                                url: req.file.path,
                                userId: Number(id),
                            }
                        });
                    }
                }

                return successResponse(res, result2, 'Success', 200);
            }
        }
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}

export const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;
        const checkUser = await prisma.user.findUnique({ where: { id: Number(id) } });

        if (!checkUser) {
            throw new errorResponse('User Not Found', 401, {});
        }
        const checkImageUser = await prisma.imageUser.findUnique({ where: { userId: Number(id) } });
        if (checkImageUser) {
            const deletedImageCloudinary = await cloudinary.uploader.destroy(checkImageUser.cloudinaryId);
            const deletedImageUser = await prisma.imageUser.delete({
                where: { userId: Number(id) },
            });
            const result = await prisma.user.update(

                { where: { id: Number(id) }, data: { isDeleted: true, updatedAt: new Date() } }
            );
            return successResponse(res, result, 'Success', 200);
        }
        const deletedImageUser = await prisma.imageUser.delete({
            where: { userId: Number(id) },
        });
        const result = await prisma.user.update(

            { where: { id: Number(id) }, data: { isDeleted: true, updatedAt: new Date() } }
        );
        return successResponse(res, result, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}

export const getUserEmail = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.query
    try {
        let result;
        if (typeof email === 'string') {
            result = await prisma.user.findUnique({
                where: { email: email.toLowerCase() }, select: {
                    email: true,
                },
            });
        }
        if (!result) {
            return successResponse(res, result, 'Email is not available', 200);
        }
        throw new errorResponse('Email is Available', 401, result);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}

export const forgotPassword = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            throw new errorResponse('Email Not Found', 404, {});
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiredAt = new Date();
        expiredAt.setMinutes(expiredAt.getMinutes() + 15);
        const resetResult = await prisma.resetLink.findUnique({
            where: { userId: user.id },
        });

        if (resetResult) {
            await prisma.resetLink.update(

                { where: { userId: user.id }, data: { token, expiredAt, isUsed: false, updatedAt: new Date() } }
            );
        } else {
            await prisma.resetLink.create({
                data: {
                    userId: user.id,
                    token,
                    expiredAt,
                    isUsed: false,
                }
            });
        }
        const _resetLink = `${process.env.NEXT_PUBLIC_API_URL}auth/resetPassword?token=${token}&email=${email.toLowerCase()}`;
        const result = await sendResetPasswordEmail(email.toLowerCase(), _resetLink);
        if (!result) {
            throw new errorResponse('Failed to send reset password email', 401, result);
        }
        return successResponse(res, result, 'Reset password link sent to email.', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}

export const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
    const { token } = req.query;
    const { email, newPassword } = req.body;
    try {
        if (typeof token === 'string') {
            const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
            if (!user) {
                throw new errorResponse('Email not found', 404, {});
            }
            const resetToken = await prisma.resetLink.findUnique({
                where: { userId: user.id },
            });
            if (!resetToken) {
                throw new errorResponse('Invalid or expired token', 404, {});
            }
            if (new Date() > resetToken.expiredAt) {
                throw new errorResponse('Token has expired', 400, {});
            }
            if (resetToken.isUsed) {
                throw new errorResponse('Token has already been used', 400, {});
            }
            const isValid = await prisma.resetLink.findFirst({ where: { token } });
            if (!isValid) {
                throw new errorResponse('Invalid token', 400, {});
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);
            await prisma.user.update({ where: { email: email.toLowerCase() }, data: { password: hash, updatedAt: new Date() } });

            await prisma.resetLink.update({ where: { userId: user.id }, data: { isUsed: true, updatedAt: new Date() }, });

            return successResponse(res, {}, 'Password has been reset successfully.', 200);
        }
        throw new errorResponse('Invalid Token', 400, {});
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
}
