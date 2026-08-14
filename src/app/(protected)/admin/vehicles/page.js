"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Avatar,
  Input,
  Button,
  DatePicker,
  Space,
  Row,
  Col,
  Empty,
  Typography,
} from "antd";
import { getPendingVehicleList } from "@/services/adminVehicleService";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

const { Text } = Typography;
const DEFAULT_FILTERS = {
  name: "",
};

export default function PendingVehicleList() {
  const router = useRouter();

  const [orgs, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchPendingVehicles = useCallback(
    async (pageNum = page, size = pageSize, f = filters) => {
      setLoading(true);
      try {
        const response = await getPendingVehicleList({
          ...f,
          page: pageNum - 1,
          size,
        });

        setVehicles(response?.data ?? []);
        setTotal(response?.totalElements ?? 0);
      } catch (error) {
        console.error("Failed to load pending vehicles", error);
        setVehicles([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, filters],
  );

  useEffect(() => {
    fetchPendingVehicles();
  }, [fetchPendingVehicles]);

  const columns = useMemo(
    () => [
      {
        title: "SL",
        align: "center",
        width: 60,
        render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Name",
        dataIndex: "name",
      },

      {
        title: "Registration Number",
        dataIndex: "registrationNumber",
      },

      {
        title: "Type",
        dataIndex: "type",
      },

      {
        title: "Capacity",
        dataIndex: "capacity",
      },

      {
        title: "Status",
        dataIndex: "status",
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
              onClick={() => router.push(routes.pendingVehicles.view(record.id))}
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
    fetchPendingVehicles(1, pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchPendingVehicles(1, pageSize, DEFAULT_FILTERS);
  };

  return (
    <AppLayout breadcrumb={[{ title: "Pending Vehicles" }, { title: "List" }]}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Pending Vehicle List</h2>
          <Text type="secondary">
            Manage all pending vehicles and their details
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => router.push(routes.ownerVehicles.create)}
          >
            Create
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
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
        dataSource={orgs}
        columns={columns}
        loading={loading}
        locale={{ emptyText: <Empty description="No pending vehicles found" /> }}
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
