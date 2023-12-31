import nextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            token: string,
            id: string,
            userName: string,
            email: string,
            role: string[]
        }

    }
}