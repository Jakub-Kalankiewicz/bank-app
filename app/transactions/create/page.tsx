"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateTranscactionForm from "./components/CreateTransactionForm";

const CreateTransaction = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-32 py-24 sm:py-32">
      <h2 className="text-4xl font-bold tracking-wide text-black sm:text-6xl up font-lora">
        Create Transaction
      </h2>
      <div className="flex max-w-5xl justify-center items-center mx-auto gap-12 group mt-10 text-center">
        <CreateTranscactionForm />
      </div>
    </section>
  );
};

export default CreateTransaction;
