"use client";

import { useEffect, useState } from "react";
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
  Avatar,
} from "antd";
import { PlusOutlined, ProductOutlined, MenuOutlined } from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  editPackageVersion,
  getPackageVersion,
} from "@/services/organization/packageService";
import PageLoader from "@/components/common/PageLoader";
import OrgTaskSelect from "@/components/common/organization/OrgTaskSelect";

const { Text } = Typography;

export default function PackageVersionUpdate() {
  const router = useRouter();
  const { packageId, versionId } = useParams();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const [initialFormValues, setInitialFormValues] = useState(null);

  /* -------------------- LOAD VERSION -------------------- */
  const fetchVersion = async () => {
    setLoading(true);
    try {
      const data = await getPackageVersion(versionId);

      const items = data.items.map((i) => ({
        id: i.id,
        orgTaskId: i.orgTaskId,
        taskName: i.taskName,
        quantity: i.quantity ?? 1,
        isOptional: i.isOptional ?? false,
        isActive: i.isActive ?? true,
        priceOverride: i.priceOverride ?? 0,
        notes: i.notes || "",
      }));

      setInitialFormValues({
        title: data.title,
        description: data.description,
        basePrice: data.basePrice,
        currency: data.currency,
        items,
      });

      setTasks(items); // cache tasks
    } catch {
      message.error("Failed to load package version");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersion();
  }, []);

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

  const cacheTask = (task) => {
    if (!task) return;
    setTasks((prev) => (prev.some((t) => t.id === task.id) ? prev : [...prev, task]));
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
        items: values.items.map((item, index) => {
          const resolvedTask = tasks.find((t) => t.id === item.orgTaskId);

          return {
            id: item.id,
            orgTaskId: item.orgTaskId,
            taskName: resolvedTask?.taskName ?? item.taskName ?? null,
            sequenceOrder: index + 1,
            quantity: item.quantity ?? 1,
            isOptional: item.isOptional ?? false,
            isActive: item.isActive ?? true,
            priceOverride: item.priceOverride ?? 0,
            notes: item.notes || "",
          };
        }),
      };

      await editPackageVersion(versionId, payload);
      message.success("Package version updated successfully");
      router.replace(
        routes.organization.packages.version.view(packageId, versionId)
      );
    } catch (error) {
      message.error(
        error?.response?.data?.error || "Failed to update package version"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !initialFormValues) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumb={[
        { title: "Package List", href: routes.organization.packages.list },
        { title: "Back to Package", href: routes.organization.packages.view(packageId) },
        { title: "Update Version" },
      ]}
    >
      <Card style={{ maxWidth: 900, margin: "24px auto" }}>
        <Card.Meta
          avatar={<Avatar size={64} icon={<ProductOutlined />} style={{ backgroundColor: "#1677ff" }} />}
          title="Update Package Version"
          description="Edit package tasks, pricing and configuration"
        />

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
          initialValues={initialFormValues}
        >
          {/* BASIC INFO */}
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Package Base Price" name="basePrice" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Tasks</Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => {
                  const selectedTaskId = form.getFieldValue(["items", name, "orgTaskId"]);
                  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

                  return (
                    <Card
                      key={key}
                      size="small"
                      draggable
                      onDragStart={() => setDraggingIndex(index)}
                      onDragEnd={() => setDraggingIndex(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        const from = draggingIndex;
                        const to = index;
                        if (from === null || from === to) return;
                        const items = [...form.getFieldValue("items")];
                        const [moved] = items.splice(from, 1);
                        items.splice(to, 0, moved);
                        form.setFieldsValue({ items });
                        recalculatePackagePrice();
                      }}
                      style={{ marginBottom: 12, cursor: "grab" }}
                    >
                      <Form.Item {...restField} name={[name, "taskName"]} hidden>
                        <Input />
                      </Form.Item>

                      <Row gutter={12} align="middle">
                        <Col span={1}><MenuOutlined /></Col>

                        <Col span={5}>
                          <Form.Item
                            {...restField}
                            name={[name, "orgTaskId"]}
                            label={
                              <Space size={6}>
                                Task
                                {selectedTask && <Text type="secondary">(Base: ৳ {selectedTask.basePrice})</Text>}
                              </Space>
                            }
                            rules={[{ required: true, message: `Task ${index + 1} is required` }]}
                          >
                            <OrgTaskSelect
                              value={selectedTaskId}
                              disabledIds={form
                                .getFieldValue("items")
                                ?.map((i, iIndex) => (iIndex !== index ? i?.orgTaskId : null))
                                .filter(Boolean)}
                              onChange={(taskId, task) => {
                                const items = [...(form.getFieldValue("items") || [])];
                                if (!taskId) {
                                  items[index] = { ...items[index], orgTaskId: null, taskName: null, priceOverride: 0 };
                                  form.setFieldsValue({ items });
                                  recalculatePackagePrice();
                                  return;
                                }
                                cacheTask(task);
                                items[index] = {
                                  ...items[index],
                                  orgTaskId: task.id,
                                  taskName: task.name,
                                  priceOverride: task.basePrice,
                                  quantity: items[index]?.quantity ?? 1,
                                  isActive: items[index]?.isActive ?? true,
                                };
                                form.setFieldsValue({ items });
                                recalculatePackagePrice();
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Form.Item {...restField} label="Qty" name={[name, "quantity"]}>
                            <InputNumber min={1} style={{ width: "100%" }} onChange={recalculatePackagePrice} />
                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Form.Item {...restField} label="Optional" name={[name, "isOptional"]} valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Form.Item {...restField} label="Active" name={[name, "isActive"]} valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </Col>

                        <Col span={3}>
                          <Form.Item {...restField} label="Price" name={[name, "priceOverride"]}>
                            <InputNumber min={0} style={{ width: "100%" }} onChange={recalculatePackagePrice} />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item {...restField} label="Notes" name={[name, "notes"]}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col span={2}>
                          <Button danger onClick={() => { remove(name); setTimeout(recalculatePackagePrice, 0); }}>Remove</Button>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}

                <Form.Item>
                  <Button
                    block
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add({ quantity: 1, isActive: true })}
                  >
                    Add Task
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          <Space style={{ justifyContent: "flex-end", width: "100%" }}>
            <Button onClick={() => router.back()}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>Update Version</Button>
          </Space>
        </Form>
      </Card>
    </AppLayout>
  );
}
