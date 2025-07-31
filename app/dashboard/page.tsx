
"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

declare module "next-auth" {
  interface User {
    accessToken?: string
    id?: string
    name?: string | null
    email?: string | null
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-4 text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You need to be logged in to view this page.</p>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome, {session?.user?.name || session?.user?.email}!</CardTitle>
          <CardDescription>You are logged in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">This is a protected dashboard page.</p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Your User ID: {session?.user?.id}</p>
            <p className="text-sm text-muted-foreground">Your Access Token (for demonstration):</p>
            <textarea
              readOnly
              value={session?.user?.accessToken || "No token found"}
              className="w-full resize-y rounded-md border border-gray-300 bg-gray-50 p-2 text-xs font-mono dark:border-gray-700 dark:bg-gray-800"
              rows={5}
            />
          </div>
          <Button onClick={() => signOut()} className="w-full" variant="destructive">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
