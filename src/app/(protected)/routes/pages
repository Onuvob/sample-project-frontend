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
import { getRouteList } from "@/services/routeService";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DEFAULT_FILTERS = {
  source: "",
  destination: "",
};

export default function RouteList() {
  const router = useRouter();
  
  const [routeData, setRouteData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchRoutes = useCallback(
    async (pageNum = page, size = pageSize, f = filters) => {
      setLoading(true);
      try {
        const response = await getRouteList({
          ...f,
          page: pageNum - 1,
          size,
        });

        setRouteData(response?.data ?? []);
        setTotal(response?.totalElements ?? 0);
      } catch (error) {
        console.error("Failed to load routes", error);
        setRouteData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, filters],
  );

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const columns = useMemo(
    () => [
      {
        title: "SL",
        align: "center",
        width: 60,
        render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Source",
        dataIndex: "source",
      },
      {
        title: "Destination",
        dataIndex: "destination",
      },
      {
        title: "Service Fee",
        dataIndex: "serviceFee",
        align: "right",
        render: (value) => (value != null ? value : "-"),
      },
      {
        title: "Status",
        dataIndex: "active",
        align: "center",
        render: (value) => (
          <Tag color={value ? "success" : "error"}>
            {value ? "Active" : "Inactive"}
          </Tag>
        ),
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
              onClick={() => router.push(routes.routes.view(record.id))}
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
    fetchRoutes(1, pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchRoutes(1, pageSize, DEFAULT_FILTERS);
  };

  return (
    <AppLayout breadcrumb={[{ title: "Routes" }, { title: "List" }]}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Route List</h2>
          <Text type="secondary">
            Manage all routes and their details
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => router.push(routes.routes.create)}
          >
            Create
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Source"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          />
          <Input
            placeholder="Destination"
            value={filters.destination}
            onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
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
        dataSource={routeData}
        columns={columns}
        loading={loading}
        locale={{ emptyText: <Empty description="No routes found" /> }}
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