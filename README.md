# NextAuth Authentication Project

This project provides a complete authentication system using **Next.js (App Router)** and **NextAuth.js**, integrated with a custom backend API.

## Features

*   User Signup & Login
*   Email Verification (OTP-based)
*   Protected Dashboard Route
*   Modern UI with Tailwind CSS & shadcn/ui

## Screenshots

<img width="657" height="414" alt="image" src="https://github.com/user-attachments/assets/06008ffe-eb28-4a4a-842a-4a658432c1f3" />



Login Page:


<img width="752" height="463" alt="image" src="https://github.com/user-attachments/assets/11e40d15-2300-458f-bcf1-1458ea9a557c" />



Signup Page:


<img width="751" height="463" alt="image" src="https://github.com/user-attachments/assets/6c16f107-fd35-4d42-8e15-893958cba0d1" />



Verify Email Page:


<img width="753" height="439" alt="image" src="https://github.com/user-attachments/assets/455f7846-abc1-4382-b571-49cf2c3f7a16" />

    
## Getting Started

1.  **Clone the repository:**
    \`\`\`bash
    git clone <your-repository-url>
    cd nextautho
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install --legacy-peer-deps
    \`\`\`
    *(Use `--legacy-peer-deps` if you encounter peer dependency issues.)*

3.  **Initialize shadcn/ui (if not already done):**
    \`\`\`bash
    npx shadcn@latest init
    npx shadcn@latest add button card input label
    \`\`\`

4.  **Environment Variables:**
    Create a `.env.local` file in the root and add:
    \`\`\`
    NEXTAUTH_SECRET="YOUR_VERY_LONG_RANDOM_SECRET_STRING"
    NEXTAUTH_URL="http://localhost:3000"
    \`\`\`

5.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is open-source under the MIT License.
