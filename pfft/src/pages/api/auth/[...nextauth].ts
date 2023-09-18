import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user/user.model";
import dbConnect from "../../../database/conn";
import { generateUniqueString } from "@/utils/helper";
import mongoose from "mongoose";
import PaymentRecord from "@/models/paymentRecord/paymentRecord.model";


var googleSessionId: null = null;
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile: any) {
        await dbConnect();
        const userData = {
          id: profile.sub + "pfft",
          username: profile.name.replace(/\s/g, ""),
          email: profile.email,
          password: generateUniqueString(profile.sub),
          userType: "google",
        };
        try {
          //@ts-ignore
          await User.findOneOrCreate(userData).then(async (value:any)=>{
            googleSessionId= value._id || value._doc._id
            const paymentRecord = new PaymentRecord({
              user_id: new mongoose.Types.ObjectId(value._id),
              isFreeCredit: true,
              credit: process.env.FREE_CREDIT_AMOUNT,
            });
      
            await paymentRecord.save();
            
          });
        } catch (error) {
          console.error("Failed to save user data to MongoDB", error);
        }
        return userData;
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials: any) {
        dbConnect().catch(() => {
          throw new Error("DB Connection Failed!");
        });
        // @ts-ignore
        const result = await User.findOne({
          username: credentials.username,
        }).select("+password");
        if (!result) {
          throw new Error("No user Found with UserName Please Sign Up...!");
        }

        // compare()
        //@ts-ignore
        const checkPassword = await result.comparePassword(
          credentials.password
        );
        // incorrect password
        if (!checkPassword) {
          throw new Error("Username or Password doesn't match");
        }

        return result;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        if(googleSessionId===null){
          
          token.user = {
            _id: user.id,
            email: user.email,
            name: user.username,
          };
        }
        else{
          token.user = {
            _id: googleSessionId,
            email: user.email,
            name: user.username,
          };
        }
        
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token as any) {
        session.user = token.user;
      }
      return session;
    },
  },
});