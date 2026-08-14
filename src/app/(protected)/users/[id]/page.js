"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Avatar,
  Descriptions,
  Spin,
  Button,
  message,
  Empty,
  Typography,
  Row,
  Space,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { getUser } from "@/services/userService";
import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function UserView() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------- FETCH USER -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const data = await getUser(id);
        if (mounted) setUser(data);
      } catch (error) {
        message.error("Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* -------------------- LOADING / EMPTY -------------------- */
  if (loading) {
    return (<AppLayout> <PageLoader /> </AppLayout>);
  }

  if (!user) {
    return <Empty description="User not found" style={{ marginTop: 100 }} />;
  }

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        { title: "Users", href: routes.users.list },
        { title: user.username },
      ]}
    >
      {/* ================= SUMMARY ================= */}
      <Card style={{ maxWidth: 900, margin: "24px auto 12px" }}>
        <Row align="middle" justify="space-between">
          <Space size="large">
            <Avatar
              size={72}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />

            <div>
              <Title level={3} style={{ margin: 0 }}>
                {user.firstname} {user.lastname}
              </Title>
              <Text type="secondary">@{user.username}</Text>
            </div>
          </Space>

          <Space>
            <Button
              type="primary"
              style={{
                backgroundColor: "#fa8c16",
                borderColor: "#fa8c16",
              }}
              onClick={() => router.push(routes.users.edit(id))}
            >
              Edit
            </Button>

            <Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Space>
        </Row>
      </Card>

      {/* ================= DETAILS ================= */}
      <Card
        title="User Information"
        style={{ maxWidth: 900, margin: "12px auto" }}
      >
        <Descriptions bordered size="small" column={2}>
          {/* <Descriptions.Item label="User ID">{user.id}</Descriptions.Item> */}

          <Descriptions.Item label="First Name">
            {user.firstname}
          </Descriptions.Item>

          <Descriptions.Item label="Last Name">
            {user.lastname}
          </Descriptions.Item>

          <Descriptions.Item label="Username">
            {user.username}
          </Descriptions.Item>

          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        </Descriptions>
      </Card>
    </AppLayout>
  );
}
