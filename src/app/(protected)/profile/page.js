"use client";

import React from "react";
import { Card, Row, Col, Typography, Divider } from "antd";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/routes";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user } = useAuth();
  // const router = useRouter();

  return (
    <AppLayout
      breadcrumb={[{ title: "Dashboard", href: routes.dashboard }, { title: "Profile" }]}
    >
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24} md={16} lg={12}>
          <Card
            title={<Title level={4}>My Profile</Title>}
            bordered={false}
            style={{ borderRadius: 12 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>First Name:</Text>
                <div>
                  <Text>{user?.firstname}</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text strong>Last Name:</Text>
                <div>
                  <Text>{user?.lastname}</Text>
                </div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Username:</Text>
                <div>
                  <Text>{user?.username}</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text strong>Phone:</Text>
                <div>
                  <Text>{user?.phone}</Text>
                </div>
              </Col>
            </Row>

            <Divider />

            <Row>
              <Col span={24}>
                <Text type="secondary">
                  This is your profile information. You can update details here
                  in the future.
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
