"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, message, Row, Col, Typography } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";

const { Title, Text } = Typography;

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await register(values);

      message.success("Registration successful. Please login.");

      router.push("/login");
    } catch (error) {
      message.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* LEFT SIDE */}
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
          <Title style={{ color: "#fff", marginBottom: 12 }}>
            Pilot Booking System
          </Title>

          <Text style={{ color: "#cbd5f5", fontSize: 16 }}>
            Register as an Owner to manage vehicles, create bookings, use
            coupons for payments, and track pilot assignments.
          </Text>

          <div style={{ marginTop: 40 }}>
            {[
              "Easy Registration",
              "Vehicle Management",
              "Coupon-Based Payment",
              "Secure JWT Authentication",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
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

      {/* RIGHT SIDE */}
      <Col
        xs={24}
        sm={24}
        md={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8fafc",
          padding: 20,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 450,
            borderRadius: 16,
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          }}
          styles={{
            body: {
              padding: 40,
            },
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            <Title level={3}>Create Account</Title>

            <Text type="secondary">
              Register to access the Pilot Booking System
            </Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter first name",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="First Name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter last name",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
                {
                  type: "email",
                  message: "Enter a valid email",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter email" />
            </Form.Item>

            <Form.Item label="Phone Number" name="phone">
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Enter phone number"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter password",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                marginTop: 10,
                height: 45,
                borderRadius: 10,
                background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                border: "none",
                fontWeight: 600,
              }}
            >
              Register
            </Button>
          </Form>

          <div
            style={{
              marginTop: 24,
              textAlign: "center",
            }}
          >
            Already have an account? <a href="/login">Login</a>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
