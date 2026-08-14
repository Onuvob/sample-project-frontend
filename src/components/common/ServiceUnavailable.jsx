"use client";

import React from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

export default function ServiceUnavailable({ message = "Service unavailable", color = "#fff", onReload }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // vertical stacking
        justifyContent: "center", // vertical centering
        alignItems: "center", // horizontal centering
        height: "50%", // fill parent height
        padding: 16,
        color: color,
        textAlign: "center",
      }}
    >
      <p style={{ marginBottom: 16 }}>{message}</p>
      <Button type="primary" size="small" onClick={onReload} icon={<ReloadOutlined />}>
        Reload
      </Button>
    </div>
  );
}
