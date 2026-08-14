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
  Image
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getOrganization,
  deleteOrganization,
} from "@/services/organizationService";

import PageLoader from "@/components/common/PageLoader";
import UserModal from "@/components/common/UserModal";

const { Title, Text } = Typography;

export default function OrganizationView() {
  const { id } = useParams();
  const router = useRouter();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const openUserModal = (userId) => {
    setSelectedUserId(userId);
    setModalVisible(true);
  };

  useEffect(() => {
    let mounted = true;

    const fetchOrganization = async () => {
      try {
        const data = await getOrganization(id);
        if (mounted) setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization", error);
        message.error("Failed to load organization");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrganization();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteOrganization(id);
      message.success("Organization deleted successfully");
      router.replace(routes.organizations.list);
    } catch (error) {
      console.error("Delete failed", error);
      message.error("Failed to delete organization");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (<AppLayout> <PageLoader /> </AppLayout>);
  }

  if (!organization) {
    return (
      <Empty description="Organization not found" style={{ marginTop: 100 }} />
    );
  }

  return (
    <AppLayout
      breadcrumb={[
        { title: "Organizations", href: routes.organizations.list },
        { title: organization.name },
      ]}
    >
      <Card
        style={{ maxWidth: 900, margin: "24px auto" }}
        cover={
          organization.coverPhoto && (
            <Image
              src={organization.coverPhoto}
              alt={organization.name}
              height={220}
              style={{ objectFit: "cover" }}
              preview={{
                mask: "Preview cover",
              }}
            />
          )
        }
        actions={[
          <Space>
            <Button
              type="primary"
              style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
              onClick={() => router.push(routes.organizations.edit(id))}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete organization?"
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
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              cursor: organization.profilePhoto ? "pointer" : "default",
            }}>
              <Image
                src={organization.profilePhoto}
                width={80}
                height={80}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                preview={organization.profilePhoto ? true : false}
                fallback=""
              >
                {!organization.profilePhoto && (
                  <Avatar size={80}>{organization.name?.[0]}</Avatar>
                )}
              </Image>
            </div>

          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {organization.name}
            </Title>
            <Text type="secondary">
              {organization.rootFullName
                ? `Root User: ${organization.rootFullName}`
                : ""}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Description */}
        <Card type="inner" title="Description" style={{ marginBottom: 16 }}>
          <Text>{organization.description || "No description provided."}</Text>
        </Card>

        {/* Organization Details */}
        <Card type="inner" title="Organization Details">
          <Descriptions
            bordered
            // size="small"
            column={1}
            styles={{ label: { width: 150 } }}
          >
            <Descriptions.Item label={<><UserOutlined /> Root User: </>}>
              {organization.rootFullName ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><UserOutlined /> Created By:</>}>
              <Button
                type="link"
                style={{ padding: 0, height: "auto" }}
                onClick={() => openUserModal(organization.createdBy)}
                disabled={!organization.createdBy}
              >
                {organization.createdBy ? organization.createdBy : "-"}
              </Button>
            </Descriptions.Item>


            <Descriptions.Item label={<><ClockCircleOutlined /> Created At: </>}>
              {organization.createdAt
                ? dayjs(organization.createdAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><UserOutlined /> Updated By:</>}>
              <Button
                type="link"
                style={{ padding: 0, height: "auto" }}
                onClick={() => openUserModal(organization.updatedBy)}
                disabled={!organization.updatedBy}
              >
                {organization.updatedBy ? organization.updatedBy : "-"}
              </Button>
            </Descriptions.Item>

            <Descriptions.Item label={<><ClockCircleOutlined /> Updated At: </>}>
              {organization.updatedAt
                ? dayjs(organization.updatedAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

      </Card>

      <UserModal
        userId={selectedUserId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

    </AppLayout>
  );
}
