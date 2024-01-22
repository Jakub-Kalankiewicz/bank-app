import { Decimal } from "@prisma/client/runtime/library";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TransactionListProps {
  id: number;
  amount: Decimal;
  createdAt: Date;
  title: string;
  recipientNumber: string;
  senderNumber: string;
  recipientName: string;
  senderName: string;
}

const TransactionList = ({
  amount,
  createdAt,
  title,
  recipientName,
  senderName,
}: TransactionListProps) => {
  const session = useSession();

  const type =
    recipientName === session?.data?.user?.name ? "received" : "sent";

  const formatedDate = new Date(createdAt).toLocaleDateString("pl-PL");
  const formatedAmount = amount.toString();
  return (
    <tr className="bg-white border-b hover:bg-gray-100 cursor-pointer">
      <td className="px-6 py-4">{formatedDate}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        {title}
      </th>
      <td className="px-6 py-4">
        {type === "received" ? senderName : recipientName}
      </td>
      <td
        className={`px-6 py-4 ${
          type === "received" ? "text-green-500" : "text-red-400"
        }`}
      >
        {type === "received" ? formatedAmount : `-${formatedAmount}`} zł
      </td>
    </tr>
  );
};

export default TransactionList;
