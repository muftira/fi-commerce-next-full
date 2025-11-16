import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { ApiError, successResponse } from '@/utils/response';
import { errorResponse } from '@/utils/errorResponse';
import { v2 as cloudinary } from 'cloudinary';
import { OptionBody, ValueBody, VariantBody } from '@/types';

export const getAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isDeleted: false
            }
        })
        if (!products) {
            throw new errorResponse('product is not found', 401);
        }
        return successResponse(res, products, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};

export const getAllProductsbyUserId = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query;
    try {
        const products = await prisma.product.findMany({
            where: {
                userId: Number(userId),
                isDeleted: false
            },
            include: {
                category: {
                    select: {
                        id: true,
                        categoryName: true
                    }
                },
                imageProduct: true,
                variant: {
                    where: {
                        isDeleted: false
                    }
                },
                option: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        productId: true,
                        name: true,
                        value: {
                            where: {
                                isDeleted: false
                            },
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
            }

        })
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
                id: Number(id),
                isDeleted: false
            },
            include: {
                category: {
                    select: {
                        id: true,
                        categoryName: true
                    }
                },
                imageProduct: true,
                variant: {
                    where: {
                        isDeleted: false
                    }
                },
                option: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        productId: true,
                        name: true,
                        value: {
                            where: {
                                isDeleted: false
                            },
                            select: {
                                id: true,
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
                optionParsed.map(async (data: OptionBody) => {
                    const _option = await tx.option.create({
                        data: {
                            productId: product.id,
                            name: data.name,
                        }
                    });
                    data.value?.map(
                        async (value: ValueBody) =>
                            await tx.value.create({
                                data:
                                {
                                    optionId: _option.id,
                                    name: value.name,
                                }

                            })
                    );
                })
            );

            await Promise.all(
                variantParsed.map((data: VariantBody) =>
                    tx.variant.create({
                        data: {
                            productId: product.id,
                            option1: data.option1 ?? '',
                            option2: data.option2 ?? '',
                            price: data.price ?? 0,
                            quantity: data.quantity ?? 0,
                            weight: data.weight?.toString() ?? '',
                            discount: data.discount ?? 0,
                            compareAtPrice: data.discount ?? 0,
                            title: `${data.option1} - ${data.option2}`,
                            sku: data.sku ?? '',
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

export const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, categoryId } = req.query;
    const { productName, categoryName, options, variants, status, description, sku, deletedImage } = req.body;
    const variantParsed = JSON.parse(variants);
    const optionParsed = JSON.parse(options);
    try {
        const findProduct = await prisma.product.findFirst({ where: { id: Number(id), isDeleted: false } });
        const findCategory = await prisma.category.findFirst({
            where: { id: Number(categoryId), isDeleted: false },
        });

        if (!findProduct || !findCategory) {
            if (req.files) {
                await Promise.all(
                    req.files.map((data) => cloudinary.uploader.destroy(data.filename))
                );
            }
            throw new errorResponse(
                !findCategory ? 'Category is not found' : 'Product is not Found', 401
            );
        }

        const category = await prisma.category.update({
            where: {
                id: Number(categoryId),
            },
            data: {
                categoryName: categoryName,
            },
        });

        const product = await prisma.product.update({
            where: {
                id: Number(id),
            },
            data: {
                productName,
                categoryId: category.id,
                status,
                description,
                sku,
            }
        });

        await prisma.$transaction(async (tx) => {

            const optionPromises = optionParsed.map(async (data: OptionBody) => {
                let _option: OptionBody

                if (data.id) {

                    _option = await tx.option.update({
                        where: { id: data.id },
                        data: { name: data.name, isDeleted: data.isDeleted }
                    });
                } else {

                    _option = await tx.option.create({
                        data: {
                            productId: Number(id),
                            name: data.name,
                        }
                    });
                }

                if (data.value && data.value.length > 0) {

                    const valuePromises = data.value.map(async (value: any) => {
                        if (value.id) {
                            return tx.value.update({
                                where: { id: value.id },
                                data: { name: value.name, isDeleted: value.isDeleted }
                            });
                        } else {

                            return tx.value.create({
                                data: {
                                    optionId: Number(_option.id),
                                    name: value.name,
                                }
                            });
                        }
                    });

                    await Promise.all(valuePromises);
                }
            });

            await Promise.all(optionPromises);

            const variantPromises = variantParsed.map(async (data: VariantBody) => {
                if (data.id) {

                    return tx.variant.update({
                        where: { id: data.id },
                        data: {
                            option1: data.option1,
                            option2: data.option2,
                            price: data.price,
                            quantity: data.quantity,
                            weight: data.weight?.toString(),
                            discount: data.discount,
                            compareAtPrice: data.discount,
                            title: `${data.option1} - ${data.option2}`,
                            isDeleted: data.isDeleted,
                            sku: data.sku
                        }
                    });
                } else {

                    return tx.variant.create({
                        data: {
                            productId: Number(id),
                            option1: data.option1 ?? '',
                            option2: data.option2 ?? '',
                            price: data.price ?? 0,
                            quantity: data.quantity ?? 0,
                            weight: data.weight?.toString() ?? '',
                            discount: data.discount ?? 0,
                            compareAtPrice: data.discount ?? 0,
                            title: `${data.option1} - ${data.option2}`,
                            sku: data.sku ?? '',
                        }
                    });
                }
            });

            await Promise.all(variantPromises);
        })

        await prisma.$transaction(async (tx) => {
            if (deletedImage) {
                if (typeof deletedImage == 'string') {
                    const validData = deletedImage.replace(/([{,]\s*)(\w+):/g, '$1"$2":');
                    const parseDeletedImage = JSON.parse(validData);
                    const imageStatus = await Promise.all(
                        parseDeletedImage?.map((data: any) =>
                            tx.imageProduct.update({
                                where: { id: data.id },
                                data: { isDeleted: data.status },
                            })
                        )
                    );
                } else {
                    const imageStatus = await Promise.all(
                        deletedImage.map((data: any) =>
                            tx.imageProduct.update({
                                where: { id: data.id },
                                data: { isDeleted: data.status },
                            })
                        )
                    );
                }

                const findImage = await tx.imageProduct.findMany({
                    where: { isDeleted: true },
                });

                if (findImage.length > 0) {
                    await Promise.all(
                        findImage.map((data) => cloudinary.uploader.destroy(data.cloudinaryId))
                    );
                }

                const imageDeleted = await tx.imageProduct.deleteMany({
                    where: { isDeleted: true },
                });
            }
            if (req.files) {
                await Promise.all(
                    req.files.map((file) =>
                        tx.imageProduct.create({
                            data: {
                                cloudinaryId: file.filename,
                                url: file.path,
                                productId: Number(id),
                            }
                        })
                    )
                );
            }
        });
        return successResponse(res, product, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};

export const deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, categoryId } = req.query;
    try {
        const findImage = await prisma.imageProduct.findMany({ where: { productId: Number(id) } });

        const findProduct = await prisma.product.findFirst({
            where: {
                id: Number(id),
                isDeleted: false
            }
        });

        if (!findProduct) {
            throw new errorResponse('Product not found', 401);
        }

        if (findImage.length > 0) {
            await Promise.all(
                findImage.map((image) => cloudinary.uploader.destroy(image.cloudinaryId))
            );
            await prisma.imageProduct.deleteMany({
                where: { productId: Number(id) },
            });
        }

        await prisma.product.update({
            where: { id: Number(id) },
            data: { isDeleted: true }
        });

        await prisma.variant.updateMany({
            where: { productId: Number(id) },
            data: { isDeleted: true }
        })
        const findOption = await prisma.option.findMany({
            where: {
                productId: Number(id),
                isDeleted: false
            }
        })

        await Promise.all(
            findOption.map((option) => prisma.value.updateMany({
                where: { optionId: option.id },
                data: { isDeleted: true }
            }))
        )

        await prisma.option.updateMany({
            where: { productId: Number(id) },
            data: { isDeleted: true }
        })

        const findCategory = await prisma.product.findMany({
            where: {
                categoryId: Number(categoryId),
                isDeleted: false
            }
        },
        );

        if (findCategory.length == 0) {
            await prisma.category.update({
                where: { id: Number(categoryId) },
                data: { isDeleted: true }
            });
        }
        return successResponse(res, {}, 'Success', 200);
    } catch (err) {
        const statusCode = err instanceof errorResponse ? err.statusCode : 500;
        return ApiError(res, (err as Error).message, statusCode, err)
    }
};