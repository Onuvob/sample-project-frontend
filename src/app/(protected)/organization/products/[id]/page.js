"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Avatar,
  Descriptions,
  Spin,
  Button,
  Popconfirm,
  message,
  Empty,
  Typography,
  Row,
  Space,
  Tag,
} from "antd";
import { ArrowLeftOutlined, ProductOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getProduct,
  deleteProduct,
} from "@/services/organization/productService";
import PageLoader from "@/components/common/PageLoader";

const { Text, Title } = Typography;

export default function ProductView() {
  const { id } = useParams(); // this is organization-product ID
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  /* -------------------- FETCH PRODUCT -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        if (mounted) setProduct(data);
      } catch (error) {
        message.error("Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* -------------------- DELETE -------------------- */
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProduct(id);
      message.success("Product deleted successfully");
      router.replace(routes.organization.products.list);
    } catch (error) {
      message.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  /* -------------------- LOADING / EMPTY -------------------- */
  if (loading) {
    return (<AppLayout> <PageLoader /> </AppLayout>);
  }

  if (!product) {
    return <Empty description="Product not found" style={{ marginTop: 100 }} />;
  }

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        { title: "Organization Products", href: routes.organization.products.list },
        { title: product.productName },
      ]}
    >
      {/* ================= SUMMARY ================= */}
      <Card style={{ maxWidth: 900, margin: "24px auto 12px" }}>
        <Row align="middle" justify="space-between">
          <Space size="large">
            <Avatar
              size={72}
              icon={<ProductOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />

            <div>
              <Title level={3} style={{ margin: 0 }}>
                {product.productName}
              </Title>

              <Text type="secondary">{product.sku}</Text>

              <div style={{ marginTop: 8 }}>
                <Tag color={product.isActive ? "green" : "red"}>
                  {product.isActive ? "ACTIVE" : "INACTIVE"}
                </Tag>

                <Tag color="blue">৳ {product.customPrice ?? 0}</Tag>
              </div>
            </div>
          </Space>

          <Space>
            <Button
              type="primary"
              style={{
                backgroundColor: "#fa8c16",
                borderColor: "#fa8c16",
              }}
              onClick={() =>
                router.push(routes.organization.products.edit(product.id))
              }
            >
              Edit
            </Button>

            <Popconfirm
              title="Delete product?"
              description="This action cannot be undone."
              onConfirm={handleDelete}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true, loading: deleting }}
            >
              <Button danger loading={deleting}>
                Delete
              </Button>
            </Popconfirm>

            <Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Space>
        </Row>
      </Card>

      {/* ================= DETAILS ================= */}
      <Card
        title="Organization Product Information"
        style={{ maxWidth: 900, margin: "12px auto" }}
      >
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="Organization Product ID">
            {product.id}
          </Descriptions.Item>

          <Descriptions.Item label="Product ID">
            {product.productId}
          </Descriptions.Item>

          <Descriptions.Item label="Product Name">
            {product.productName}
          </Descriptions.Item>

          <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>

          <Descriptions.Item label="Custom Price">
            ৳ {product.customPrice ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {product.isActive ? "Active" : "Inactive"}
          </Descriptions.Item>

          <Descriptions.Item label="Created By">
            {product.createdBy ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {product.createdAt
              ? dayjs(product.createdAt).format("YYYY-MM-DD hh:mm A")
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated By">
            {product.updatedBy ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {product.updatedAt
              ? dayjs(product.updatedAt).format("YYYY-MM-DD hh:mm A")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </AppLayout>
  );
}
