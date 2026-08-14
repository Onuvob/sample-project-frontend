"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, message, Row, Col, Typography } from "antd";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { getCurrentUser } from "@/services/userService"; // make sure this exists
import { routes } from "@/routes";
import { useAuth } from "@/context/AuthContext";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth(); // get setUser from AuthContext
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call login API
      const data = await login(values.email, values.password);

      // Save token to localStorage
      localStorage.setItem("accessToken", data.accessToken);

      // Fetch current user info (or use data.user if your login API returns it)
      const currentUser = await getCurrentUser();
      setUser(currentUser); // update context immediately

      message.success("Login successful!");
      router.push(routes.dashboard); // redirect now
    } catch (err) {
      message.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* LEFT: Branding */}
      <Col
        xs={0}
        sm={0}
        md={12}
        style={{
          background: "linear-gradient(135deg, #0f172a, #020617)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div style={{ maxWidth: "420px", color: "#fff" }}>
          <Title style={{ color: "#fff", marginBottom: "12px" }}>
            Pilot Booking System
          </Title>

          <Text style={{ color: "#cbd5f5", fontSize: "16px" }}>
            A complete platform for managing pilot service bookings, vehicle
            approvals, routes, coupon payments, and pilot assignments with
            secure role-based access.
          </Text>

          <div style={{ marginTop: "40px" }}>
            {[
              "Secure JWT Authentication",
              "Coupon-Based Payments",
              "Vehicle & Route Management",
              "Pilot Assignment",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#38bdf8",
                  }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Col>

      {/* RIGHT: Login Form */}
      <Col
        xs={24}
        sm={24}
        md={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          padding: "20px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "380px",
            borderRadius: "16px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          }}
          styles={{ padding: "40px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Title level={3} style={{ marginBottom: "6px" }}>
              Welcome Back
            </Title>

            <Text type="secondary">
              Sign in to access your Pilot Booking dashboard
            </Text>
          </div>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                marginTop: "10px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                border: "none",
                fontWeight: "600",
              }}
            >
              Login
            </Button>
          </Form>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Don't have an account? <a href="/register">Register</a>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
