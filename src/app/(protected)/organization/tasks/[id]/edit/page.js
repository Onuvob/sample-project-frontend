"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  EditOutlined,
  ProductOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getTask,
  editTask,
} from "@/services/organization/taskService";
import PageLoader from "@/components/common/PageLoader";
import CurrencyInputNumber from "@/components/common/CurrencyInputNumber";

export default function OrganizationTaskEdit() {
  const router = useRouter();
  const { id } = useParams();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState(null);

  /* -------------------- FETCH TASK -------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchTask = async () => {
      try {
        const data = await getTask(id);
        if (!mounted) return;
        setTask(data);
      } catch {
        message.error("Failed to load organization task");
        router.replace(routes.organization.tasks.list);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchTask();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  /* -------------------- SET FORM VALUES (SAFE) -------------------- */
  useEffect(() => {
    if (!task) return;

    const metadataList = task.metadata
      ? Object.entries(task.metadata).map(([key, value]) => ({
        key,
        value: String(value),
      }))
      : [];

    form.setFieldsValue({
      name: task.name ?? "",
      description: task.description ?? "",
      isActive: task.isActive ?? false,
      basePrice: task.basePrice ?? null,
      currency: task.currency ?? "",
      durationMinutes: task.durationMinutes ?? null,
      slaSeconds: task.slaSeconds ?? null,
      metadata: metadataList,
    });
  }, [task, form]);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const metadataObject = {};

      (values.metadata || []).forEach(({ key, value }) => {
        if (!key) return;
        if (value === "true") metadataObject[key] = true;
        else if (value === "false") metadataObject[key] = false;
        else if (!isNaN(value)) metadataObject[key] = Number(value);
        else metadataObject[key] = value;
      });

      const payload = {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        basePrice: values.basePrice,
        currency: values.currency,
        durationMinutes: values.durationMinutes,
        slaSeconds: values.slaSeconds,
        metadata:
          Object.keys(metadataObject).length > 0 ? metadataObject : null,
      };

      await editTask(id, payload);

      message.success("Organization task updated successfully");
      router.replace(routes.organization.tasks.list);
    } catch {
      message.error("Failed to update organization task");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        { title: "Organization Tasks", href: routes.organization.tasks.list },
        { title: "Edit" },
      ]}
    >
      <Card style={{ maxWidth: 720, margin: "24px auto" }}>
        <Card.Meta
          avatar={
            <Avatar
              size={64}
              icon={<ProductOutlined />}
              style={{ backgroundColor: "#faad14" }}
            />
          }
          title="Edit Organization Task"
          description="Update organization-specific task configuration"
        />

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
        >
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: "Task name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Base Price"
            name="basePrice"
            rules={[{ required: true, message: "Base price is required" }]}
          >
            <CurrencyInputNumber min={0} placeholder="Enter price" />
          </Form.Item>

          <Form.Item label="Currency" name="currency">
            <Input />
          </Form.Item>

          <Form.Item label="Duration (Minutes)" name="durationMinutes">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="SLA (Seconds)" name="slaSeconds">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

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
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Key" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[{ required: true }]}
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

          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => router.back()} disabled={submitting}>
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<EditOutlined />}
              loading={submitting}
            >
              Update
            </Button>
          </Space>
        </Form>
      </Card>
    </AppLayout>
  );
}
