import '../styles/globals.css';
import PrivyProvider from "../components/privy-provider";
import { Metadata } from "next";
import localFont from 'next/font/local'
import Head from 'next/head';

import Login from "../components/login";
export const metadata: Metadata = {
  title: "Black Jack",
  description: "Black Jack",
};

const adelleSans = localFont({
  src: [
    {
      path: '../public/fonts/AdelleSans-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/AdelleSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/AdelleSans-Semibold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/AdelleSans-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" className={`${adelleSans.className}`}>
      <Head>
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
      </Head>
      <body>
        <PrivyProvider>
          <Login />
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}