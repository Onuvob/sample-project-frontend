"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, InputNumber } from "antd";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createOwnerVehicle } from "@/services/ownerVehicleService";

export default function OwnerVehicleCreate() {
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

      const data = await createOwnerVehicle(payload);

      message.success("Owner vehicle created successfully");
      router.push(routes.ownerVehicles.view(data.id));
    } catch (err) {
      message.error("Failed to create owner vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      breadcrumb={[
        { title: "Owner Vehicles", href: routes.ownerVehicles.list },
        { title: "Create" },
      ]}
    >
      <Card
        title="Create New Owner Vehicle"
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- NAME ---------------- */}
          <Form.Item
            label="Vehicle Name"
            name="name"
            rules={[
              { required: true, message: "Please enter vehicle name" },
            ]}
          >
            <Input placeholder="Enter vehicle name" />
          </Form.Item>

          {/* ---------------- Registration Number ---------------- */}
          <Form.Item
            label="Registration Number"
            name="registrationNumber"
            rules={[
              { required: true, message: "Please enter registration number" },
            ]}
          >
            <Input placeholder="Enter registration number" />
          </Form.Item>

          {/* ---------------- Vehicle Type ---------------- */}
          <Form.Item
            label="Vehicle Type"
            name="type"
            rules={[{ required: true, message: "Please enter vehicle type" }]}
          >
            <Input placeholder="Enter vehicle type" />
          </Form.Item>

          {/* ---------------- Capacity ---------------- */}
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[
              { required: true, message: "Please enter vehicle capacity" },
              {
                type: "number",
                message: "Capacity must be a number",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter vehicle capacity" />
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
