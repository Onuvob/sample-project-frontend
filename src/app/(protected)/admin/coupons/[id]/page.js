"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  Card,
  Avatar,
  Descriptions,
  Button,
  Popconfirm,
  message,
  Empty,
  Divider,
  Typography,
  Row,
  Col,
  Space,
  Tag,
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  NumberOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TagOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { getCoupon, deleteCoupon } from "@/services/adminCouponService";

import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function CouponView() {
  const { id } = useParams();
  const router = useRouter();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchCoupon = async () => {
      try {
        const data = await getCoupon(id);
        if (mounted) setCoupon(data);
      } catch (error) {
        console.error("Failed to load coupon", error);
        message.error("Failed to load coupon");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCoupon();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCoupon(id);
      message.success("Coupon deleted successfully");
      // Fixed route to match admin namespace
      router.replace(routes.adminCoupons.list);
    } catch (error) {
      console.error("Delete failed", error);
      message.error("Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!coupon) {
    return (
      <AppLayout>
        <Empty description="Coupon not found" style={{ marginTop: 100 }} />
      </AppLayout>
    );
  }

  // Helper to determine tag color based on status
  const getStatusColor = (status) => {
    if (!status) return "default";
    const val = status.toString().toUpperCase();
    if (val === "ACTIVE") return "success";
    if (val === "EXPIRED" || val === "USED" || val === "INACTIVE" || val === "REJECTED") return "error";
    return "default";
  };

  // Combine owner name
  const ownerFullName = [coupon.ownerFirstName, coupon.ownerLastName]
    .filter(Boolean)
    .join(" ") || "Unknown Owner";

  return (
    <AppLayout
      breadcrumb={[
        { title: "Coupons", href: routes.adminCoupons.list },
        { title: coupon.code || "Coupon Details" },
      ]}
    >
      <Card
        style={{ maxWidth: 900, margin: "24px auto" }}
        actions={[
          <Space key="actions">
            <Button
              type="primary"
              style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
              onClick={() => router.push(routes.adminCoupons.edit(id))}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete coupon?"
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
          </Space>,
        ]}
      >
        {/* Header with Avatar + Code */}
        <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Avatar
              size={80}
              icon={<TagOutlined />}
              style={{ backgroundColor: "#fa8c16", fontSize: 36 }}
            />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {coupon.code || "Unnamed Coupon"}
            </Title>
            <Text type="secondary">
              {coupon.amount != null ? `Amount: ${coupon.amount}` : "Coupon Details"}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Coupon Details */}
        <Card type="inner" title="Coupon Details">
          <Descriptions
            bordered
            column={1}
            styles={{ label: { width: 200, fontWeight: 500 } }}
          >
            <Descriptions.Item label={<><NumberOutlined /> ID</>}>
              {coupon.id ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><TagOutlined /> Code</>}>
              {coupon.code ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><DollarOutlined /> Amount</>}>
              {coupon.amount != null ? coupon.amount : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><CalendarOutlined /> Expiry Date</>}>
              {coupon.expiryDate
                ? dayjs(coupon.expiryDate).format("YYYY-MM-DD")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><UserOutlined /> Owner</>}>
              {ownerFullName}
            </Descriptions.Item>

            <Descriptions.Item label={<><CheckCircleOutlined /> Status</>}>
              {coupon.status ? (
                <Tag color={getStatusColor(coupon.status)}>{coupon.status}</Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<><ClockCircleOutlined /> Created At</>}>
              {coupon.createdAt
                ? dayjs(coupon.createdAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><ClockCircleOutlined /> Updated At</>}>
              {coupon.updatedAt
                ? dayjs(coupon.updatedAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </AppLayout>
  );
}