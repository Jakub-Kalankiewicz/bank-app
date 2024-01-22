"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileForm from "./components/ProfileForm";
import axios from "axios";
import useToast from "../hooks/useToast";

interface SaveUserDataProps {
  name: string;
  surname: string;
  email: string;
  amount: string;
  accountNumber: string;
  saveCardNumber: string;
  saveIdNumber: string;
}

const Profile = () => {
  const [saveUserData, setSaveUserData] = useState<SaveUserDataProps>({
    name: "",
    surname: "",
    email: "",
    amount: "",
    accountNumber: "",
    saveCardNumber: "",
    saveIdNumber: "* * - * * *",
  });
  const session = useSession();
  const router = useRouter();
  const { toastNotify } = useToast();
  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/");
    }
  }, [session?.status, router]);
  useEffect(() => {
    const fetchUserSaveData = async () => {
      axios
        .get("/api/user/save")
        .then((res) => {
          if (res.status !== 200)
            toastNotify("error", "Error fetching user details");
          setSaveUserData({
            name: res.data.name,
            surname: res.data.surname,
            email: res.data.email,
            amount: res.data.amount,
            accountNumber: res.data.accountNumber,
            saveCardNumber: res.data.cardNumber,
            saveIdNumber: "* * - * * *",
          });
        })
        .catch((err) => {
          toastNotify("error", "Error fetching user details");
        });
    };
    if (session?.data?.user?.name) fetchUserSaveData();
  }, [session?.data?.user?.name]);
  return (
    <>
      {session.data?.user.name && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-32 py-24 sm:py-32">
          <h2 className="text-4xl font-bold tracking-wide text-black sm:text-6xl up font-lora">
            Profile
          </h2>
          <div className="flex max-w-5xl justify-center items-center mx-auto gap-12 group mt-10 bg-gold-200/30 p-10 rounded-2xl shadow-2xl ">
            <ProfileForm saveUserData={saveUserData} />
          </div>
        </section>
      )}
    </>
  );
};

export default Profile;
