import Button from "@/app/components/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  newPassword: string;
  confirmPassword: string;
};

interface Props {
  token: string | string[];
}

const ResetPasswordForm = ({ token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Inputs>({
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePassword = (data: Inputs, token: string | string[]) => {
    axios
      .post("/api/change_password", { ...data, token })
      .then((res) => {
        if (res.status === 200) {
          reset();
          setIsLoading(false);
          router.push("/");
        } else {
          setError({ newPassword: res.data, confirmPassword: res.data });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setError({
          newPassword: err.response.data,
          confirmPassword: err.response.data,
        });
        setIsLoading(false);
      });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    changePassword(data, token);
  };

  return (
    <form
      className="space-y-6 flex flex-col justify-center items-center w-3/4 mt-10 mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full">
        <div className="relative h-10 w-full shadow-lg inline-flex justify-center items-center">
          <input
            type="password"
            placeholder="Password"
            className="peer h-full w-full rounded-[7px] border border-black-200 border-t-transparent bg-white px-4 py-3.5 font-sans text-sm font-normal text-black-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gold-700 placeholder-shown:border-t-black-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-black-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            {...register("newPassword", {
              required: "This field is required",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                message:
                  "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
              },
            })}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-black-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-black-500">
            Password
          </label>
          {errors.newPassword && (
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
        {errors.newPassword && (
          <p className="text-left ml-3 mt-1 text-red-500 text-sm">
            {errors.newPassword.message}
          </p>
        )}
      </div>
      <div className="w-full">
        <div className="relative h-10 w-full shadow-lg inline-flex justify-center items-center">
          <input
            type="password"
            placeholder="Confirm Password"
            className="peer h-full w-full rounded-[7px] border border-black-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-black-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gold-700 placeholder-shown:border-t-black-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-black-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            {...register("confirmPassword", {
              required: "This field is required",
              validate: (value) =>
                value === watch("newPassword") || "The passwords do not match",
            })}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-black-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-black-500">
            Confirm Password
          </label>
          {errors.confirmPassword && (
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
        {errors.confirmPassword && (
          <p className="text-left ml-3 mt-1 text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="w-1/3">
        <Button fullWidth onClick={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
