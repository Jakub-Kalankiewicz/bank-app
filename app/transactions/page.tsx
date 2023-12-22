"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Decimal } from "@prisma/client/runtime/library";
import TransactionList from "./components/TransactionList";
import { useSession } from "next-auth/react";
import useToast from "../hooks/useToast";

interface Transaction {
  id: number;
  amount: Decimal;
  createdAt: Date;
  title: string;
  recipientNumber: string;
  recipientName: string;
  senderNumber: string;
  senderName: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const session = useSession();
  const { toastNotify } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      axios
        .get("/api/transactions")
        .then((res) => {
          if (res?.status !== 200) {
            toastNotify("error", "Error fetching transactions");
          } else {
            setTransactions(res.data);
          }
        })
        .catch((err) => {
          toastNotify("error", err.response.data);
        });
    };
    if (session?.data?.user?.name) fetchTransactions();
  }, [session]);
  return (
    <>
      {session.data?.user.name && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-32 py-24 sm:py-32">
          <h2 className="text-4xl font-bold tracking-wide text-black sm:text-6xl up font-lora">
            Transactions
          </h2>
          <div className="flex justify-center items-center mt-20 w-full relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead
                className="text-xs text-gold-200 uppercase"
                style={{
                  background: "linear-gradient(to top, #0a0f0d, #1a2a2d)",
                }}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TransactionList key={transaction.id} {...transaction} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>No transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
