import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

export const authMiddleware = async (req:Request & { user?: User }, res:Response, next:NextFunction)=> {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"Invalid Authorization"});
        
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await prismaClient.user.findFirst({where: {id:payload.userId}})

    if(!user){
        return res.status(401).json({message:"Invalid Authorization"});
        
    }
    req.user = user
    next();
    } catch (error) {
        res.json({message:"Invalid Authorization"})
        console.log("Invalid Authorizationror")
    }

    
}