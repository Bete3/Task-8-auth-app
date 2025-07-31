import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// For debugging: Check if NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  console.error("CRITICAL ERROR: NEXTAUTH_SECRET environment variable is not set!")
  console.error("Please ensure it's defined in your .env.local file or deployment environment.")
  // In a production environment, you might want to throw an error here to prevent startup
  // throw new Error("NEXTAUTH_SECRET is not defined");
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          // This path is typically for when signIn is called without credentials,
          // or when NextAuth tries to re-authenticate a session.
          // It should return null, which NextAuth handles.
          return null
        }

        try {
          const res = await fetch("https://akil-backend.onrender.com/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) {
            const errorText = await res.text() // Read as text if not OK
            console.error(`Login API responded with status ${res.status}: ${errorText}`)
            // Return null to indicate authentication failure
            return null
          }

          let data
          try {
            data = await res.json() // Attempt to parse JSON
          } catch (jsonError) {
            const rawText = await res.text() // Get raw text if JSON parsing fails
            console.error("Failed to parse login response as JSON:", rawText, jsonError)
            console.error("Raw response text:", rawText) // Log raw text for debugging
            return null
          }

          if (data.accessToken) {
            // Return user object with accessToken
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              accessToken: data.accessToken,
            }
          } else {
            console.error("Login failed: No accessToken in response or invalid data structure.", data)
            return null
          }
        } catch (error) {
          console.error("Error during login fetch or processing:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.user.email = token.email
      session.user.name = token.name
      return session
    },
  },
  pages: {
    signIn: "/login", // Specify the custom login page
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
