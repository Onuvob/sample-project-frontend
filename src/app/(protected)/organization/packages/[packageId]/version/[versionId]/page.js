"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Avatar,
  Descriptions,
  Spin,
  Button,
  Empty,
  Typography,
  Row,
  Space,
  Tag,
  Divider,
  Table,
  message,
} from "antd";
import {
  ProductOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getPackageVersion,
  publishPackageVersion,
} from "@/services/organization/packageService";
import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function PackageVersionView() {
  const router = useRouter();
  const { packageId, versionId } = useParams();

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [version, setVersion] = useState(null);

  /* -------------------- FETCH VERSION -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchVersion = async () => {
      try {
        const data = await getPackageVersion(versionId);
        if (mounted) setVersion(data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load package version");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVersion();
    return () => (mounted = false);
  }, [versionId]);

  /* -------------------- PUBLISH -------------------- */
  const handlePublish = async () => {
    if (!version) return;

    try {
      setPublishing(true);
      await publishPackageVersion(packageId, versionId);
      message.success("Package version published successfully");

      // Refresh version details to reflect new status
      const updated = await getPackageVersion(versionId);
      setVersion(updated);
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.error || "Failed to publish package version"
      );
    } finally {
      setPublishing(false);
    }
  };

  /* -------------------- LOADING / EMPTY -------------------- */
  if (loading) {
    return (<AppLayout> <PageLoader /> </AppLayout>);
  }

  if (!version) {
    return (
      <Empty
        description="Package version not found"
        style={{ marginTop: 100 }}
      />
    );
  }

  /* -------------------- TASK TABLE -------------------- */
  const taskColumns = [
    {
      title: "Order",
      dataIndex: "sequenceOrder",
      align: "center",
      width: 30,
    },
    {
      title: "Task",
      dataIndex: "taskName",
    },
    {
      title: "Price Override",
      dataIndex: "priceOverride",
      align: "center",
      render: (val) => val ?? "-",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      align: "center",
      width: 30,
    },
    {
      title: "Optional",
      dataIndex: "isOptional",
      align: "center",
      render: (val) =>
        val ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      align: "center",
      render: (val) =>
        val ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      render: (val) => val || "-",
    },
  ];

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        {
          title: "Package List",
          href: routes.organization.packages.list,
        },
        {
          title: "Back to Package",
          href: routes.organization.packages.view(packageId),
        },
        { title: "View Version" },
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
                {version.title}
              </Title>
              <Text type="secondary">Version #{version.versionNumber}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="blue">{version.currency}</Tag>
                <Tag color="green">
                  {version.basePrice} {version.currency}
                </Tag>
                <Tag
                  color={
                    version.status === "ACTIVE"
                      ? "green"
                      : version.status === "DRAFT"
                        ? "orange"
                        : "red"
                  }
                >
                  {version.status}
                </Tag>
              </div>
            </div>
          </Space>

          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(
                  routes.organization.packages.version.edit(
                    packageId,
                    versionId
                  )
                )
              }
            >
              Edit
            </Button>

            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handlePublish}
              disabled={version.status !== "DRAFT"}
              loading={publishing}
            >
              Publish
            </Button>

            <Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Space>
        </Row>
      </Card>

      {/* ================= DETAILS ================= */}
      <Card
        title="Package Version Information"
        style={{ maxWidth: 900, margin: "12px auto" }}
      >
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="Version ID">{version.id}</Descriptions.Item>
          <Descriptions.Item label="Package ID">{packageId}</Descriptions.Item>
          <Descriptions.Item label="Version Number">
            {version.versionNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {version.currency}
          </Descriptions.Item>
          <Descriptions.Item label="Base Price">
            {version.basePrice}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                version.status === "ACTIVE"
                  ? "green"
                  : version.status === "DRAFT"
                    ? "orange"
                    : "red"
              }
            >
              {version.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {version.description || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* ================= TASKS ================= */}
      <Card
        title="Version Tasks"
        style={{ maxWidth: 900, margin: "12px auto 24px" }}
      >
        {version.items?.length === 0 ? (
          <Empty description="No tasks added to this version" />
        ) : (
          <Table
            rowKey="sequenceOrder"
            columns={taskColumns}
            dataSource={[...version.items].sort(
              (a, b) => a.sequenceOrder - b.sequenceOrder
            )}
            pagination={false}
          />
        )}
      </Card>
    </AppLayout>
  );
}
