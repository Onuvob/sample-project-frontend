"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, InputNumber, Switch } from "antd";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createRoute } from "@/services/routeService";

export default function RouteCreate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
      };

      const data = await createRoute(payload);

      message.success("Route created successfully");
      router.push(routes.routes.view(data.id));
    } catch (err) {
      message.error("Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      breadcrumb={[
        { title: "Routes", href: routes.routes.list },
        { title: "Create" },
      ]}
    >
      <Card
        title="Create New Route"
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- SOURCE ---------------- */}
          <Form.Item
            label="Source"
            name="source"
            rules={[
              { required: true, message: "Please enter source location" },
            ]}
          >
            <Input placeholder="Enter source location" />
          </Form.Item>

          {/* ---------------- DESTINATION ---------------- */}
          <Form.Item
            label="Destination"
            name="destination"
            rules={[
              { required: true, message: "Please enter destination location" },
            ]}
          >
            <Input placeholder="Enter destination location" />
          </Form.Item>

          {/* ---------------- SERVICE FEE ---------------- */}
          <Form.Item
            label="Service Fee"
            name="serviceFee"
            rules={[
              { required: true, message: "Please enter service fee" },
              {
                type: "number",
                min: 0.01,
                message: "Service fee must be greater than zero",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter service fee"
              min={0.01}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          {/* ---------------- ACTIVE ---------------- */}
          <Form.Item
            label="Active"
            name="active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          {/* ---------------- ACTIONS ---------------- */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={() => router.back()}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AppLayout>
  );
}
