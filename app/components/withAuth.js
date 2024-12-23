"use client"
import { redirect } from "next/navigation";

export default function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        redirect("/login");
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };
}
