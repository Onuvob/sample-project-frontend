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
import { getCouponList } from "@/services/adminCouponService";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DEFAULT_FILTERS = {
  code: "",
};

export default function CouponList() {
  const router = useRouter();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchCoupons = useCallback(
    async (pageNum = page, size = pageSize, f = filters) => {
      setLoading(true);
      try {
        const response = await getCouponList({
          ...f,
          page: pageNum - 1,
          size,
        });

        setCoupons(response?.data ?? []);
        setTotal(response?.totalElements ?? 0);
      } catch (error) {
        console.error("Failed to load coupons", error);
        setCoupons([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, filters],
  );

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]); // Fixed bug: was incorrectly referencing fetchPilots

  const columns = useMemo(
    () => [
      {
        title: "SL",
        align: "center",
        width: 60,
        render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Code",
        dataIndex: "code",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        align: "right",
        render: (value) => (value != null ? value : "-"),
      },
      {
        title: "Expiry Date",
        dataIndex: "expiryDate",
        align: "center",
        render: (value) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
      },
      {
        title: "Owner",
        render: (_text, record) =>
          [record.ownerFirstName, record.ownerLastName]
            .filter(Boolean)
            .join(" ") || "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        align: "center",
        render: (value) => (value ? <Tag>{value}</Tag> : "-"),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        align: "center",
        render: (value) =>
          value ? dayjs(value).format("YYYY-MM-DD hh:mm a") : "-",
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        align: "center",
        render: (value) =>
          value ? dayjs(value).format("YYYY-MM-DD hh:mm a") : "-",
      },
      {
        title: "Actions",
        align: "center",
        render: (_text, record) => (
          <Space>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => router.push(routes.adminCoupons.view(record.id))}
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
    fetchCoupons(1, pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchCoupons(1, pageSize, DEFAULT_FILTERS);
  };

  return (
    <AppLayout breadcrumb={[{ title: "Coupons" }, { title: "List" }]}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Coupon List</h2>
          <Text type="secondary">Manage all coupons and their details</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => router.push(routes.adminCoupons.create)}
          >
            Create
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Code"
            value={filters.code}
            onChange={(e) => setFilters({ ...filters, code: e.target.value })}
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
        dataSource={coupons}
        columns={columns}
        loading={loading}
        locale={{ emptyText: <Empty description="No coupons found" /> }}
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
