"use client"

import Link from "next/link"
import { useState, useEffect, useTransition } from "react"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [state, setState] = useState({ message: "", status: "" })
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (state.message) {
      console.log("Login Action State:", state)
    }
  }, [state])

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await loginAction(state, formData)
      setState(result)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-v0-dark-blue px-4 py-8">
      <Card className="w-full max-w-md rounded-xl border-none bg-v0-dark-blue shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-4xl font-bold text-v0-text-light">Welcome Back,</CardTitle>
          <CardDescription className="text-v0-text-light/80">
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-v0-text-light">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
                className="rounded-lg border-none bg-white py-6 text-base text-v0-text-dark placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-v0-text-light">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                className="rounded-lg border-none bg-white py-6 text-base text-v0-text-dark placeholder:text-gray-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-v0-purple py-6 text-lg font-semibold text-v0-text-light hover:bg-v0-purple/90"
            >
              {isPending ? "Logging In..." : "Login"}
            </Button>
            {state.message && (
              <p className={`text-center text-sm ${state.status === "error" ? "text-red-500" : "text-green-500"}`}>
                {state.message}
              </p>
            )}
          </form>
          <div className="mt-6 text-center text-sm text-v0-text-light">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-v0-purple underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
