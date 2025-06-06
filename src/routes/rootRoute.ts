import { Request,Response,Router } from "express"
import renderRoute from "./renderRoute";
import authRoute from "./authRoute";

const rootRoute = Router();
rootRoute.use('/',renderRoute)
rootRoute.use('/api/auth', authRoute)

export default rootRoute;