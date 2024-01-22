"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@/app/components/Button";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MaskedInput from "@/app/components/input/MaskedInput";
import LoadingModal from "@/app/components/modals/LoadingModal";
import useToast from "@/app/hooks/useToast";

type Inputs = {
  email: string;
  password: string[];
};

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/home");
    }
  }, [session?.status, router]);
  const { toastNotify } = useToast();

  const [errorEmail, setErrorEmail] = useState<String>("");
  const [errorPassword, setErrorPassword] = useState<String>("");
  const [provideEmail, setProvideEmail] = useState(true);
  const [providePassword, setProvidePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Inputs>({
    email: "",
    password: [],
  });
  const [passwordMask, setPasswordMask] = useState<String>("");
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };
  const onChangePassword = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setFormData((currentFormData) => {
      const newFormData = { ...currentFormData };
      newFormData.password[index] = e.target.value;
      return newFormData;
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: [],
    },
  });

  if (session?.status === "loading" || session?.status === "authenticated") {
    return <LoadingModal />;
  }

  const onForgotPassword = () => {
    axios
      .post("/api/reset_password", { email: formData.email })
      .then((res) => {
        if (res?.status !== 200) {
          router.push("/");
        } else {
          toastNotify("success", "Sucessfully sent reset password link");
          console.log(
            `Użytkownik poprosił o zmianę hasła, wysłałbym mu link: \n${res?.data?.url}\nna adres maila: ${res?.data?.email}`
          );
        }
      })
      .catch((err) => {
        router.push("/");
        toastNotify("error", "Something went wrong");
      });
  };

  const onSubmit: SubmitHandler<Inputs> = () => {
    setIsLoading(true);
    signIn("credentials", {
      email: formData.email,
      password: formData.password.join(""),
      redirect: false,
    })
      .then((res) => {
        if (res?.error) {
          setErrorPassword(res.error);
        }
        if (res?.ok) {
          router.push("/home");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const switchLogin = () => {
    setIsLoading(true);

    if (!formData.email.includes("@")) {
      setErrorEmail("Invalid email");
      setIsLoading(false);
      return;
    }

    axios
      .post("/api/get_password", {
        email: formData.email,
      })
      .then((res) => {
        if (res?.status !== 200) {
          router.push("/");
        } else {
          if (res?.data) {
            setPasswordMask(res?.data?.mask);
            setProvideEmail(false);
            setProvidePassword(true);
            setFormData({ email: formData.email, password: [] });
          }
        }
      })
      .catch((err) => {
        setErrorEmail("Email not found");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="mt-10 max-w-xl w-full ">
      <form
        className="space-y-6 flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {provideEmail && (
          <div className=" w-full max-w-md">
            <label
              htmlFor="email"
              className="block text-md font-medium leading-6 text-black"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "This field is required",
                  disabled: isLoading,
                })}
                onChange={onChangeEmail}
                className="block w-full rounded-md border-0 py-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gold-500 placeholder:text-gold-500 focus:ring-2 focus:ring-inset focus:ring-black sm:text-xl sm:leading-6 pl-2"
              />
            </div>
            {errorEmail ? (
              <p className="text-left ml-3 mt-1 text-red-500 text-sm">
                {errorEmail}
              </p>
            ) : (
              errors.email && (
                <p className="text-left ml-3 mt-1 text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )
            )}
          </div>
        )}
        {providePassword && (
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium leading-6 text-black">
                Password
              </label>
              <div className="text-sm">
                <button
                  className="font-semibold text-black hover:text-gold-500"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <div className="mt-2 w-full">
              <MaskedInput
                mask={passwordMask}
                register={register}
                isLoading={isLoading}
                onChange={onChangePassword}
              />
            </div>
            {errorPassword && (
              <p className="text-left ml-3 mt-1 text-red-500 text-sm">
                {errorPassword}
              </p>
            )}
          </div>
        )}

        <div className="w-full max-w-md">
          <Button
            fullWidth
            type={provideEmail ? "button" : "submit"}
            onClick={provideEmail ? switchLogin : undefined}
            disabled={
              !isLoading
                ? provideEmail
                  ? formData.email
                    ? false
                    : true
                  : false
                : true
            }
          >
            {provideEmail ? "Continue" : providePassword ? "Sign in" : null}
          </Button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{" "}
        <a
          href="#"
          className="font-semibold leading-6 text-gold-600 hover:text-gold-500"
        >
          Start a 14 day free trial
        </a>
      </p>
    </div>
  );
};

export default AuthForm;
