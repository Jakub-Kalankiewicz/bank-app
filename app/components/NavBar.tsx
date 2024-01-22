"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingModal from "../components/modals/LoadingModal";
import Menu from "./Menu";

interface NavBarProps {
  height?: string;
}

const NavBar: React.FC<NavBarProps> = ({ height }) => {
  const [balance, setBalance] = useState<string>("");
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.data?.balance) {
      setBalance(session?.data?.balance.toString());
    }
  }, [session?.data?.balance]);
  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/");
    }
    if (session?.data?.expires && Number(session?.data?.expires) < Date.now()) {
      signOut();
    }
  }, [session?.status, router]);

  if (session?.status === "loading" || session?.status === "unauthenticated") {
    return <LoadingModal />;
  }
  return (
    <>
      <nav className="bg-gold-100 text-black shadow-sm font-mono">
        <div className="flex justify-evenly items-center h-20">
          <div className="flex items-center justify-center space-x-4 w-1/3">
            <Link href="/home">
              <img
                src={"/images/logo_1.png"}
                alt="logo"
                width={64}
                height={64}
              />
            </Link>
            <h1 className="text-3xl font-bold leading-9 tracking-tight text-black font-lora uppercase italic">
              Prosperity Nexus Bank
            </h1>
          </div>
          <div className="flex items-center justify-center w-1/3">
            <img
              src={"/images/gold_icon2.png"}
              alt="logo"
              width={80}
              height={80}
            />
          </div>
          <div className="w-1/3 flex justify-evenly items-center">
            <Menu />
            <div className="flex justify-center items-center gap-10">
              <h2 className="text-lg mt-[5px]">{balance}zł</h2>
              <Link
                href="/profile"
                className="flex justify-center items-center gap-5 "
              >
                <h2 className="text-3xl font-semibold leading-9 tracking-tight text-gold-500 font-lora">
                  {session?.data?.user?.name}
                </h2>
                <img
                  src={"/images/placeholder.jpg"}
                  alt="users profile image"
                  className=" h-16 w-auto rounded-full hover:shadow-2xl transition-all duration-500 ease-in-out"
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div
        style={{
          background: "linear-gradient(to top, #0a0f0d, #1a2a2d)",
          height: height ? height : "40%",
          color: "white",
        }}
        className="flex justify-center items-center"
      >
        <hr className="w-full ml-20 border-gold-300" />
        <img
          src={"/images/gold_icon.png"}
          alt="logo"
          className="h-1/3 w-auto"
        />
        <hr className="w-full  border-gold-300" />
        <img
          src={"/images/logo_home.png"}
          alt="logo"
          className="h-full w-auto"
        />
        <hr className="w-full  border-gold-300" />
        <img
          src={"/images/gold_icon.png"}
          alt="logo"
          className="h-1/3 w-auto"
        />
        <hr className="w-full mr-20 border-gold-300" />
      </div>
    </>
  );
};

export default NavBar;
