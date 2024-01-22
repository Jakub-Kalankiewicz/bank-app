import AuthForm from "./components/AuthForm";

const Auth = () => {
  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div className="w-full pr-32 mb-20">
          <h1 className="text-right text-8xl font-bold leading-10 tracking-tight text-gold-500 font-lora mb-[-3rem]">
            Prosperity Nexus Bank
          </h1>
        </div>
        <div className="sm:mx-auto sm:w-full flex  items-center justify-evenly">
          <div className="flex justify-center items-center">
            <img
              src={"images/logo_2.png"}
              alt="Your Company"
              className="w-full"
            />
          </div>
          <div className="flex flex-col items-center ml-[-100px] mt-[-3rem] ">
            <h2 className="my-6 text-center text-7xl font-semibold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <AuthForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
