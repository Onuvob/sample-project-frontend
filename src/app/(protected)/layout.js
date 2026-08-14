"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";
import { useAuth } from "@/context/AuthContext";
import { useMenu } from "@/context/MenuContext";
import { routes } from "@/routes";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { loading: menuLoading } = useMenu();

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(routes.login);
    }
  }, [authLoading, user, router, pathname]);

  // Global app loader
  if (authLoading || menuLoading) {
    return (
      <div style={styles.loader}>
        <Spin size="large" />
      </div>
    );
  }

  // Auth resolved but no user (redirect in progress)
  if (!user) return null;

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
