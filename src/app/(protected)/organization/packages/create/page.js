"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { PlusOutlined, ProductOutlined } from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import OrganizationSelect from "@/components/common/organization/OrganizationSelect";
import { createPackage } from "@/services/organization/packageService";

export default function PackageCreate() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    /* -------------------- SUBMIT (STRICT PAYLOAD) -------------------- */
    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            const payload = {
                organizationId: values.organizationId,
                code: values.code,
                title: values.title,
                description: values.description,
            };

            await createPackage(payload);

            message.success("Package created successfully");
            router.replace(routes.organization.packages.list);
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.error || "Failed to create package");
        } finally {
            setSubmitting(false);
        }
    };

    /* -------------------- RENDER -------------------- */
    return (
        <AppLayout
            breadcrumb={[
                { title: "Organization Packages", href: routes.organization.packages.list },
                { title: "Create" },
            ]}
        >
            <Card style={{ maxWidth: 720, margin: "24px auto" }}>
                {/* Header */}
                <Card.Meta
                    avatar={
                        <Avatar
                            size={64}
                            icon={<ProductOutlined />}
                            style={{ backgroundColor: "#1677ff" }}
                        />
                    }
                    title="Create Organization Package"
                    description="Add a new package to the organization"
                />

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    disabled={submitting}
                >
                    <Form.Item
                        label="Organization"
                        name="organizationId"
                        rules={[{ required: true, message: "Organization is required" }]}
                    >
                        <OrganizationSelect />
                    </Form.Item>

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

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea
                            placeholder="Enter package description"
                            rows={4}
                        />
                    </Form.Item>

                    <Divider />

                    {/* Actions */}
                    <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={() => router.back()} disabled={submitting}>
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            loading={submitting}
                        >
                            Create
                        </Button>
                    </Space>
                </Form>
            </Card>
        </AppLayout>
    );
}
