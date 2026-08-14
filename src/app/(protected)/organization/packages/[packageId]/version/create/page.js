"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Divider,
  Space,
  InputNumber,
  Switch,
  Row,
  Col,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ProductOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createPackageVersion } from "@/services/organization/packageService";
import OrgTaskSelect from "@/components/common/organization/OrgTaskSelect";

const { Text } = Typography;

export default function PackageVersionCreate() {
  const router = useRouter();
  const { packageId } = useParams();
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [droppingIndex, setDroppingIndex] = useState(null);

  /* -------------------- HELPERS -------------------- */
  const recalculatePackagePrice = () => {
    const items = form.getFieldValue("items") || [];
    const total = items.reduce((sum, item) => {
      const price = item?.priceOverride ?? 0;
      const qty = item?.quantity ?? 1;
      return sum + price * qty;
    }, 0);
    form.setFieldValue("basePrice", total);
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        basePrice: values.basePrice,
        currency: values.currency,
        items: values.items.map((item, index) => ({
          orgTaskId: item.orgTaskId,
          taskName: item.taskName,
          sequenceOrder: index + 1,
          quantity: item.quantity || 1,
          isOptional: item.isOptional || false,
          isActive: item.isActive ?? true,
          priceOverride: item.priceOverride || null,
          notes: item.notes || "",
        })),
      };

      await createPackageVersion(packageId, payload);
      message.success("Package version created successfully");
      router.replace(routes.organization.packages.view(packageId));
    } catch (error) {
      message.error(
        error?.response?.data?.error || "Failed to create package version"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <AppLayout
      breadcrumb={[
        { title: "Package List", href: routes.organization.packages.list },
        {
          title: "Back to Package",
          href: routes.organization.packages.view(packageId),
        },
        { title: "Create Version" },
      ]}
    >
      <Card style={{ maxWidth: 900, margin: "24px auto" }}>
        <Card.Meta
          avatar={<ProductOutlined style={{ fontSize: 32, color: "#1677ff" }} />}
          title="Create Package Version"
          description="Compose package tasks with pricing and configuration"
        />

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
          initialValues={{ currency: "BDT" }}
        >
          {/* BASIC INFO */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Package Base Price"
                name="basePrice"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Tasks</Divider>

          {/* TASK ITEMS */}
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => {
                  const selectedIds =
                    form
                      .getFieldValue("items")
                      ?.map((i) => i?.orgTaskId)
                      .filter(Boolean) || [];

                  return (
                    <Card
                      key={key}
                      size="small"
                      draggable
                      onDragStart={() => setDraggingIndex(index)}
                      onDragEnd={() => setDraggingIndex(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        const items = [...(form.getFieldValue("items") || [])];
                        const [moved] = items.splice(draggingIndex, 1);
                        items.splice(index, 0, moved);
                        form.setFieldsValue({ items });
                        setDraggingIndex(null);
                        setTimeout(recalculatePackagePrice, 0);
                      }}
                      style={{ marginBottom: 12, cursor: "grab" }}
                    >
                      {/* HIDDEN TASK NAME */}
                      <Form.Item
                        {...restField}
                        name={[name, "taskName"]}
                        hidden
                      >
                        <Input />
                      </Form.Item>

                      <Row gutter={16} align="middle">
                        <Col span={1}>
                          <MenuOutlined />
                        </Col>

                        <Col span={5}>
                          <Form.Item
                            {...restField}
                            label="Task"
                            name={[name, "orgTaskId"]}
                            rules={[
                              {
                                required: true,
                                message: `Task ${index + 1} is required`,
                              },
                            ]}
                          >
                            <OrgTaskSelect
                              disabledIds={selectedIds}
                              onChange={(taskId, task) => {
                                const items = [...(form.getFieldValue("items") || [])];

                                if (!taskId) {
                                  // ✅ CLEAR FORM STATE
                                  items[index] = {
                                    ...items[index],
                                    orgTaskId: null,
                                    taskName: null,
                                    priceOverride: null,
                                  };
                                  form.setFieldsValue({ items });
                                  recalculatePackagePrice();
                                  return;
                                }

                                items[index] = {
                                  ...items[index],
                                  orgTaskId: task.id,
                                  taskName: task.name,
                                  priceOverride: task.basePrice,
                                };

                                form.setFieldsValue({ items });
                                recalculatePackagePrice();
                              }}
                            />

                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            label="Qty"
                            name={[name, "quantity"]}
                            initialValue={1}
                          >
                            <InputNumber
                              min={1}
                              style={{ width: "100%" }}
                              onChange={recalculatePackagePrice}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            label="Optional"
                            name={[name, "isOptional"]}
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            label="Active"
                            name={[name, "isActive"]}
                            valuePropName="checked"
                            initialValue={true}
                          >
                            <Switch />
                          </Form.Item>
                        </Col>

                        <Col span={3}>
                          <Form.Item
                            {...restField}
                            label="Price"
                            name={[name, "priceOverride"]}
                          >
                            <InputNumber
                              min={0}
                              style={{ width: "100%" }}
                              onChange={recalculatePackagePrice}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            label="Notes"
                            name={[name, "notes"]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Button
                            danger
                            onClick={() => {
                              remove(name);
                              setTimeout(recalculatePackagePrice, 0);
                            }}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}

                <Form.Item>
                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                  >
                    Add Task
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => router.back()}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Create Version
            </Button>
          </Space>
        </Form>
      </Card>
    </AppLayout>
  );
}
