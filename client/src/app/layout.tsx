import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/Theme-Provider";
import { Toaster } from "react-hot-toast"
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Poppins',
});

export const metadata = {
  icons: {
    icon: '/Logo.png',
  }
}
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
        <ThemeProvider defaultTheme="system" attribute="class">
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
