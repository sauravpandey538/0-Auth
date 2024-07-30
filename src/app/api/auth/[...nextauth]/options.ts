import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        console.log("Credentials received:", credentials);
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials.email });
          console.log("User found:", user);

          if (!user) {
            console.error("User not found with provided email");
            throw new Error("User not found with provided email");
          }
          if (!user.isVerified) {
            console.error("User not verified");
            throw new Error("Verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            console.log("Password correct, user authenticated");
            return user;
          } else {
            console.error("Incorrect password");
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          console.error("Authorize error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("User in option is :", user);
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }

      if (account && profile) {
        token.accessToken = account.access_token as string;
        token._id = profile.sub as string;
        token.username = profile.name as string;
      }
      // console.log("token in option is : ", token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.username = token.username?.toString();
        session.user.isVerified = (token.isVerified as boolean) || true;
        session.user.isAcceptingMessage =
          (token.isAcceptingMessage as boolean) || true;
        session.accessToken = token.accessToken as string;
      }
      delete session.user.name;
      // console.log("session in option is : ", session);

      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(account);
      if (account?.provider !== "credentials") {
        await dbConnect();
        console.log("below mongo: ", user);
        try {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const hashedPassword = await bcrypt.hash(
              process.env.NEXT_PUBLIC_PASSWORD as string,
              10
            );
            const newUser = new User({
              username: user.name?.toString(),
              email: user.email?.toString(),
              password: hashedPassword,
              verifyCode: "q/n",
              verifyCodeExpiry: new Date(),
              isVerified: true,
              isAcceptingMessage: true,
              messages: [],
            });
            await newUser.save();
            console.log("User is saved to DB");
          }
        } catch (error) {
          console.log("Error during saving OAuth user to database", error);
        }
      }
    },
  },
  pages: {
    // signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
