"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Avatar,
  Divider,
  Space,
} from "antd";
import { EditOutlined, ProductOutlined } from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getPackage,
  editPackage,
} from "@/services/organization/packageService";
import PageLoader from "@/components/common/PageLoader";

export default function PackageEdit() {
  const { packageId } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pkg, setPkg] = useState(null);

  /* -------------------- FETCH PACKAGE -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchPackage = async () => {
      try {
        const data = await getPackage(packageId);
        if (!mounted) return;
        setPkg(data);
      } catch (error) {
        console.error("Failed to load package:", error);
        message.error("Failed to load package details");
        router.replace(routes.organization.packages.list);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (packageId) fetchPackage();

    return () => {
      mounted = false;
    };
  }, [packageId, router]);

  /* -------------------- SET FORM VALUES (SAFE) -------------------- */
  useEffect(() => {
    if (!pkg) return;

    form.setFieldsValue({
      code: pkg.code ?? "",
      title: pkg.title ?? "",
      description: pkg.description ?? "",
    });
  }, [pkg, form]);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await editPackage(packageId, values);

      message.success("Package updated successfully");
      router.replace(routes.organization.packages.view(packageId));
    } catch (error) {
      console.error("Package update failed:", error);
      message.error("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        {
          title: "Organization Packages",
          href: routes.organization.packages.list,
        },
        { title: pkg?.title },
        { title: "Edit" },
      ]}
    >
      <Card style={{ maxWidth: 720, margin: "24px auto" }}>
        <Card.Meta
          avatar={
            <Avatar
              size={64}
              icon={<ProductOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
          }
          title="Edit Package"
          description="Update organization package information"
        />

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Package code is required" }]}
          >
            <Input placeholder="Enter package code" />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Package title is required" }]}
          >
            <Input placeholder="Enter package title" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Enter package description" />
          </Form.Item>

          <Divider />

          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => router.back()} disabled={submitting}>
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<EditOutlined />}
              loading={submitting}
            >
              Save Changes
            </Button>
          </Space>
        </Form>
      </Card>
    </AppLayout>
  );
}
