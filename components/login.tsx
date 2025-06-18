'use client';

import Head from "next/head";
import LoginBotton from "./loginBotton"

export default function Login() {
  return (
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>
      <main className="flex h-20 justify-between items-center bg-black ">
        <h1 className="text-4xl font-serif text-center ml-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          ♠Black Jack♠
        </h1>
        <LoginBotton />
      </main>
    </>
  );
}