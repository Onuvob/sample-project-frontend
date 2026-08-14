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
  Switch,
} from "antd";
import {
  PlusOutlined,
  ProductOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createProduct } from "@/services/organization/productService";

import CurrencyInputNumber from "@/components/common/CurrencyInputNumber";
import OrganizationSelect from "@/components/common/organization/OrganizationSelect";
import ProductSelect from "@/components/common/ProductSelect";

export default function OrganizationProductCreate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        organizationId: values.organizationId,
        productId: values.productId,
        productName: values.productName,
        customPrice: values.customPrice,
        sku: values.sku,
        isActive: values.isActive,
      };

      await createProduct(payload);

      message.success("Organization product created successfully");
      router.replace(routes.organization.products.list);
    } catch {
      message.error("Failed to create organization product");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        {
          title: "Organization Products",
          href: routes.organization.products.list,
        },
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
          title="Create Organization Product"
          description="Assign a product with custom price"
        />

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
          disabled={submitting}
        >
          {/* Organization */}
          <Form.Item
            label="Organization"
            name="organizationId"
            rules={[{ required: true, message: "Organization is required" }]}
          >
            <OrganizationSelect />
          </Form.Item>

          {/* Product */}
          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: "Product is required" }]}
          >
            <ProductSelect
              onChange={(productId, product) => {
                if (product) {
                  form.setFieldsValue({
                    productName: product.name,
                    sku: product.sku,
                    customPrice: product.price,
                  });
                }
              }}
            />
          </Form.Item>

          {/* Product Name */}
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Product name is required" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          {/* SKU */}
          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "SKU is required" }]}
          >
            <Input placeholder="Enter SKU" />
          </Form.Item>

          {/* Custom Price */}
          <Form.Item
            label="Custom Price"
            name="customPrice"
            rules={[{ required: true, message: "Custom price is required" }]}
          >
            <CurrencyInputNumber min={0} placeholder="Enter custom price" />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Active Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren="Inactive"
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
