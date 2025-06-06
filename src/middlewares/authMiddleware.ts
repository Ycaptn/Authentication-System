import jwt, { verify }  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { badRequestError, notFoundError, unauthorizedError } from "../utils/httpError";


export const authMiddleWare = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (!token) throw new unauthorizedError("Access token not found");
        
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) throw new unauthorizedError("Jsonwebtoken secret not found");
        const payload:any = jwt.verify(token, secret);

        if (!payload) throw new badRequestError("Invalid access token ");
        req.body.token = payload.id;
        next();
    } catch (error) {
        res.send(error)
    }
}