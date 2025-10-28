import { Request, Response } from "express";
import { AddressSchema, updateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { Addresses } from "@prisma/client";

export const addAddress = async (req:any, res: Response)=>{
        
    AddressSchema.parse(req.body)
    const address = await prismaClient.addresses.create({
        data: {
            ...req.body,
            userId: req.user.id
        }
    })
    res.json(address);
};

export const delteAddress = async (req: Request, res: Response)=>{
          try {
            await prismaClient.addresses.delete({
                where: {
                    id: +req.params.id
                }
            });
            res.status(200).json({message:"success"})
          } 
          catch (error) {
            res.status(404).json({ message: "User Not Found"});
          }
};

export const listAddress = async (req: any, res: Response)=>{
        const addresses = await prismaClient.addresses.findMany({
            where: {
                userId: req.user.id
            }
        })

        res.json(addresses);
};

export const updateUser = async (req: any, res: Response)=>{

    const validatedData = updateUserSchema.parse(req.body);
    let shippingAddress : Addresses;
    let billingAddress : Addresses;

    if(validatedData.defaultShippingAddress){

        try {
            shippingAddress = await prismaClient.addresses.findFirstOrThrow({
                where: {
                    id: +validatedData.defaultShippingAddress
                }
            })
        } catch (error) {
                res.status(404).json({ message: "shippingAddress Not Found"});
        }
    }

    if(validatedData.defaultBillingAddress){

        try {
            billingAddress = await prismaClient.addresses.findFirstOrThrow({
                where: {
                    id: +validatedData.defaultBillingAddress
                }
            })
        } catch (error) {
                res.status(404).json({ message: "billingAddress Not Found"});
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: +validatedData
    })
        res.json(updateUser);
};