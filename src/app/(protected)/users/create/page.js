"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import { createOrganization } from "@/services/organizationService";
import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";

export default function OrganizationCreate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = await createOrganization(values);
      message.success("Organization created successfully");
      router.push(routes.organizations.view(data.id)); // redirect to new org view page
    } catch (err) {
      console.error(err);
      message.error("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout breadcrumb={[{ title: "Organizations", href: routes.organizations.list }, { title: "Create" }]}>
      <Card title="Create New Organization" style={{ maxWidth: 600, margin: "20px auto" }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter organization name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Root User ID"
            name="rootUser"
            rules={[{ required: true, message: "Please enter Root User ID" }]}
          >
            <Input type="number" />
          </Form.Item>

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