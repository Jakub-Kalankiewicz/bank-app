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
    criteriaMode: "all",
  });

  const calculateEntropy = (password: string) => {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charsetSize += 32;

    return password.length * Math.log2(charsetSize);
  };

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
              validate: {
                entropy: (value) =>
                  calculateEntropy(value) >= 60
                    ? true
                    : "Password entropy is too low",
              },
            })}
          />
          <label className="...">Password</label>
          {errors.newPassword && <svg className="...">...</svg>}
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
          <label className="...">Confirm Password</label>
          {errors.confirmPassword && <svg className="...">...</svg>}
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
