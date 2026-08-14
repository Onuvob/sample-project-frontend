"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, InputNumber, Select } from "antd";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createPilot } from "@/services/adminPilotService";

export default function PilotCreate() {
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

      const data = await createPilot(payload);

      message.success("Pilot created successfully");
      router.push(routes.pilots.view(data.id));
    } catch (err) {
      message.error("Failed to create pilot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      breadcrumb={[
        { title: "Pilots", href: routes.pilots.list },
        { title: "Create" },
      ]}
    >
      <Card
        title="Create New Pilot"
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- NAME ---------------- */}
          <Form.Item
            label="Pilot Name"
            name="name"
            rules={[{ required: true, message: "Please enter pilot name" }]}
          >
            <Input placeholder="Enter pilot name" />
          </Form.Item>

          {/* ---------------- Phone ---------------- */}
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          {/* ---------------- STATUS ---------------- */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select pilot status"
              options={[
                { label: "Available", value: "AVAILABLE" },
                { label: "Assigned", value: "ASSIGNED" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
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
