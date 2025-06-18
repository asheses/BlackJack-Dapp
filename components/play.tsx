'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import SendTransactionPage from "./sendTransaction"

export default function PlayPage() {
  const router = useRouter();
  const {
    ready,
    authenticated,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <main className="flex flex-col px-4 sm:px-20 py-6 sm:py-10 bg-purple-400 h-[900px] w-full min-w-[1400px]">
      <SendTransactionPage />
    </main>
  );
}