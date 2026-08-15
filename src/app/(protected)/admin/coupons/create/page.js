"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, InputNumber, Select, DatePicker } from "antd";
import dayjs from "dayjs";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createCoupon } from "@/services/adminCouponService";
import { getOwnerList } from "@/services/userService";

export default function CouponCreate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  // Fetch owners on component mount
  useEffect(() => {
    const fetchOwners = async () => {
      setLoadingOwners(true);
      try {
        const data = await getOwnerList();
        setOwners(data || []);
      } catch (error) {
        console.error("Failed to load owners", error);
        message.error("Failed to load owners");
      } finally {
        setLoadingOwners(false);
      }
    };
    fetchOwners();
  }, []);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Format dayjs object to YYYY-MM-DD string for Java LocalDate
      const payload = {
        ...values,
        expiryDate: values.expiryDate ? values.expiryDate.format("YYYY-MM-DD") : null,
      };

      const data = await createCoupon(payload);

      message.success("Coupon created successfully");
      router.push(routes.adminCoupons.view(data.id));
    } catch (err) {
      message.error("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  // Disable past dates for the DatePicker
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <AppLayout
      breadcrumb={[
        { title: "Coupons", href: routes.adminCoupons.list },
        { title: "Create" },
      ]}
    >
      <Card
        title="Create New Coupon"
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- CODE ---------------- */}
          <Form.Item
            label="Coupon Code"
            name="code"
            rules={[{ required: true, message: "Please enter coupon code" }]}
          >
            <Input placeholder="Enter coupon code" />
          </Form.Item>

          {/* ---------------- AMOUNT ---------------- */}
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please enter coupon amount" },
              { type: "number", min: 0.01, message: "Amount must be greater than zero" }
            ]}
          >
            <InputNumber 
              placeholder="Enter coupon amount" 
              style={{ width: "100%" }} 
              min={0.01} 
              step={0.01} 
              precision={2} 
            />
          </Form.Item>

          {/* ---------------- EXPIRY DATE ---------------- */}
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: "Please select an expiry date" }]}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              placeholder="Select expiry date"
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          {/* ---------------- STATUS ---------------- */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select coupon status"
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Used", value: "USED" },
                { label: "Expired", value: "EXPIRED" },
              ]}
            />
          </Form.Item>

          {/* ---------------- OWNER ---------------- */}
          <Form.Item
            label="Owner"
            name="ownerId"
            rules={[{ required: true, message: "Please select an owner" }]}
          >
            <Select
              placeholder="Select an owner"
              loading={loadingOwners}
              showSearch
              optionFilterProp="label"
              options={owners.map((owner) => ({
                label: `${owner.firstName || ""} ${owner.lastName || ""} (${owner.email || "No email"})`.trim(),
                value: owner.id,
              }))}
            />
          </Form.Item>

          {/* ---------------- ACTIONS ---------------- */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={() => router.back()}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AppLayout>
  );
}