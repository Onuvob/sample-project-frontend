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
  CarOutlined,
  IdcardOutlined,
  TagOutlined,
  DashboardOutlined,
  NumberOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { getOwnerVehicle } from "@/services/ownerVehicleService";

import {
  approveOwnerVehicle,
  rejectOwnerVehicle,
} from "@/services/adminVehicleService";

import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function OwnerVehicleView() {
  const { id } = useParams();
  const router = useRouter();

  const [ownerVehicle, setOwnerVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchOwnerVehicle = async () => {
      try {
        const data = await getOwnerVehicle(id);
        if (mounted) setOwnerVehicle(data);
      } catch (error) {
        console.error("Failed to load owner vehicle", error);
        message.error("Failed to load owner vehicle");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOwnerVehicle();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      await approveOwnerVehicle(id);
      message.success("Vehicle approved successfully");
      // Update local state immediately to reflect the new status
      setOwnerVehicle((prev) => (prev ? { ...prev, status: "ACTIVE" } : null));
    } catch (error) {
      console.error("Approve failed", error);
      message.error("Failed to approve vehicle");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      await rejectOwnerVehicle(id);
      message.success("Vehicle rejected successfully");
      // Update local state immediately to reflect the new status
      setOwnerVehicle((prev) => (prev ? { ...prev, status: "REJECTED" } : null));
    } catch (error) {
      console.error("Reject failed", error);
      message.error("Failed to reject vehicle");
    } finally {
      setRejecting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!ownerVehicle) {
    return (
      <AppLayout>
        <Empty description="Owner vehicle not found" style={{ marginTop: 100 }} />
      </AppLayout>
    );
  }

  // Combine first and last name safely
  const ownerFullName = [ownerVehicle.ownerFirstName, ownerVehicle.ownerLastName]
    .filter(Boolean)
    .join(" ") || "Unknown Owner";

  // Check current status for disabling buttons
  const isApproved = ownerVehicle.status?.toLowerCase() === "active";
  const isRejected = ownerVehicle.status?.toLowerCase() === "rejected";

  return (
    <AppLayout
      breadcrumb={[
        { title: "Owner Vehicles", href: routes.ownerVehicles.list },
        { title: ownerVehicle.name || "Vehicle Details" },
      ]}
    >
      <Card
        style={{ maxWidth: 900, margin: "24px auto" }}
        actions={[
          <Space key="actions">
            <Popconfirm
              title="Approve this vehicle?"
              description="This will activate the vehicle."
              onConfirm={handleApprove}
              okText="Yes, Approve"
              cancelText="Cancel"
              okButtonProps={{ loading: approving }}
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={approving}
                disabled={isApproved}
              >
                Approve
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Reject this vehicle?"
              description="This will reject the vehicle application."
              onConfirm={handleReject}
              okText="Yes, Reject"
              cancelText="Cancel"
              okButtonProps={{ danger: true, loading: rejecting }}
            >
              <Button
                danger
                icon={<CloseCircleOutlined />}
                loading={rejecting}
                disabled={isRejected}
              >
                Reject
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
              icon={<CarOutlined />}
              style={{ backgroundColor: "#fa8c16", fontSize: 36 }}
            />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {ownerVehicle.name || "Unnamed Vehicle"}
            </Title>
            <Text type="secondary">
              {ownerVehicle.type ? `Type: ${ownerVehicle.type}` : "Vehicle"}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Vehicle Details */}
        <Card type="inner" title="Vehicle Details">
          <Descriptions
            bordered
            column={1}
            styles={{ label: { width: 200, fontWeight: 500 } }}
          >
            <Descriptions.Item label={<><NumberOutlined /> ID</>}>
              {ownerVehicle.id ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><CarOutlined /> Name</>}>
              {ownerVehicle.name ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><IdcardOutlined /> Registration Number</>}>
              {ownerVehicle.registrationNumber ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><TagOutlined /> Type</>}>
              {ownerVehicle.type ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><DashboardOutlined /> Capacity</>}>
              {ownerVehicle.capacity != null ? ownerVehicle.capacity : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><UserOutlined /> Owner</>}>
              {ownerFullName}
            </Descriptions.Item>

            <Descriptions.Item label={<><CheckCircleOutlined /> Status</>}>
              {ownerVehicle.status ? (
                <Tag color={ownerVehicle.status.toLowerCase() === 'active' ? 'success' : (ownerVehicle.status.toLowerCase() === 'rejected' ? 'error' : 'default')}>
                  {ownerVehicle.status}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<><ClockCircleOutlined /> Created At</>}>
              {ownerVehicle.createdAt
                ? dayjs(ownerVehicle.createdAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><ClockCircleOutlined /> Updated At</>}>
              {ownerVehicle.updatedAt
                ? dayjs(ownerVehicle.updatedAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </AppLayout>
  );
}