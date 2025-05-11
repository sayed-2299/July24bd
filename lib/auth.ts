import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "./mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export interface UserSession {
  id: string
  email: string
  name: string
  role: string
  profileCompleted: boolean
}

export interface UserToken {
  id: string
  email: string
  name: string
  role: string
  profileCompleted: boolean
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
          profileCompleted: user.profileCompleted
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.profileCompleted = user.profileCompleted
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.profileCompleted = token.profileCompleted as boolean
      }
      return session
    }
  },
  pages: {
    signIn: "/signin",
    error: "/signin"
  },
  session: {
    strategy: "jwt"
  }
} 