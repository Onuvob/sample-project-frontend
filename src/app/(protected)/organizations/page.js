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
  Typography
} from "antd";
import { getOrganizationList } from "@/services/organizationService";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const DEFAULT_FILTERS = {
  name: "",
  rootUser: "",
  createdBy: "",
  updatedBy: "",
  createdAt: null,
  updatedAt: null,
};

export default function OrganizationList() {
  const router = useRouter();

  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchOrgs = useCallback(
    async (pageNum = page, size = pageSize, f = filters) => {
      setLoading(true);
      try {
        const response = await getOrganizationList({
          ...f,
          page: pageNum - 1,
          size,
        });

        setOrgs(response?.content ?? []);
        setTotal(response?.totalElements ?? 0);
      } catch (error) {
        console.error("Failed to load organizations", error);
        setOrgs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, filters]
  );

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const columns = useMemo(
    () => [
      {
        title: "SL",
        align: "center",
        width: 60,
        render: (_text, _record, index) =>
          (page - 1) * pageSize + index + 1,
      },
      {
        title: "Profile",
        dataIndex: "profilePhoto",
        align: "center",
        render: (photo, record) => (
          <Avatar src={photo} alt={record.name} size={32} />
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Description",
        dataIndex: "description",
      },
      {
        title: "Root User",
        dataIndex: "rootFullName",
        align: "center",
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
              onClick={() =>
                router.push(routes.organizations.view(record.id))
              }
            >
              View
            </Button>
            <Button
              type="link"
              style={{ color: "#fa8c16" }}
              icon={<EditOutlined />}
              onClick={() =>
                router.push(routes.organizations.edit(record.id))
              }
            >
              Edit
            </Button>
          </Space>
        ),
      },
    ],
    [page, pageSize, router]
  );

  const applyFilters = () => {
    setPage(1);
    fetchOrgs(1, pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchOrgs(1, pageSize, DEFAULT_FILTERS);
  };

  return (
    <AppLayout breadcrumb={[{ title: "Organizations" }, { title: "List" }]}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Organization List</h2>
          <Text type="secondary">Manage all organizations and their details</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => router.push(routes.organizations.create)}
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
            onChange={(e) =>
              setFilters({ ...filters, name: e.target.value })
            }
          />
          <Input
            placeholder="Root User"
            value={filters.rootUser}
            onChange={(e) =>
              setFilters({ ...filters, rootUser: e.target.value })
            }
          />
          <Input
            placeholder="Created By"
            value={filters.createdBy}
            onChange={(e) =>
              setFilters({ ...filters, createdBy: e.target.value })
            }
          />
          <Input
            placeholder="Updated By"
            value={filters.updatedBy}
            onChange={(e) =>
              setFilters({ ...filters, updatedBy: e.target.value })
            }
          />
          <DatePicker
            placeholder="Created At"
            value={filters.createdAt ? dayjs(filters.createdAt) : null}
            onChange={(date) =>
              setFilters({
                ...filters,
                createdAt: date ? date.format("YYYY-MM-DD") : null,
              })
            }
          />
          <DatePicker
            placeholder="Updated At"
            value={filters.updatedAt ? dayjs(filters.updatedAt) : null}
            onChange={(date) =>
              setFilters({
                ...filters,
                updatedAt: date ? date.format("YYYY-MM-DD") : null,
              })
            }
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
        locale={{ emptyText: <Empty description="No organizations found" /> }}
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