"use client"

import type React from "react"

import { useState, useRef, useEffect, useTransition } from "react"
import { verifyEmailAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState<string[]>(["", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [state, setState] = useState({ message: "", status: "" })
  const [isPending, startTransition] = useTransition()

  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last character
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendCode = () => {
    // Implement actual resend API call here
    console.log("Resending code to:", email)
    setCountdown(30)
    setCanResend(false)
    setOtp(["", "", "", ""]) 
    inputRefs.current[0]?.focus() 
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fullOtp = otp.join("")
    const formData = new FormData(event.currentTarget)
    formData.set("email", email)
    formData.set("otp", fullOtp)

    startTransition(async () => {
      const result = await verifyEmailAction(state, formData)
      setState(result)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-v0-gray px-4 py-8">
      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-3xl font-bold text-v0-dark-blue">Verify Email</CardTitle>
          <CardDescription className="text-gray-700">
            We&apos;ve sent a verification code to the email address you provided. To complete the verification process,
            please enter the code here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="email" value={email} />
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-16 w-16 rounded-xl border-2 border-v0-light-purple text-center text-3xl font-bold text-v0-dark-blue focus:border-v0-purple focus:ring-0"
                  inputMode="numeric"
                  pattern="[0-9]"
                />
              ))}
            </div>
            <div className="text-center text-sm text-gray-500">
              You can request to{" "}
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={!canResend || isPending}
                className="p-0 text-v0-purple underline"
              >
                Resend code
              </Button>{" "}
              in <span className="font-semibold">{`0:${countdown.toString().padStart(2, "0")}`}</span> seconds
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-v0-light-purple py-6 text-lg font-semibold text-v0-dark-blue hover:bg-v0-light-purple/80"
            >
              {isPending ? "Verifying..." : "Continue"}
            </Button>
            {state.message && (
              <p className={`text-center text-sm ${state.status === "error" ? "text-red-500" : "text-green-500"}`}>
                {state.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
