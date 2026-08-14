"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  DatePicker,
  Space,
  Row,
  Col,
  Empty,
  Typography,
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { getUserList } from "@/services/userService";

const { Text } = Typography;

const DEFAULT_FILTERS = {
  username: "",
  phone: "",
  rootUser: "",
  createdBy: "",
  updatedBy: "",
  createdAt: null,
  updatedAt: null,
};

export default function UserList() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchUsers = useCallback(
    async (pageNum = page, size = pageSize, f = filters) => {
      setLoading(true);
      try {
        const response = await getUserList({
          ...f,
          page: pageNum - 1, // backend is 0-based
          size,
        });

        setUsers(response?.content ?? []);
        setTotal(response?.totalElements ?? 0);
      } catch (error) {
        console.error("Failed to load users", error);
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, filters]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const applyFilters = () => {
    setPage(1);
    fetchUsers(1, pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchUsers(1, pageSize, DEFAULT_FILTERS);
  };

  const columns = useMemo(
    () => [
      {
        title: "SL",
        align: "center",
        width: 60,
        render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "First Name",
        dataIndex: "firstname",
        align: "center",
      },
      {
        title: "Last Name",
        dataIndex: "lastname",
        align: "center",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        align: "center",
      },
      {
        title: "Username",
        dataIndex: "username",
        align: "center",
      },
      {
        title: "Actions",
        align: "center",
        render: (_text, record) => (
          <Space>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => router.push(routes.users.view(record.id))}
            >
              View
            </Button>
            <Button
              type="link"
              style={{ color: "#fa8c16" }}
              icon={<EditOutlined />}
              onClick={() => router.push(routes.users.edit(record.id))}
            >
              Edit
            </Button>
          </Space>
        ),
      },
    ],
    [page, pageSize, router]
  );

  return (
    <AppLayout breadcrumb={[{ title: "Users" }, { title: "List" }]}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>User List</h2>
          <Text type="secondary">Manage all system users</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => router.push(routes.users.create)}
          >
            Create
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Username"
            value={filters.username}
            onChange={(e) =>
              setFilters({ ...filters, username: e.target.value })
            }
          />
          <Input
            placeholder="Phone"
            value={filters.phone}
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
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
        dataSource={users}
        columns={columns}
        loading={loading}
        locale={{ emptyText: <Empty description="No users found" /> }}
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
