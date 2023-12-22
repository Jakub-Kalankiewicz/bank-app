"use client";

import useToast from "@/app/hooks/useToast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPasswordPage = () => {
  const { toastNotify } = useToast();
  const router = useRouter();
  const token = useParams().token;
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.get(`/api/reset_password/${token}`);
        if (res.status !== 200) {
          toastNotify("error", "Invalid token");
          router.push("/");
        }
      } catch (err: any) {
        toastNotify("error", err.response.data);
        router.push("/");
      }
    };
    validateToken();
  }, []);
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-32 py-24 sm:py-32">
      <h2 className="text-4xl font-bold tracking-wide text-black sm:text-6xl up font-lora">
        Reset Password Form
      </h2>
      <div className="flex max-w-5xl justify-center items-center mx-auto gap-12 group mt-10 text-center">
        <ResetPasswordForm token={token!} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
