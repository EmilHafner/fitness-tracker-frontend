import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/services/auth.service";
import { stringify } from "querystring";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        const { username, password } = credentials as any;

        const res = await loginUser(username, password);

        const { user, token } = await res.data;

        // If no error and we have user data, return it
        if (token) {
          return { ...user, jwt: token };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      session.user = token.user;
      session.jwt = token.jwt;
      return session;
    },
    async jwt({ token, user }: any) {
      if (!user) return Promise.resolve(token);

      token.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
      };
      token.jwt = user.jwt;

      return Promise.resolve(token);
    },
    async signIn({ account, profile }) {
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
