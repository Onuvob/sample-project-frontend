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
  Table,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ProductOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getPackage,
  deletePackage,
  getPackageVersionList,
  deletePackageVersion,
} from "@/services/organization/packageService";
import PageLoader from "@/components/common/PageLoader";

const { Text, Title } = Typography;

export default function PackageView() {
  const { packageId } = useParams(); // organization-package ID
  const router = useRouter();

  const [orgPackage, setOrgPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [versions, setVersions] = useState([]);
  const [versionLoading, setVersionLoading] = useState(true);

  /* -------------------- FETCH PACKAGE -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchPackage = async () => {
      try {
        const data = await getPackage(packageId);
        if (mounted) setOrgPackage(data);
      } catch (error) {
        message.error("Failed to load package");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPackage();
    return () => {
      mounted = false;
    };
  }, [packageId]);

  /* -------------------- FETCH PACKAGE VERSIONS -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchVersions = async () => {
      try {
        const data = await getPackageVersionList(packageId);
        if (mounted) setVersions(data || []);
      } catch (error) {
        message.error("Failed to load package versions");
      } finally {
        if (mounted) setVersionLoading(false);
      }
    };

    fetchVersions();
    return () => {
      mounted = false;
    };
  }, [packageId]);

  /* -------------------- DELETE -------------------- */
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePackage(packageId);
      message.success("Package deleted successfully");
      router.replace(routes.organization.packages.list);
    } catch (error) {
      message.error("Failed to delete package");
    } finally {
      setDeleting(false);
    }
  };

  /* -------------------- VERSION DELETE -------------------- */
  const handleVersionDelete = async (versionId) => {
    try {
      setDeleting(true);
      await deletePackageVersion(versionId); // send versionId, not packageId
      message.success("Package version deleted successfully");
      // optionally refresh versions list
      const updated = await getPackageVersionList(orgPackage.id);
      setVersions(updated || []);
    } catch (error) {
      message.error("Failed to delete package version");
    } finally {
      setDeleting(false);
    }
  };


  /* -------------------- LOADING / EMPTY -------------------- */
  if (loading) {
    return (<AppLayout> <PageLoader /> </AppLayout>);
  }

  if (!orgPackage) {
    return <Empty description="Package not found" style={{ marginTop: 100 }} />;
  }

  /* -------------------- VERSION TABLE -------------------- */
  const versionColumns = [
    {
      title: "Version",
      dataIndex: "versionNumber",
      key: "versionNumber",
      //   width: 100,
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text) => text || "-",
    },
    {
      title: "Price",
      key: "price",
      align: "center",
      render: (_, record) => (
        <Text strong>
          {record.basePrice} {record.currency}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const color =
          status === "ACTIVE" ? "green" : status === "DRAFT" ? "orange" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      align: "center",
      render: (_text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(
                routes.organization.packages.version.view(
                  orgPackage.id,
                  record.id
                )
              )
            }
          />
          <Button
            type="link"
            icon={<EditOutlined style={{ color: "#fa8c16" }} />}
            onClick={() =>
              router.push(
                routes.organization.packages.version.edit(
                  orgPackage.id,
                  record.id
                )
              )
            }
          />
          <Popconfirm
            title="Delete package version?"
            description="This action cannot be undone."
            onConfirm={() => handleVersionDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deleting }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        {
          title: "Organization Packages",
          href: routes.organization.packages.list,
        },
        { title: orgPackage.title },
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
                {orgPackage.title}
              </Title>
              <Text type="secondary">{orgPackage.code}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={orgPackage.isActive ? "green" : "red"}>
                  {orgPackage.isActive ? "ACTIVE" : "INACTIVE"}
                </Tag>
                <Tag color="blue">
                  Version ID: {orgPackage.currentVersionId ?? "-"}
                </Tag>
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
                router.push(routes.organization.packages.edit(orgPackage.id))
              }
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete package?"
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
        title="Organization Package Information"
        style={{ maxWidth: 900, margin: "12px auto" }}
      >
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="Package ID">
            {orgPackage.id}
          </Descriptions.Item>
          <Descriptions.Item label="Organization ID">
            {orgPackage.organizationId}
          </Descriptions.Item>
          <Descriptions.Item label="Code">{orgPackage.code}</Descriptions.Item>
          <Descriptions.Item label="Title">
            {orgPackage.title}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {orgPackage.description || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                orgPackage.status === "ACTIVE"
                  ? "green"
                  : orgPackage.status === "DRAFT"
                    ? "orange"
                    : "red"
              }
            >
              {orgPackage.status || "-"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Current Version ID">
            {orgPackage.currentVersionId ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Active">
            <Tag color={orgPackage.isActive ? "green" : "red"}>
              {orgPackage.isActive ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* ================= PACKAGE VERSIONS ================= */}
      <Card
        title={`${orgPackage.title} Versions`}
        style={{ maxWidth: 900, margin: "12px auto 24px" }}
        extra={
          <Button
            type="primary"
            onClick={() =>
              router.push(
                routes.organization.packages.version.create(orgPackage.id)
              )
            }
          >
            Create
          </Button>
        }
      >
        {versionLoading ? (
          <Spin style={{ display: "block", margin: "40px auto" }} />
        ) : versions.length === 0 ? (
          <Empty description="No versions found for this package" />
        ) : (
          <Table
            rowKey="id"
            columns={versionColumns}
            dataSource={versions}
            pagination={false}
          />
        )}
      </Card>
    </AppLayout>
  );
}
