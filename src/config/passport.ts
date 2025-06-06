import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { prisma } from '..';



export const configPassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.CALLBACK_URL) {
    throw new Error('Missing Google OAuth environment variables');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true
      },
      async (
        req: any,
        accessToken: string,
        refreshToken: string,
        params: any,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) => {
        let user = await prisma.user.findFirst({
          where: {
            email: profile.emails?.[0]?.value
          }
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleID: profile.id,
              email: profile.emails?.[0]?.value || ''
            }
          });
        }


         if (!user?.googleID) {
          user = await prisma.user.update({
            where:{
              id: user.id
            },
            data: {
              googleID: profile.id
            }
          });
        }

        
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    
  });
};