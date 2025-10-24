import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { ApiError, successResponse } from '@/utils/response';
import { errorResponse } from '@/utils/errorResponse';

export const getAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const products = await prisma.product.findMany(

        )
        if (!products) {
            throw new errorResponse('product is not found', 401);
        }
        return successResponse(res, products, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};

export const getProductbyId = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    try {
        const products = await prisma.product.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                category: {
                    select: {
                        id: true,
                        categoryName: true
                    }
                },
                imageProduct: true,
                variant: true,
                option: {
                    select: {
                        id: true,
                        productId: true,
                        name: true,
                        value: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
            }

        });
        if (!products) {
            throw new errorResponse('product is not found', 401);
        }
        return successResponse(res, products, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};

export const addProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query;
    const { productName, categoryName, options, variants, status, description, sku } = req.body;
    const variantParsed = JSON.parse(variants);
    const optionParsed = JSON.parse(options);
    try {
        let finalCategoryId: number;

        const existingCategory = await prisma.category.findFirst({
            where: { categoryName: categoryName.toLowerCase() },
        });

        if (existingCategory) {
            finalCategoryId = existingCategory.id;
        } else {
            const newCategory = await prisma.category.create({
                data: { categoryName: categoryName.toLowerCase() }
            });
            finalCategoryId = newCategory.id;
        }

        const product = await prisma.product.create({
            data: {
                userId: Number(userId),
                productName,
                categoryId: finalCategoryId,
                sku,
                status,
                description,
                numOrders: 0,
            }
        });

        await prisma.$transaction(async (tx) => {
            await Promise.all(
                optionParsed.map(async (data: any) => {
                    const _option = await tx.option.create({
                        data: {
                            productId: product.id,
                            name: data.name,
                            isDeleted: data.isDeleted,
                        }
                    });
                    data.value.map(
                        async (value: any) =>
                            await tx.value.create({
                                data:
                                {
                                    optionId: _option.id,
                                    name: value.name,
                                    isDeleted: value.isDeleted,
                                }

                            })
                    );
                })
            );

            await Promise.all(
                variantParsed.map((data: any) =>
                    tx.variant.create({
                        data: {
                            productId: product.id,
                            option1: data.option1,
                            option2: data.option2,
                            price: data.price,
                            quantity: data.quantity,
                            weight: data.weight,
                            discount: data.discount,
                            compareAtPrice: data.discount,
                            title: `${data.option1} - ${data.option2}`,
                            isDeleted: data.isDeleted,
                            sku: data.sku
                        }
                    })
                )
            );
            if (req.files) {
                await Promise.all(
                    req.files.map((file) =>
                        tx.imageProduct.create({
                            data: {
                                cloudinaryId: file.filename,
                                url: file.path,
                                productId: product.id,
                            }
                        })
                    )
                );
            }

        })

        return successResponse(res, product, 'Success', 201);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};