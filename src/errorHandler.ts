import { NextFunction, Request, Response } from "express";
import { httpError } from "./utils/errorContructor";
import { z } from "zod";


export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction) => {
    if (err instanceof httpError) {
        res.status(err.statusCode).send({
            success : err.success,
            message: err.message
        })
        
    }



    if (err instanceof z.ZodError){
         res.status(400).send({
            success: false,
            message: err.errors.map(error => ({
                field: error.path.join('.'),
                message:error.message
            }))
        })
    }



    else res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
    ? 'Something went wrong' 
    : err.message
    });

}

