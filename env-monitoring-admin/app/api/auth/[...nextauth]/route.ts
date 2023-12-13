import { formatServerErrors } from "@/actions/secondary-utils/errorHandling"
import { CustomServerResponse } from "@/types"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const link = process.env.NEXT_PUBLIC_API_URL

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                const res = await fetch(`${link}api/Auth/Login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        userName: credentials?.username,
                        password: credentials?.password
                    }),
                    headers: {
                        'accept': 'text/plain',
                        'Content-Type': 'application/json'
                    },
                })
                if (!res.ok) {
                    const responseBody = await res.json() as CustomServerResponse;
                    throw new Error(formatServerErrors(responseBody.errorMessages));
                }

                const user = await res.json()
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user.result
                }
                // && user.result.role.includes('Admin')

                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    pages: {
        signIn: '/signIn',
    },
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }: { session: any, token: any, user: any }) {
            session.user = token as any;
            return session;
        },
        async signIn({ user }: { user: any }) {
            const isAllowedToSignIn = user.role.includes('Admin')
            if (isAllowedToSignIn) {
                return true
            } else {
                throw new Error('Access denied')
            }
        }

    },
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }