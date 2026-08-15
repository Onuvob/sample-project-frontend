"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Select } from "antd";

import AppLayout from "@/components/AppLayout";
import { routes } from "@/routes";
import { createBooking } from "@/services/ownerBookingService";
import { getRouteList } from "@/services/routeService";
import { getOwnerVehicleList } from "@/services/ownerVehicleService";

export default function BookingCreate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  
  const [routesData, setRoutesData] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  // Fetch Vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        // Fetching a large page size to get all vehicles for the dropdown
        const response = await getOwnerVehicleList({ page: 0, size: 1000 });
        setVehicles(response?.data || response || []);
      } catch (error) {
        console.error("Failed to load vehicles", error);
        message.error("Failed to load vehicles");
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  // Fetch Routes on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoadingRoutes(true);
      try {
        // Fetching a large page size to get all routes for the dropdown
        const response = await getRouteList({ page: 0, size: 1000 });
        setRoutesData(response?.data || response || []);
      } catch (error) {
        console.error("Failed to load routes", error);
        message.error("Failed to load routes");
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchRoutes();
  }, []);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        vehicleId: values.vehicleId,
        routeId: values.routeId,
        couponCode: values.couponCode,
      };

      const data = await createBooking(payload);

      message.success("Booking created successfully");
      router.push(routes.bookings.view(data.id));
    } catch (err) {
      message.error("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      breadcrumb={[
        { title: "Bookings", href: routes.bookings.list },
        { title: "Create" },
      ]}
    >
      <Card
        title="Create New Booking"
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- VEHICLE ---------------- */}
          <Form.Item
            label="Vehicle"
            name="vehicleId"
            rules={[{ required: true, message: "Please select a vehicle" }]}
          >
            <Select
              placeholder="Select a vehicle"
              loading={loadingVehicles}
              showSearch
              optionFilterProp="label"
              options={vehicles.map((v) => ({
                label: `${v.name} (${v.registrationNumber}) - ${v.type || 'N/A'}`,
                value: v.id,
              }))}
            />
          </Form.Item>

          {/* ---------------- ROUTE ---------------- */}
          <Form.Item
            label="Route"
            name="routeId"
            rules={[{ required: true, message: "Please select a route" }]}
          >
            <Select
              placeholder="Select a route"
              loading={loadingRoutes}
              showSearch
              optionFilterProp="label"
              options={routesData.map((r) => ({
                label: `${r.source} to ${r.destination}`,
                value: r.id,
              }))}
            />
          </Form.Item>

          {/* ---------------- COUPON CODE ---------------- */}
          <Form.Item
            label="Coupon Code"
            name="couponCode"
            rules={[{ required: true, message: "Please enter coupon code" }]}
          >
            <Input placeholder="Enter coupon code" />
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