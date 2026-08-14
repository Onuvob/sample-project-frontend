"use client";

import { createContext, useContext, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  DashboardOutlined,
  CarOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const MenuContext = createContext({
  menu: [],
});

const ADMIN_MENU = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "vehicles",
    icon: <CarOutlined />,
    label: "Vehicles",
    path: "/admin/vehicles",
  },
  {
    key: "routes",
    icon: <EnvironmentOutlined />,
    label: "Routes",
    path: "/admin/routes",
  },
  {
    key: "pilots",
    icon: <TeamOutlined />,
    label: "Pilots",
    path: "/admin/pilots",
  },
  {
    key: "coupons",
    icon: <GiftOutlined />,
    label: "Coupons",
    path: "/admin/coupons",
  },
  {
    key: "bookings",
    icon: <BookOutlined />,
    label: "Bookings",
    path: "/admin/bookings",
  },
];

const OWNER_MENU = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "vehicles",
    icon: <CarOutlined />,
    label: "My Vehicles",
    path: "/owner/vehicles",
  },
  {
    key: "routes",
    icon: <EnvironmentOutlined />,
    label: "Routes",
    path: "/owner/routes",
  },
  {
    key: "coupons",
    icon: <GiftOutlined />,
    label: "My Coupons",
    path: "/owner/coupons",
  },
  {
    key: "bookings",
    icon: <BookOutlined />,
    label: "My Bookings",
    path: "/owner/bookings",
  },
];

export function MenuProvider({ children }) {
  const { user } = useAuth();

  const menu = useMemo(() => {
    if (!user) return [];

    return user.role === "ADMIN" ? ADMIN_MENU : OWNER_MENU;
  }, [user]);

  return (
    <MenuContext.Provider value={{ menu }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);