"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createOrganization } from "@/services/organizationService";
import UserSelect from "@/components/common/UserSelect";

export default function OrganizationCreate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        rootFullName: selectedUser
          ? `${selectedUser.firstname} ${selectedUser.lastname}`
          : null,
      };

      const data = await createOrganization(payload);

      message.success("Organization created successfully");
      router.push(routes.organizations.view(data.id));
    } catch (err) {
      message.error("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      breadcrumb={[
        { title: "Organizations", href: routes.organizations.list },
        { title: "Create" },
      ]}
    >
      <Card
        title="Create New Organization"
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- NAME ---------------- */}
          <Form.Item
            label="Organization Name"
            name="name"
            rules={[
              { required: true, message: "Please enter organization name" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* ---------------- DESCRIPTION ---------------- */}
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* ---------------- ROOT USER SELECT ---------------- */}
          <Form.Item
            label="Root User"
            name="rootUser"
            rules={[{ required: true, message: "Please select root user" }]}
          >
            <UserSelect onSelectUser={setSelectedUser} />
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
