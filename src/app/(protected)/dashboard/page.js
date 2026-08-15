"use client";

import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";
import {
  Spin,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Space,
  Avatar,
  Divider,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ShopOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Spin size="large" style={{ margin: "120px auto", display: "block" }} />
    );
  }

  return (
    <AppLayout breadcrumb={[{ title: "Dashboard" }]}>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <Title level={3} style={{ marginBottom: "6px" }}>
          Welcome back, {user?.firstName} 👋
        </Title>
        <Text type="secondary">
          Here’s what’s happening with your account today.
        </Text>
      </div>

      {/* STATS */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={styles.statCard}>
            <Statistic
              title="Total Bookings"
              value={128}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={styles.statCard}>
            <Statistic
              title="Active Coupons"
              value={5}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={styles.statCard}>
            <Statistic
              title="Today’s Bookings"
              value={14}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={styles.statCard}>
            <Statistic title="Role" value={user?.role || "Admin"} />
          </Card>
        </Col>
      </Row>

      {/* CONTENT */}
      <Row gutter={[24, 24]} style={{ marginTop: "30px" }}>
        {/* PROFILE CARD */}
        <Col xs={24} md={10}>
          <Card title="Profile Overview" variant="borderless">
            <Space size={16}>
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Text strong style={{ fontSize: "16px" }}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <br />
                <Text type="secondary">{user?.email}</Text>
              </div>
            </Space>

            <Divider />

            <Text type="secondary">Account Status</Text>
            <br />
            <Text strong style={{ color: "#16a34a" }}>
              Active
            </Text>
          </Card>
        </Col>

        {/* QUICK ACTIONS */}
        <Col xs={24} md={14}>
          <Card title="Quick Actions" variant="borderless">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Button block size="large" style={styles.actionButton}>
                  Bookings
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button block size="large" style={styles.actionButton}>
                  Vehicles
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button block size="large" style={styles.actionButton}>
                  Coupons
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button block size="large" style={styles.actionButton}>
                  Profile
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

/* ================= STYLES ================= */

const styles = {
  statCard: {
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  actionButton: {
    height: "48px",
    borderRadius: "10px",
    fontWeight: "500",
  },
};
