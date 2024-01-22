import type { Metadata } from "next";
import "./globals.css";
import AuthContext from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

export const metadata: Metadata = {
  title: "Prosperity Nexus Bank",
  description:
    "Prosperity Nexus Bank, a modern financial institution, combines cutting-edge technology with personalized customer service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gold-100">
      <body>
        <AuthContext>
          <ToastProvider>{children}</ToastProvider>
        </AuthContext>
      </body>
    </html>
  );
}
