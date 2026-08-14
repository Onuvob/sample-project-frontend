"use client";

import React, { useState, useMemo } from "react";
import { Layout, Menu, Dropdown, Button, Space, Breadcrumb, theme } from "antd";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useMenu } from "@/context/MenuContext";
import { routes } from "@/routes";
import { useAuth } from "@/context/AuthContext"; // import hook
import PageLoader from "@/components/common/PageLoader";
import ServiceUnavailable from "./common/ServiceUnavailable";

const { Header, Sider, Content, Footer } = Layout;

export default function AppLayout({ children, breadcrumb }) {
  // const { setUser } = useAuth(); // get setUser from AuthContext
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { menu, loading, error, refreshMenu } = useMenu();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Toggle sidebar
  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Find active menu key

  // Returns an array of keys to open the parent menus and select the active menu
  const getActiveMenuKeys = (items, path) => {
    for (const item of items) {
      if (item.path && path.startsWith(item.path)) {
        return [item.key]; // match parent if path starts with
      }
      if (item.children) {
        const childKeys = getActiveMenuKeys(item.children, path);
        if (childKeys.length) {
          return [item.key, ...childKeys]; // include parent keys
        }
      }
    }
    return [];
  };

  const activeKeys = useMemo(
    () => getActiveMenuKeys(menu, pathname),
    [menu, pathname]
  );

  // Navigate on menu click
  const handleMenuClick = ({ key }) => {
    const findPath = (items, k) => {
      for (const item of items) {
        if (item.key === k && item.path) return item.path;
        if (item.children) {
          const found = findPath(item.children, k);
          if (found) return found;
        }
      }
      return null;
    };
    const path = findPath(menu, key);
    if (path) router.push(path);
  };

  // User dropdown
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null); // update context to null
    router.push(routes.login);
  };

  const dropdownMenu = [
    {
      key: "profile",
      label: <span onClick={() => router.push(routes.profile)}>Profile</span>,
    },
    { key: "logout", label: <span onClick={handleLogout}>Logout</span> },
  ];

  // if (loading) {
  //   return <PageLoader />;
  // }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            color: "#fff",
            fontSize: 22,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "BV" : "Practice"}
        </div>
        {loading ? (
          <PageLoader />
        ) : error ? (
          <ServiceUnavailable message="Menu service unavailable" onReload={refreshMenu} />
        ) : (
          <Menu
            theme="dark"
            mode="inline"
            items={menu}
            selectedKeys={
              activeKeys.length ? [activeKeys[activeKeys.length - 1]] : []
            }
            defaultOpenKeys={activeKeys.slice(0, -1)}
            onClick={handleMenuClick}
          />
        )}
      </Sider>

      {/* Main layout */}
      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            onClick={toggleCollapsed}
            style={{ fontSize: 18 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight">
            <Button type="text">
              <Space>
                <UserOutlined />
                {user?.username || "User"}
              </Space>
            </Button>
          </Dropdown>
        </Header>

        <Content style={{ margin: "16px" }}>
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: 16 }} items={breadcrumb || []} />

          {/* Content */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Custom App ©{new Date().getFullYear()} Created by Sonjoy Tripura
        </Footer>
      </Layout>
    </Layout>
  );
}
