"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  message,
  Avatar,
  Divider,
  Space,
  Switch,
} from "antd";
import {
  PlusOutlined,
  ProductOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createTask } from "@/services/organization/taskService";

import CurrencyInputNumber from "@/components/common/CurrencyInputNumber";
import OrganizationSelect from "@/components/common/organization/OrganizationSelect";
import TaskSelect from "@/components/common/TaskSelect";

export default function OrganizationTaskCreate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const metadataObject = {};

      (values.metadata || []).forEach(({ key, value }) => {
        if (key) {
          if (value === "true") metadataObject[key] = true;
          else if (value === "false") metadataObject[key] = false;
          else if (!isNaN(value)) metadataObject[key] = Number(value);
          else metadataObject[key] = value;
        }
      });

      const payload = {
        organizationId: values.organizationId,
        taskId: values.taskId,
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        basePrice: values.basePrice,
        currency: values.currency || "BDT",
        durationMinutes: values.durationMinutes,
        slaSeconds: values.slaSeconds,
        metadata:
          Object.keys(metadataObject).length > 0 ? metadataObject : null,
      };

      await createTask(payload);

      message.success("Organization task created successfully");
      router.replace(routes.organization.tasks.list);
    } catch {
      message.error("Failed to create organization task");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        { title: "Organization Tasks", href: routes.organization.tasks.list },
        { title: "Create" },
      ]}
    >
      <Card style={{ maxWidth: 720, margin: "24px auto" }}>
        <Card.Meta
          avatar={
            <Avatar
              size={64}
              icon={<ProductOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
          }
          title="Create Organization Task"
          description="Assign an existing task with custom configuration"
        />

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            currency: "BDT",
          }}
          disabled={submitting}
        >
          {/* Organization */}
          <Form.Item
            label="Organization"
            name="organizationId"
            rules={[{ required: true, message: "Organization is required" }]}
          >
            <OrganizationSelect />
          </Form.Item>

          {/* Task */}
          <Form.Item
            label="Task"
            name="taskId"
            rules={[{ required: true, message: "Task is required" }]}
          >
            <TaskSelect
              onChange={(taskId, task) => {
                if (task) {
                  form.setFieldsValue({
                    name: task.name,
                    description: task.description,
                  });
                }
              }}
            />
          </Form.Item>

          {/* Task Name */}
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: "Task name is required" }]}
          >
            <Input placeholder="Task name" />
          </Form.Item>

          {/* Description */}
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Optional description" />
          </Form.Item>

          {/* Base Price */}
          <Form.Item
            label="Base Price"
            name="basePrice"
            rules={[{ required: true, message: "Base price is required" }]}
          >
            <CurrencyInputNumber min={0} placeholder="Enter price" />
          </Form.Item>

          {/* Duration */}
          <Form.Item label="Duration (Minutes)" name="durationMinutes">
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="e.g. 30"
            />
          </Form.Item>

          {/* SLA */}
          <Form.Item label="SLA (Seconds)" name="slaSeconds">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="e.g. 1800"
            />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Active Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren="Inactive"
            />
          </Form.Item>

          {/* Metadata */}
          <Form.Item label="Metadata">
            <Form.List name="metadata">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      align="baseline"
                      style={{ display: "flex", marginBottom: 8 }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        rules={[{ required: true, message: "Key is required" }]}
                      >
                        <Input placeholder="Key" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[
                          { required: true, message: "Value is required" },
                        ]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>

                      <Button danger type="text" onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Space>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    + Add Metadata
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Divider />

          {/* Actions */}
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => router.back()} disabled={submitting}>
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={submitting}
            >
              Create
            </Button>
          </Space>
        </Form>
      </Card>
    </AppLayout>
  );
}
