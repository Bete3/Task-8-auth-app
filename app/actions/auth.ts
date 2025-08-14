"use server"

import { signIn } from "next-auth/react"

export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const role = "user" 

  if (password !== confirmPassword) {
    return { message: "Passwords do not match.", status: "error" }
  }

  try {
    const res = await fetch("https://akil-backend.onrender.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, confirmPassword, role }),
    })

    if (!res.ok) {
      const errorText = await res.text() // Read as text if not OK
      console.error(`Signup API responded with status ${res.status}: ${errorText}`)
      return { message: `Signup failed: ${errorText || "Server error"}`, status: "error" }
    }

    let data
    try {
      data = await res.json() // Attempt to parse JSON
    } catch (jsonError) {
      const rawText = await res.text() // Get raw text if JSON parsing fails
      console.error("Failed to parse signup response as JSON:", rawText, jsonError)
      return { message: "Signup failed: Invalid response from server.", status: "error" }
    }

    return {
      message: data.message || "Signup successful! Please verify your email.",
      status: "success",
      redirectUrl: `/verify-email?email=${encodeURIComponent(email)}`,
    }
  } catch (error) {
    console.error("Error during signup fetch or processing:", error)
    return { message: "An unexpected error occurred. Please try again later.", status: "error" }
  }
}

export async function verifyEmailAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const otp = formData.get("otp") as string

  try {
    const res = await fetch("https://akil-backend.onrender.com/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, OTP: otp }), 
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Verify Email API responded with status ${res.status}: ${errorText}`)
      return { message: `Verification failed: ${errorText || "Server error"}`, status: "error" }
    }

    let data
    try {
      data = await res.json()
    } catch (jsonError) {
      const rawText = await res.text()
      console.error("Failed to parse verify email response as JSON:", rawText, jsonError)
      return { message: "Verification failed: Invalid response from server.", status: "error" }
    }

    // Return a success message and the URL to redirect to
    return {
      message: data.message || "Verification successful!",
      status: "success",
      redirectUrl: "/login?verified=true",
    }
  } catch (error) {
    console.error("Error during email verification fetch or processing:", error)
    return { message: "An unexpected error occurred. Please try again later.", status: "error" }
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const result = await signIn("credentials", {
      redirect: false, // Do not redirect automatically
      email,
      password,
    })

    if (result?.error) {
      return { message: "Invalid credentials. Please check your email and password.", status: "error" }
    }

    return {
      message: "Login successful!",
      status: "success",
      redirectUrl: "/dashboard", // You can change this to your desired post-login page
    }
  } catch (error) {
    console.error("Error during login:", error)
    return { message: "An unexpected error occurred. Please try again later.", status: "error" }
  }
}

