// import 'dotenv'
import express from 'express';
import rootRoute from './routes/rootRoute';
import morgan from 'morgan'
import path from 'path';
import { PrismaClient } from './generated/prisma';
import { errorHandler } from './errorHandler';
import {configPassport}  from './config/passport';
import session from 'express-session'
import passport from 'passport';








export const prisma = new PrismaClient()
const app = express();
app.use(session({
  secret: 'your-secret-key', // Replace with a real secret
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(morgan('short'))
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json())


app.use('/',rootRoute)


app.use(passport.initialize());
app.use(passport.session());



configPassport()
app.use(errorHandler)
app.listen(process.env.PORT, 
    () => {
    console.log(`connected to port ${process.env.PORT}`)
})