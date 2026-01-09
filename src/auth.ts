import NextAuth, { customFetch } from "next-auth";
// import { authConfig } from "./auth.config";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import GithubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
// import { ProxyAgent, fetch as undici } from "undici";
// const dispatcher = new ProxyAgent({
//   uri: process.env.NEXTAUTH_URL_INTERNAL as string,
// });
// function proxy(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
//   return undici(args[0], { ...(args[1] ?? {}), dispatcher });
// }

// 创建或获取 guest 用户
async function createGuestUser() {
  await dbConnect();

  const guestUserId = "guest";

  // 查找是否已存在 guest 用户
  let guestUser = await User.findOne({ userId: guestUserId });

  if (!guestUser) {
    // 创建 guest 用户
    guestUser = await User.create({
      userId: guestUserId,
      gender: "female",
      birthDateTime: new Date(1996, 2, 12, 22),
      email: "guest@guest.com",
      isLock: false,
      genStatus: "none",
    });
  }

  return {
    id: guestUser._id.toString(),
    userId: guestUserId,
    email: "guest@guest.com",
    name: "Guest",
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth(
  {
    trustHost: true,

    providers: [
      Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        const user = await createGuestUser();
        return user;
      },
    }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

        //redirectProxyUrl: process.env.NEXTAUTH_URL_INTERNAL as string,
        //[customFetch]: proxy,
      }),
      // AppleProvider({
      //   clientId: process.env.APPLE_ID as string,
      //   clientSecret: process.env.APPLE_SECRET as string,
      // }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    // debug: true,
    callbacks: {
      async jwt({ token, user, account }) {
        //console.log("jwt", token, user, account);
        if (account && user) {
          token.accessToken = account.access_token;
          token.id = user.id;
        }
        return token;
      },
      // async redirect({ url, baseUrl }) {
      //   console.log("redirect", url, baseUrl);
      //   return `${baseUrl}/auth/login?callbackUrl=${url}`;
      // },
      // async signIn({ user, account }) {
      //   //console.log("OAuth请求目标URL:", user, account);
      //   return true;
      //   // await dbConnect();

      //   // // Extract user info from provider data
      //   // const { id, email, name } = user;
      //   // // const provider = account?.provider;

      //   // // Check if user exists
      //   // let existingUser = await User.findOne({ userId: id });

      //   // if (!existingUser) {
      //   //     // For new users, prompt them to fill additional info on first login
      //   //     // Store minimal info and redirect to complete profile
      //   //     return `/auth/complete-profile?id=${id}&email=${email}&provider=${provider}`;
      //   // }
      // },
      async session({ session, token }) {
        console.log("session", session, token);
        if (token && session.user) {
          // 扩展 session.user 类型以包含 id 属性
          const isGuest = session.user.email === "guest@guest.com";
          (session.user as any) = {
            ...session.user,
            id: token.sub,
            userId: isGuest ? "guest" : session.user.email, // guest 用户使用 "guest" 作为 userId
            isGuest,
          };
        }
        //console.log("session", session);
        return session;
      },
    },
    pages: {
      // error: "/error",
      // signIn: '/auth/login',
    },
  } satisfies NextAuthConfig
  //   (req) => {
  //     //   if (req) {
  //     //   console.log(req) // do something with the request
  //     //    }
  //     return { ...authConfig };
  //   }
);
