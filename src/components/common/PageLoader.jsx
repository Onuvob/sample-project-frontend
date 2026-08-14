"use client";

import { Spin } from "antd";

export default function PageLoader({ fullScreen = true }) {
  return (
    <div
      style={{
        minHeight: fullScreen ? "100vh" : "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
}
