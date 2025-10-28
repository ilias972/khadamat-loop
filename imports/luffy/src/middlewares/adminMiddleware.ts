import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

export const adminMiddleware = async (req:Request & { user?: User }, res:Response, next:NextFunction)=> {
    const user = req.user
    if(user.role=='ADMIN'){
        next();
        
    }

    else{
        console.log("Unauthorized");
        res.status(401).json({message:"Unauthorized Only Admin Request"})  
    }
}