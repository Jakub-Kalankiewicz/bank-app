"use client";

import { ReactNode, createContext, useMemo } from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastContextProps {
  toastNotify: (
    type: ToastType,
    message: string,
    position?: ToastPosition
  ) => void;
}

export const ToastContext = createContext<ToastContextProps>({
  toastNotify: () => {},
});

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toastNotify = useMemo(
    () =>
      (
        type: ToastType,
        message: string,
        position: ToastPosition = "top-right"
      ) => {
        toast[type](message, {
          position,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      },
    []
  );

  const contextValue = useMemo(() => ({ toastNotify }), [toastNotify]);

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
}
