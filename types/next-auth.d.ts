import "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    district: string
    subDistrict: string
  }

  interface Session {
    user: User & {
      id: string
      role: string
      district: string
      subDistrict: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    district: string
    subDistrict: string
  }
} 