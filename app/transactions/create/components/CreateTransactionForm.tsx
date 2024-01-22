"use client";

import Button from "@/app/components/Button";
import { Decimal } from "@prisma/client/runtime/library";
import axios from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useToast from "@/app/hooks/useToast";

type Inputs = {
  amount: Decimal;
  title: string;
  recipientNumber: string;
};

interface CreateTransaction {
  amount: Decimal;
  title: string;
  recipientNumber: string;
}

const CreateTransactionForm = () => {
  const { toastNotify } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();

  const updateBalance = async (balance: string) => {
    await update({ ...session, balance });
  };

  const createTransaction = ({
    amount,
    title,
    recipientNumber,
  }: CreateTransaction) => {
    axios
      .post("/api/create_transaction", {
        amount,
        title,
        recipientNumber,
      })
      .then(async (res) => {
        if (res.data) {
          await updateBalance(res.data).then(() => {
            router.push("/transactions");
            toastNotify("success", "Transaction created successfully");
          });
        } else {
          toastNotify("error", "Error creating transaction");
        }
      })
      .catch((err) => {
        toastNotify("error", err.response.data);
      })
      .finally(() => {
        setIsLoading(false);
        reset();
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      amount: "",
      title: "",
      recipientNumber: "",
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    createTransaction({
      amount: data.amount,
      title: data.title,
      recipientNumber: data.recipientNumber,
    });
  };

  return (
    <form
      className="space-y-6 flex flex-col justify-center items-center w-3/4 mt-10 mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full">
        <div className="relative h-10 w-full shadow-lg inline-flex justify-center items-center">
          <input
            placeholder="Recipient Account Number"
            className="peer h-full w-full rounded-[7px] border border-black-200 border-t-transparent bg-white px-4 py-3.5 font-sans text-sm font-normal text-black-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gold-700 placeholder-shown:border-t-black-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-black-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            {...register("recipientNumber", {
              required: "This field is required",
              pattern: {
                value: /^\d+$/i,
                message: "Please enter a valid account number",
              },
            })}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-black-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-black-500">
            Recipient Account Number
          </label>
          {errors.recipientNumber && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 absolute right-3 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          )}
        </div>
        {errors.recipientNumber && (
          <p className="text-left ml-3 mt-1 text-red-500 text-sm">
            {errors.recipientNumber.message}
          </p>
        )}
      </div>
      <div className="w-full">
        <div className="relative h-10 w-full shadow-lg inline-flex justify-center items-center">
          <input
            type="text"
            min={0}
            max={10000}
            placeholder="Amount"
            className="peer h-full w-full rounded-[7px] border border-black-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-black-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gold-700 placeholder-shown:border-t-black-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-black-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            {...register("amount", {
              required: "This field is required",
              pattern: {
                value: /^\d+(\.\d{0,2})?$/i,
                message: "Please enter a valid amount",
              },
              min: {
                value: 0,
                message: "Value is too low",
              },
              max: {
                value: 10000,
                message: "Value is too high",
              },
            })}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-black-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-black-500">
            Amount
          </label>
          {errors.amount && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 absolute right-3 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          )}
        </div>
        {errors.amount && (
          <p className="text-left ml-3 mt-1 text-red-500 text-sm">
            {errors.amount.message}
          </p>
        )}
      </div>
      <div className="w-full">
        <div className="relative h-10 w-full shadow-lg inline-flex justify-center items-center">
          <input
            type="text"
            placeholder="Title"
            className="peer h-full w-full rounded-[7px] border border-black-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-black-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gold-700 placeholder-shown:border-t-black-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-black-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            {...register("title", { required: "This field is required" })}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-black-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-black-500">
            Title
          </label>
          {errors.title && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 absolute right-3 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          )}
        </div>
        {errors.title && (
          <p className="text-left ml-3 mt-1 text-red-500 text-sm">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="w-1/3">
        <Button fullWidth onClick={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CreateTransactionForm;
