
"use client"
import { Josefin_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/Theme-Provider";
import { Toaster } from "react-hot-toast"
import { Providers } from "./Provider";
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Poppins',
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Josefin',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" >
      <body
        className={`${poppins.variable} ${josefin.variable} ! bg-no-repeat bg-white dark:bg-gradient-to-b dark:to-black duration-300 dark:from-gray-500`}
      >
        <Providers>
          <ThemeProvider defaultTheme="system" attribute="class">
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
