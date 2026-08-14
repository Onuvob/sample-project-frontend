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
import { getPilot, deletePilot } from "@/services/adminPilotService";

import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function PilotView() {
  const { id } = useParams();
  const router = useRouter();

  const [pilot, setPilot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchPilot = async () => {
      try {
        const data = await getPilot(id);
        if (mounted) setPilot(data);
      } catch (error) {
        console.error("Failed to load pilot", error);
        message.error("Failed to load pilot");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPilot();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePilot(id);
      message.success("Pilot deleted successfully");
      router.replace(routes.pilots.list);
    } catch (error) {
      console.error("Delete failed", error);
      message.error("Failed to delete pilot");
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

  if (!pilot) {
    return (
      <AppLayout>
        <Empty description="Pilot not found" style={{ marginTop: 100 }} />
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
        { title: "Pilots", href: routes.pilots.list },
        { title: pilot.name || "Pilot Details" },
      ]}
    >
      <Card
        style={{ maxWidth: 900, margin: "24px auto" }}
        actions={[
          <Space key="actions">
            <Button
              type="primary"
              style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
              onClick={() => router.push(routes.pilots.edit(id))}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete pilot?"
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
              {pilot.name || "Unnamed Pilot"}
            </Title>
            <Text type="secondary">
              {pilot.phone ? `Phone: ${pilot.phone}` : "Pilot"}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Pilot Details */}
        <Card type="inner" title="Pilot Details">
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
              {pilot.id ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <UserOutlined /> Name
                </>
              }
            >
              {pilot.name ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <PhoneOutlined /> Phone
                </>
              }
            >
              {pilot.phone ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <CheckCircleOutlined /> Status
                </>
              }
            >
              {pilot.status ? (
                <Tag color={getStatusColor(pilot.status)}>{pilot.status}</Tag>
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
              {pilot.createdAt
                ? dayjs(pilot.createdAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <ClockCircleOutlined /> Updated At
                </>
              }
            >
              {pilot.updatedAt
                ? dayjs(pilot.updatedAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </AppLayout>
  );
}
