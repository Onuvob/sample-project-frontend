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
  PhoneOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { getRoute, deleteRoute } from "@/services/routeService";

import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function RouteView() {
  const { id } = useParams();
  const router = useRouter();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchRoute = async () => {
      try {
        const data = await getRoute(id);
        if (mounted) setRoute(data);
      } catch (error) {
        console.error("Failed to load route", error);
        message.error("Failed to load route");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRoute();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteRoute(id);
      message.success("Route deleted successfully");
      router.replace(routes.routes.list);
    } catch (error) {
      console.error("Delete failed", error);
      message.error("Failed to delete route");
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

  if (!route) {
    return (
      <AppLayout>
        <Empty description="Route not found" style={{ marginTop: 100 }} />
      </AppLayout>
    );
  }

  // Helper to determine tag color based on status
  const getStatusColor = (status) => {
    if (!status) return "default";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "active") return "success";
    if (lowerStatus === "inactive" || lowerStatus === "rejected")
      return "error";
    return "default";
  };

  return (
    <AppLayout
      breadcrumb={[
        { title: "Routes", href: routes.routes.list },
        { title: route.name || "Route Details" },
      ]}
    >
      <Card
        style={{ maxWidth: 900, margin: "24px auto" }}
        actions={[
          <Space key="actions">
            <Button
              type="primary"
              style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
              onClick={() => router.push(routes.routes.edit(id))}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete route?"
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
        {/* Header with Avatar + Name */}
        <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#fa8c16", fontSize: 36 }}
            />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {route.name || "Unnamed Route"}
            </Title>
            <Text type="secondary">
              {route.phone ? `Phone: ${route.phone}` : "Route"}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Route Details */}
        <Card type="inner" title="Route Details">
          <Descriptions
            bordered
            column={1}
            styles={{ label: { width: 200, fontWeight: 500 } }}
          >
            <Descriptions.Item
              label={
                <>
                  <NumberOutlined /> ID
                </>
              }
            >
              {route.id ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <UserOutlined /> Name
                </>
              }
            >
              {route.name ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <PhoneOutlined /> Phone
                </>
              }
            >
              {route.phone ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <CheckCircleOutlined /> Status
                </>
              }
            >
              {route.status ? (
                <Tag color={getStatusColor(route.status)}>{route.status}</Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <ClockCircleOutlined /> Created At
                </>
              }
            >
              {route.createdAt
                ? dayjs(route.createdAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <ClockCircleOutlined /> Updated At
                </>
              }
            >
              {route.updatedAt
                ? dayjs(route.updatedAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </AppLayout>
  );
}
