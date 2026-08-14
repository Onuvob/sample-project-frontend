"use client";

import { Space, InputNumber } from "antd";

export default function CurrencyInputNumber({
  symbol = "৳",
  radius = 6,
  style,
  ...props
}) {
  return (
    <Space.Compact style={{ width: "100%", ...style }}>
      {/* Currency prefix */}
      <span
        style={{
          padding: "0 12px",
          border: "1px solid #d9d9d9",
          borderRight: "none",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          borderTopLeftRadius: radius,
          borderBottomLeftRadius: radius,
        }}
      >
        {symbol}
      </span>

      {/* Number input */}
      <InputNumber
        {...props}
        style={{
          width: "100%",
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
        }}
      />
    </Space.Compact>
  );
}
