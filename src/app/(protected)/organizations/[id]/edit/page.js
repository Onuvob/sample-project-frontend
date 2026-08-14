"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  message,
  Divider,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import {
  ApartmentOutlined,
  UserOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import {
  getOrganization,
  editOrganization,
} from "@/services/organizationService";
import PageLoader from "@/components/common/PageLoader";
import UserSelect from "@/components/common/UserSelect";

const { Title, Text } = Typography;

export default function OrganizationEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // -------------------- Fetch Organization --------------------
  useEffect(() => {
    let mounted = true;

    const fetchOrganization = async () => {
      try {
        const data = await getOrganization(id);
        if (!mounted) return;

        setOrganization(data);
      } catch {
        message.error("Failed to load organization");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrganization();
    return () => (mounted = false);
  }, [id]);

  // -------------------- Set form values when organization data is ready --------------------
  useEffect(() => {
    if (organization && form) {
      form.setFieldsValue({
        name: organization.name ?? "",
        description: organization.description ?? "",
      });
    }
  }, [organization, form]);

  // -------------------- Submit --------------------
  const handleSubmit = async (values) => {
    if (!selectedUser) {
      message.error("Please select a new root user");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...values,
        rootUser: selectedUser.id,
        rootFullName: `${selectedUser.firstname} ${selectedUser.lastname}`,
      };

      await editOrganization(id, payload);
      message.success("Organization updated successfully");
      router.replace(routes.organizations.view(id));
    } catch {
      message.error("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !organization) {
    return (<AppLayout> <PageLoader /> </AppLayout>);
  }

  return (
    <AppLayout
      breadcrumb={[
        { title: "Organizations", href: routes.organizations.list },
        { title: organization.name },
        { title: "Edit" },
      ]}
    >
      <Card
        style={{ maxWidth: 900, margin: "24px auto" }}
        cover={
          organization.coverPhoto && (
            <img
              alt={organization.name}
              src={organization.coverPhoto}
              style={{ maxHeight: 220, objectFit: "cover" }}
            />
          )
        }
        actions={[
          <Space key="actions">
            <Button
              onClick={() => router.back()}
              icon={<ArrowLeftOutlined />}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              loading={submitting}
              onClick={() => form.submit()}
            >
              Save Changes
            </Button>
          </Space>,
        ]}
      >
        <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Avatar src={organization.profilePhoto} size={80}>
              {organization.name?.[0]}
            </Avatar>
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Edit Organization
            </Title>
            <Text type="secondary">Update organization information</Text>
          </Col>
        </Row>

        <Divider />

        <Form
          form={form} // make sure form instance is passed
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
        >
          {/* Basic Info */}
          <Card
            type="inner"
            title="Basic Information"
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              label="Organization Name"
              name="name"
              rules={[
                { required: true, message: "Organization name is required" },
              ]}
            >
              <Input
                prefix={<ApartmentOutlined />}
                placeholder="Enter organization name"
              />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={4}
                placeholder="Short description about the organization"
              />
            </Form.Item>
          </Card>

          {/* Ownership */}
          <Card type="inner" title="Ownership">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Current Root User">
                  <Input
                    value={organization.rootFullName}
                    readOnly
                    prefix={<UserOutlined />}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                {selectedUser && (
                  <Form.Item label="Selected New Root User">
                    <Input
                      value={`${selectedUser.firstname} ${selectedUser.lastname}`}
                      readOnly
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>

            <Form.Item
              label="Select New Root User"
              name="rootUser"
              rules={[{ required: true, message: "Please select root user" }]}
            >
              <UserSelect onSelectUser={setSelectedUser} />

            </Form.Item>
          </Card>
        </Form>
      </Card>
    </AppLayout>
  );
}
