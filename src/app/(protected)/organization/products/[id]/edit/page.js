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
  Switch,
} from "antd";
import {
  EditOutlined,
  ProductOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getProduct,
  editProduct,
} from "@/services/organization/productService";
import PageLoader from "@/components/common/PageLoader";
import CurrencyInputNumber from "@/components/common/CurrencyInputNumber";

export default function ProductEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState(null);

  /* -------------------- FETCH PRODUCT -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        if (!mounted) return;
        setProduct(data);
      } catch (error) {
        message.error("Failed to load product details");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* -------------------- SET FORM VALUES (SAFE) -------------------- */
  useEffect(() => {
    if (!product) return;

    form.setFieldsValue({
      productName: product.productName ?? "",
      sku: product.sku ?? "",
      customPrice: product.customPrice ?? null,
      isActive: product.isActive ?? true,
    });
  }, [product, form]);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await editProduct(id, values);
      message.success("Product updated successfully");
      router.replace(routes.organization.products.view(id));
    } catch (error) {
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
          title: "Organization Products",
          href: routes.organization.products.list,
        },
        { title: product?.productName },
        { title: "Edit" },
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
          title="Edit Product"
          description="Update organization product information"
        />

        <Divider />

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
        >
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Product name is required" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "SKU is required" }]}
          >
            <Input placeholder="Enter SKU code" />
          </Form.Item>

          <Form.Item
            label="Custom Price"
            name="customPrice"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <CurrencyInputNumber min={0} placeholder="Enter custom price" />
          </Form.Item>

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
