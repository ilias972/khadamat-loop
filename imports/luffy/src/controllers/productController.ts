import {Request, Response} from 'express';
import {PrismaClient}  from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response)=>{


    const product = await prisma.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(','),
        }
    })

    res.json(product);
};


export const updateProduct = async (req: Request, res: Response)=>{
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }

        const updateProduct = await prisma.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })

        res.json({updateProduct});

    } catch (error) {
        alert("Error updating product");
        res.json({message:"Error updating product"});
    }
};


export const deleteProduct = async (req: Request, res: Response)=>{

    try {
        const deleteProduct = await prisma.product.delete({
            where: {
                id: +req.params.id
            }
        })
        res.json({message:"Product deleted"});
    } catch (error) {
        alert("Error deleting product");
        console.log("Error deleting product");
    }

   
    
};

export const listProduct= async (req: Request, res: Response)=>{

    const count = await prisma.product.count();
    const allProducts = await prisma.product.findMany({
        skip: +req.params.skip || 0,  // skip means how much products should be displayed on one page 
        take: 5 // so if skip is not specified then default 5 products will be displayed
    
    })

    res.json({
        count,
        data: allProducts
    });
    
};

export const getProductById = async (req: Request, res: Response)=>{

    try {
        const singleProduct = await prisma.product.findFirstOrThrow({
            where:{
                id: +req.params.id
            }
        });
    
        res.json(singleProduct);
    } catch (error) {
        res.status(error.status).json({ error: error.message});
    }
    
};