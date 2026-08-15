"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  Card,
  Avatar,
  Descriptions,
  Button,
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
  CarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TagOutlined,
  ScheduleOutlined,
  DashboardOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { getBooking } from "@/services/ownerBookingService";

import PageLoader from "@/components/common/PageLoader";

const { Title, Text } = Typography;

export default function BookingView() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchBooking = async () => {
      try {
        const data = await getBooking(id);
        if (mounted) setBooking(data);
      } catch (error) {
        console.error("Failed to load booking", error);
        message.error("Failed to load booking");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBooking();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!booking) {
    return (
      <AppLayout>
        <Empty description="Booking not found" style={{ marginTop: 100 }} />
      </AppLayout>
    );
  }

  // Helper to determine tag color based on Payment Status
  const getPaymentStatusColor = (status) => {
    if (!status) return "default";
    const val = status.toString().toUpperCase();
    if (val === "PAID" || val === "COMPLETED") return "success";
    if (val === "PENDING") return "warning";
    if (val === "FAILED" || val === "REFUNDED") return "error";
    return "default";
  };

  // Helper to determine tag color based on Booking Status
  const getBookingStatusColor = (status) => {
    if (!status) return "default";
    const val = status.toString().toUpperCase();
    if (val === "CONFIRMED" || val === "COMPLETED") return "success";
    if (val === "PENDING") return "processing";
    if (val === "CANCELLED" || val === "REJECTED") return "error";
    return "default";
  };

  // Combine owner name safely
  const ownerFullName = [booking.ownerFirstName, booking.ownerLastName]
    .filter(Boolean)
    .join(" ") || "Unknown Owner";

  return (
    <AppLayout
      breadcrumb={[
        { title: "Bookings", href: routes.bookings.list },
        { title: booking.id ? `Booking #${booking.id}` : "Booking Details" },
      ]}
    >
      <Card
        style={{ maxWidth: 900, margin: "24px auto" }}
        actions={[
          <Space key="actions">
            <Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Space>,
        ]}
      >
        {/* Header with Avatar + Vehicle/Route Info */}
        <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Avatar
              size={80}
              icon={<ScheduleOutlined />}
              style={{ backgroundColor: "#fa8c16", fontSize: 36 }}
            />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {booking.vehicleName || "Unnamed Vehicle"} 
              <Text type="secondary" style={{ fontSize: 16, marginLeft: 8 }}>
                ({booking.vehicleRegNo})
              </Text>
            </Title>
            <Text type="secondary">
              {booking.routeSource && booking.routeDestination
                ? `Route: ${booking.routeSource} → ${booking.routeDestination}`
                : "Booking Details"}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Booking Details */}
        <Card type="inner" title="Booking Information">
          <Descriptions
            bordered
            column={1}
            styles={{ label: { width: 200, fontWeight: 500 } }}
          >
            <Descriptions.Item label={<><NumberOutlined /> Booking ID</>}>
              {booking.id ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><UserOutlined /> Owner</>}>
              {ownerFullName}
            </Descriptions.Item>

            <Descriptions.Item label={<><CarOutlined /> Vehicle Details</>}>
              <div>
                <div><strong>{booking.vehicleName || "-"}</strong> ({booking.vehicleType || "N/A"})</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Reg No: {booking.vehicleRegNo || "-"} | Capacity: {booking.vehicleCapacity ?? "-"}
                </Text>
              </div>
            </Descriptions.Item>

            <Descriptions.Item label={<><EnvironmentOutlined /> Route</>}>
              {booking.routeSource && booking.routeDestination
                ? `${booking.routeSource} → ${booking.routeDestination}`
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><IdcardOutlined /> Pilot</>}>
              <div>
                <div>{booking.pilotName || "-"}</div>
                {booking.pilotPhone && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <PhoneOutlined /> {booking.pilotPhone}
                  </Text>
                )}
              </div>
            </Descriptions.Item>

            <Descriptions.Item label={<><TagOutlined /> Coupon</>}>
              {booking.couponCode ? (
                <>
                  <Tag color="blue">{booking.couponCode}</Tag>
                  <Text type="secondary">
                    (Discount: {booking.couponAmount != null ? booking.couponAmount : 0})
                  </Text>
                </>
              ) : (
                "No coupon applied"
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<><DollarOutlined /> Total Amount</>}>
              <Text strong style={{ fontSize: 16 }}>
                {booking.amount != null ? booking.amount : "-"}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label={<><CheckCircleOutlined /> Payment Status</>}>
              {booking.paymentStatus ? (
                <Tag color={getPaymentStatusColor(booking.paymentStatus)}>
                  {booking.paymentStatus}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<><ScheduleOutlined /> Booking Status</>}>
              {booking.bookingStatus ? (
                <Tag color={getBookingStatusColor(booking.bookingStatus)}>
                  {booking.bookingStatus}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<><ClockCircleOutlined /> Created At</>}>
              {booking.createdAt
                ? dayjs(booking.createdAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label={<><ClockCircleOutlined /> Updated At</>}>
              {booking.updatedAt
                ? dayjs(booking.updatedAt).format("YYYY-MM-DD hh:mm A")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </AppLayout>
  );
}