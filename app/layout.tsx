import '../styles/globals.css';
import PrivyProvider from "../components/privy-provider";
import { Metadata } from "next";
import localFont from 'next/font/local'
import Head from 'next/head';
import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies()
  const cookieAuthToken = cookieStore.get("privy-token")?.value;

  if (cookieAuthToken) {
    const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
    const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

    try {
      const claims = await client.verifyAuthToken(cookieAuthToken);
      console.log({ claims });

    } catch (error) {
      console.error(error);
    }
  }
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