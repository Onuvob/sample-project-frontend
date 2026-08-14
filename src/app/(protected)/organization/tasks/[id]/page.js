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
import { getTask, deleteTask } from "@/services/organization/taskService";
import PageLoader from "@/components/common/PageLoader";

const { Text, Title } = Typography;

export default function TaskView() {
  const { id } = useParams(); // this is organization-task ID
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  /* -------------------- FETCH TASK -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchTask = async () => {
      try {
        const data = await getTask(id);
        if (mounted) setTask(data);
      } catch (error) {
        message.error("Failed to load task");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTask();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* -------------------- DELETE -------------------- */
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteTask(id);
      message.success("Task deleted successfully");
      router.replace(routes.organization.tasks.list);
    } catch (error) {
      message.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  /* -------------------- LOADING / EMPTY -------------------- */
  if (loading) {
    return (<AppLayout> <PageLoader /> </AppLayout>);
  }

  if (!task) {
    return <Empty description="Task not found" style={{ marginTop: 100 }} />;
  }

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        { title: "Organization Tasks", href: routes.organization.tasks.list },
        { title: task.name },
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
                {task.name}
              </Title>

              <Text type="secondary">{task.isActive}</Text>

              <div style={{ marginTop: 8 }}>
                <Tag color={task.isActive ? "green" : "red"}>
                  {task.isActive ? "ACTIVE" : "INACTIVE"}
                </Tag>

                <Tag color="blue">৳ {task.basePrice ?? 0}</Tag>
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
                router.push(routes.organization.tasks.edit(task.id))
              }
            >
              Edit
            </Button>

            <Popconfirm
              title="Delete task?"
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
        title="Organization Task Information"
        style={{ maxWidth: 900, margin: "12px auto" }}
      >
        <Descriptions bordered size="middle" column={2}>
          {/* ================= IDENTITY ================= */}
          <Descriptions.Item label="Task Name" span={2}>
            <Text strong>{task.name}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Global Task Reference">
            {task.taskId ? (
              <Tag color="blue">#{task.taskId}</Tag>
            ) : (
              <Tag color="default">N/A</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Organization">
            <Text>{task.organizationId}</Text>
          </Descriptions.Item>

          {/* ================= DESCRIPTION ================= */}
          <Descriptions.Item label="Description" span={2}>
            {task.description ? (
              <Text>{task.description}</Text>
            ) : (
              <Text type="secondary">No description provided</Text>
            )}
          </Descriptions.Item>
          {/* ================= PRICING ================= */}
          <Descriptions.Item label="Base Price">
            <Tag color="green">
              {task.currency || "৳"} {task.basePrice ?? "0"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Currency">
            <Text>{task.currency || "BDT"}</Text>
          </Descriptions.Item>

          {/* ================= TIME & SLA ================= */}
          <Descriptions.Item label="Duration">
            {task.durationMinutes ? (
              <Tag color="purple">{task.durationMinutes} minutes</Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="SLA">
            {task.slaSeconds ? (
              <Tag color="cyan">{task.slaSeconds} seconds</Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>

          {/* ================= STATUS ================= */}
          <Descriptions.Item label="Status" span={2}>
            <Tag color={task.isActive ? "green" : "red"}>
              {task.isActive ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </Descriptions.Item>
          {/* ================= METADATA ================= */}
          <Descriptions.Item label="Metadata" span={2}>
            {task.metadata && Object.keys(task.metadata).length > 0 ? (
              <Space orientation="vertical" size={6} style={{ width: "100%" }}>
                {Object.entries(task.metadata).map(([key, value]) => (
                  <Row key={key} justify="space-between">
                    <Text strong>{key}</Text>

                    {typeof value === "boolean" ? (
                      <Tag color={value ? "green" : "red"}>
                        {value ? "Yes" : "No"}
                      </Tag>
                    ) : typeof value === "number" ? (
                      <Tag color="blue">{value}</Tag>
                    ) : (
                      <Text>{String(value)}</Text>
                    )}
                  </Row>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No metadata available</Text>
            )}
          </Descriptions.Item>

          {/* ================= SYSTEM INFO ================= */}
          {/* <Descriptions.Item label="Organization Task ID">
            <Text strong>{task.id}</Text>
          </Descriptions.Item> */}
        </Descriptions>
      </Card>
    </AppLayout>
  );
}
