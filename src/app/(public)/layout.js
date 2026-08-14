"use client";

import { useAuth } from "@/context/AuthContext";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/routes";

export default function PublicLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!loading && user) {
      router.replace(routes.dashboard);
    }
  }, [user, loading, router]);

  // Show loader until auth resolves or redirect starts
  if (loading || user) {
    return (
      <div style={styles.loader}>
        <Spin size="large" />
      </div>
    );
  }

  // Not logged in → show public page
  return <>{children}</>;
}

const styles = {
  loader: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
  },
};
