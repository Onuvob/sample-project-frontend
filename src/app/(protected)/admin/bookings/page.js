"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Row,
  Col,
  Empty,
  Typography,
  Tag,
} from "antd";
import { getBookingList } from "@/services/adminBookingService";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DEFAULT_FILTERS = {
  search: "",
};

export default function BookingList() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchBookings = useCallback(
    async (pageNum = page, size = pageSize, f = filters) => {
      setLoading(true);
      try {
        const response = await getBookingList({
          ...f,
          page: pageNum - 1,
          size,
        });

        setBookings(response?.data ?? []);
        setTotal(response?.totalElements ?? 0);
      } catch (error) {
        console.error("Failed to load bookings", error);
        setBookings([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, filters],
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const columns = useMemo(
    () => [
      {
        title: "SL",
        align: "center",
        width: 60,
        render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Owner",
        render: (_text, record) =>
          [record.ownerFirstName, record.ownerLastName].filter(Boolean).join(" ") || "-",
      },
      {
        title: "Vehicle",
        render: (_text, record) => (
          <div>
            <div>{record.vehicleName || "-"}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.vehicleRegNo}
            </Text>
          </div>
        ),
      },
      {
        title: "Route",
        render: (_text, record) =>
          record.routeSource && record.routeDestination
            ? `${record.routeSource} → ${record.routeDestination}`
            : "-",
      },
      {
        title: "Pilot",
        render: (_text, record) => (
          <div>
            <div>{record.pilotName || "-"}</div>
            {record.pilotPhone && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.pilotPhone}
              </Text>
            )}
          </div>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        align: "right",
        render: (value) => (value != null ? value : "-"),
      },
      {
        title: "Payment",
        dataIndex: "paymentStatus",
        align: "center",
        render: (value) => {
          if (!value) return "-";
          const color =
            value === "PAID"
              ? "success"
              : value === "PENDING"
              ? "warning"
              : value === "FAILED"
              ? "error"
              : "default";
          return <Tag color={color}>{value}</Tag>;
        },
      },
      {
        title: "Booking Status",
        dataIndex: "bookingStatus",
        align: "center",
        render: (value) => {
          if (!value) return "-";
          const color =
            value === "CONFIRMED" || value === "COMPLETED"
              ? "success"
              : value === "PENDING"
              ? "processing"
              : value === "CANCELLED"
              ? "error"
              : "default";
          return <Tag color={color}>{value}</Tag>;
        },
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        align: "center",
        width: 160,
        render: (value) =>
          value ? dayjs(value).format("YYYY-MM-DD hh:mm a") : "-",
      },
      {
        title: "Actions",
        align: "center",
        width: 100,
        render: (_text, record) => (
          <Space>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => router.push(routes.adminBookings.view(record.id))}
            >
              View
            </Button>
          </Space>
        ),
      },
    ],
    [page, pageSize, router],
  );

  const applyFilters = () => {
    setPage(1);
    fetchBookings(1, pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchBookings(1, pageSize, DEFAULT_FILTERS);
  };

  return (
    <AppLayout breadcrumb={[{ title: "Bookings" }, { title: "List" }]}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Booking List</h2>
          <Text type="secondary">Manage all bookings and their details</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => router.push(routes.bookings.create)}
          >
            Create
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search owner, vehicle, or route"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: 280 }}
            allowClear
          />
          <Button type="primary" onClick={applyFilters}>
            Apply
          </Button>
          <Button onClick={resetFilters}>Reset</Button>
        </Space>
      </Row>

      {/* Table */}
      <Table
        size="small"
        rowKey="id"
        dataSource={bookings}
        columns={columns}
        loading={loading}
        locale={{ emptyText: <Empty description="No bookings found" /> }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, size) => {
            setPage(p);
            setPageSize(size);
          },
        }}
        scroll={{ x: "max-content" }}
      />
    </AppLayout>
  );
}