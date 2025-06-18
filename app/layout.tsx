import '../styles/globals.css';
import PrivyProvider from "../components/privy-provider";
import { Metadata } from "next";
import Head from 'next/head';

import Login from "../components/login";
export const metadata: Metadata = {
  title: "Black Jack",
  description: "Black Jack",
};



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" >
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