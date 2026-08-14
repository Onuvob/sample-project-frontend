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
  Tag,
} from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { getTaskList } from "@/services/organization/taskService";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

/* -------------------- FILTER DEFAULTS -------------------- */
const DEFAULT_FILTERS = {
  name: "",
  organizationId: null,
  taskId: null,
  createdBy: null,
  createdAt: null,
  updatedBy: null,
  updatedAt: null,
};

export default function ProductList() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /* -------------------- FETCH DATA -------------------- */
  const fetchTasks = useCallback(
    async (pageNum = page, size = pageSize, f = filters) => {
      setLoading(true);
      try {
        const response = await getTaskList({
          ...f,
          page: pageNum - 1,
          size,
        });

        setTasks(response?.content ?? []);
        setTotal(response?.totalElements ?? 0);
      } catch (error) {
        console.error("Failed to load tasks", error);
        setTasks([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, filters]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* -------------------- TABLE COLUMNS -------------------- */
  const columns = useMemo(
    () => [
      {
        title: "SL",
        width: 60,
        align: "center",
        render: (_t, _r, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Task Name",
        dataIndex: "name",  
        align: "center",
      },
      {
        title: "Description",
        dataIndex: "description",  
        align: "center",
      },
      {
        title: "Base Price",
        dataIndex: "basePrice",
        align: "center",
        render: (value) => (value != null ? `৳ ${value}` : "-"),
      },
      {
        title: "Status",
        dataIndex: "isActive",
        align: "center",
        render: (active) =>
          active ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          ),
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
                router.push(routes.organization.tasks.view(record.id))
              }
            >
              View
            </Button>
            <Button
              type="link"
              style={{ color: "#fa8c16" }}
              icon={<EditOutlined />}
              onClick={() =>
                router.push(routes.organization.tasks.edit(record.id))
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

  /* -------------------- FILTER ACTIONS -------------------- */
  const applyFilters = () => {
    setPage(1);
    fetchTasks(1, pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchTasks(1, pageSize, DEFAULT_FILTERS);
  };

  /* -------------------- UI -------------------- */
  return (
    <AppLayout breadcrumb={[{ title: "Organization Tasks" }, { title: "List" }]}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Organization Task List</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => router.push(routes.organization.tasks.create)}
          >
            Create
          </Button>
        </Col>
      </Row>

      {/* -------------------- FILTERS -------------------- */}
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Task Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />

          <Input
            placeholder="Organization ID"
            value={filters.organizationId ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                organizationId: e.target.value ? Number(e.target.value) : null,
              })
            }
          />

          <Input
            placeholder="Task ID"
            value={filters.taskId ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                taskId: e.target.value ? Number(e.target.value) : null,
              })
            }
          />

          <Input
            placeholder="Created By"
            value={filters.createdBy ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                createdBy: e.target.value ? Number(e.target.value) : null,
              })
            }
          />

          <Input
            placeholder="Updated By"
            value={filters.updatedBy ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                updatedBy: e.target.value ? Number(e.target.value) : null,
              })
            }
          />

          <DatePicker
            placeholder="Created Date"
            value={filters.createdAt ? dayjs(filters.createdAt) : null}
            onChange={(date) =>
              setFilters({
                ...filters,
                createdAt: date ? date.format("YYYY-MM-DD") : null,
              })
            }
          />

          <DatePicker
            placeholder="Updated Date"
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

      {/* -------------------- TABLE -------------------- */}
      <Table
        size="small"
        rowKey="id"
        dataSource={tasks}
        columns={columns}
        loading={loading}
        locale={{ emptyText: <Empty description="No tasks found" /> }}
        scroll={{ x: "max-content" }}
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
      />
    </AppLayout>
  );
}
