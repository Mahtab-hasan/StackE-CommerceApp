import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Vero - E-Commerce",
  description: "E-Commerce with Next.js and Vero",
}


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className} antialiased text-gray-700`} suppressHydrationWarning>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
