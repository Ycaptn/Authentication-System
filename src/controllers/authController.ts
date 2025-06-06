import { Request,Response,NextFunction } from "express";
import { loginSchema, registerSchema, resetPasswordSchema } from "../schema/authSchema";
import { prisma } from "..";
import { badRequestError, notFoundError } from "../utils/httpError";
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateOtp, verifyOtp } from "../utils/tokenHandler";
import passport from "passport";

export const loginController = async(req:Request,res:Response) => {
    loginSchema.parse(req.body)
    const {username,password} = req.body
    // Remember to implement Check
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: username }
            ]
        }
    })

    if (!user) {
        throw new badRequestError("Invalid credentials")
    }
    if (!user.password) throw new badRequestError("Invalid credentials")
    const validPassword = await bycrypt.compare(password,user.password)

     if (!validPassword) {
        throw new badRequestError("Invalid credentials")
    }

     if (!user.verified) {
            throw new badRequestError('Please verify your email')
     }
    if (!process.env.JWT_SECRET_KEY) throw new notFoundError("JWT_ACCESSKEY_NOTFOUND")
    const { password: _password, ...safedata } = user
    const token = jwt.sign({id:user.id},process.env.JWT_SECRET_KEY)
    res.status(200).send({
        access: token,
        success : true,
         message: safedata }) 
}

export const registerController = async (req:Request,res:Response) => {
    registerSchema.parse(req.body)
    const {email,username,password} = req.body
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }]
        }
    });
    if (existingUser) {
            throw new badRequestError(
                existingUser.username === username
                    ? 'Username already exists'
                    : 'Email already exists'
            );

    }


    const user = await prisma.user.create({
        data:{
            username:username,
            email:email,
            password: await bycrypt.hash(password,12)
        }
    })

    if (!user) throw new badRequestError('Error while creating user!')

    const { password: _password, ...safedata } = user

    res.status(200).send({
        success : true,
         message: safedata  }) 
}

export const userController = async (req:Request,res:Response) => {
    const token = req.body.token
     const user = await prisma.user.findFirst({
        where: {
                id: token
        }
    })

    if (!user) {
        throw new badRequestError("Invalid credentials")
    }

    const { password: _password, ...safedata } = user

    res.status(200).send(
        {
            success:true,
            message:safedata
        }
    )
}

export const getresetToken = async (req:Request,res:Response) =>{
    const {email} = req.body
    if (!email) throw new badRequestError("No email found")
    const user = await prisma.user.findFirst({
        where:{
            email
        }
    })

    if (!user) throw new badRequestError("User not found")
    

    const secret = process.env.OTP_SECRET_KEY
    if(!secret) throw new Error
    const {otp, expiration}= generateOtp(secret)

    await prisma.resetToken.create({
        data:{
            userId: user.id,
            token: otp,
            expiredAt: expiration.toString()
        }
    })

      res.status(200).json({
        success: true,
        token: otp
    })
}

export const verifyPasswordToken = async (req:Request,res:Response) => {
    resetPasswordSchema.parse(req.body)
    const {email,token} = req.body

    let user = await prisma.user.findFirst({
        where:{
            email
        }
    })
    if (!user) throw new badRequestError('user not found')
    const resetToken = await prisma.resetToken.findFirst({
        where :{
            userId:user.id,
            token
        }
    })
   
    if (!resetToken || resetToken.token !== token) throw new badRequestError("invalid token")
   
    await prisma.user.update({
        where:{
            id: user.id
        },
        data:{
            verified:true
        }
    })
    res.status(200).json({
        success: true,
        message: "user verified"
    })
}


export const changePassword = async(req:Request, res:Response) =>{
    const {newPassword,email,token} = req.body
    if (!newPassword || !email || !token ) throw new badRequestError("input not provided")
    
    let user = await prisma.user.findFirst({
        where:{
            email
        }
    })
    if (!user) throw new badRequestError('user not found')
    const secret = process.env.OTP_SECRET_KEY
    if(!secret) throw new Error

    const resetToken = await prisma.resetToken.findFirst({
        where :{
            userId:user.id,
            token
        }
    })
    if (!resetToken) throw new badRequestError('invalid token')
    const validToken = verifyOtp(resetToken,secret)

    if (!validToken.isValid) throw new badRequestError('invalid token')

     await prisma.resetToken.deleteMany({
        where :{
            userId:user.id,
        }
    })
    const hashedPassword = await bycrypt.hash(newPassword,12)
    await prisma.user.update({
        where:{
            id:user.id
        },
        data:{
            password: hashedPassword
        }
    })
    res.status(200).json({
        success:true,
        message:"password changed successfully"
    })
}


export const passportAuth = (req:Request,res:Response) => {
    if (req.user) {
        const user = req.user as any;
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY as string);
        const { password: _password, ...safedata } = user;
        res.status(200).send({
            access: token,
            success: true,
            message: safedata
        });
    } else {
        res.status(401).send({
            success: false,
            message: "Unauthorized"
        });
    }
}
