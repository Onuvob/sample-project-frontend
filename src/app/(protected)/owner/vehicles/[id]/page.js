"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  CarOutlined,
  IdcardOutlined,
  TagOutlined,
  DashboardOutlined,
  NumberOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getOwnerVehicle,
  deleteOwnerVehicle,
} from "@/services/ownerVehicleService";

import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function OwnerVehicleView() {
  const { id } = useParams();
  const router = useRouter();

  const [ownerVehicle, setOwnerVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteOwnerVehicle(id);
      message.success("Owner vehicle deleted successfully");
      router.replace(routes.ownerVehicles.list);
    } catch (error) {
      console.error("Delete failed", error);
      message.error("Failed to delete owner vehicle");
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
            <Button
              type="primary"
              style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
              onClick={() => router.push(routes.ownerVehicles.edit(id))}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete owner vehicle?"
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
          </Descriptions>
        </Card>
      </Card>
    </AppLayout>
  );
}