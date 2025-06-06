import { Request,Response,Router } from "express"
import path from "path";

const renderRoute = Router();
renderRoute.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve('src/app/index.html'));
})

renderRoute.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.resolve('src/app/index.html'));
})


renderRoute.get('/register', (req: Request, res: Response) => {
    res.sendFile(path.resolve('src/app/register.html'));
})

renderRoute.get('/dashboard',(req:Request,res:Response)=>{
    res.sendFile(path.resolve('src/app/dashboard.html'))
})

renderRoute.get('/admin',(req:Request,res:Response)=>{
    res.sendFile(path.resolve('src/app/admin.html'))
})

renderRoute.get('/verify-email',(req:Request,res:Response)=>{
    res.sendFile(path.resolve('src/app/verify-email.html'))
})

renderRoute.get('/register-email',(req:Request,res:Response)=>{
    res.sendFile(path.resolve('src/app/register-email.html'))
})

renderRoute.get('/reset-password',(req:Request,res:Response)=>{
    res.sendFile(path.resolve('src/app/reset-password.html'))
})


export default renderRoute;