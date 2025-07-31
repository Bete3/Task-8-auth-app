"use client"

import Link from "next/link"
import { useState, useEffect, useTransition } from "react"
import { signupAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRouter } from "next/navigation" // Import useRouter

export default function SignupPage() {
  const [state, setState] = useState({ message: "", status: "", redirectUrl: "" }) // Added redirectUrl to state
  const [isPending, startTransition] = useTransition()
  const router = useRouter() // Initialize useRouter

  useEffect(() => {
    if (state.message) {
      console.log("Signup Action State:", state)
    }
    if (state.redirectUrl && state.status === "success") {
      router.push(state.redirectUrl) // Perform client-side redirect
    }
  }, [state, router])

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await signupAction(state, formData)
      setState(result)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-v0-gray px-4 py-8">
      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-3xl font-bold text-v0-dark-blue">Sign Up Today!</CardTitle>
          <Button
            variant="outline"
            className="w-full rounded-full border-gray-300 py-6 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 bg-transparent"
          >
            <Image src="/google-icon.png" alt="Google icon" width={20} height={20} className="mr-2" />
            Sign Up with Google
          </Button>
          <div className="relative flex items-center justify-center text-sm text-gray-500">
            <span className="absolute left-0 right-0 h-px bg-gray-300" />
            <span className="relative z-10 bg-white px-2">Or Sign Up with Email</span>
          </div>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-v0-dark-blue">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                required
                className="rounded-lg border-gray-300 py-6 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-v0-dark-blue">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
                className="rounded-lg border-gray-300 py-6 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-v0-dark-blue">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                className="rounded-lg border-gray-300 py-6 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-v0-dark-blue">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Enter password"
                required
                className="rounded-lg border-gray-300 py-6 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-v0-purple py-6 text-lg font-semibold text-v0-text-light hover:bg-v0-purple/90"
            >
              {isPending ? "Signing Up..." : "Continue"}
            </Button>
            {state.message && (
              <p className={`text-center text-sm ${state.status === "error" ? "text-red-500" : "text-green-500"}`}>
                {state.message}
              </p>
            )}
          </form>
          <div className="mt-6 text-center text-sm text-v0-dark-blue">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-v0-purple underline">
              Login
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            By clicking &apos;Continue&apos;, you acknowledge that you have read and accepted our{" "}
            <Link href="#" className="font-semibold text-v0-purple underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-semibold text-v0-purple underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
