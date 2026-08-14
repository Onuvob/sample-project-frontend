"use client";

import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getSlotList } from "@/services/branch/slotService";

export default function BranchSlotSelect({
  organizationId,
  branchId,
  reservationDate,
  value,
  onChange,
}) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    if (!organizationId || !branchId || !reservationDate) return;

    setLoading(true);
    try {
      const res = await getSlotList({
        organizationId,
        branchId,
        reservationDate,
        page: 0,
        size: 50,
      });
      setSlots(res.content || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSlots([]);
    if (organizationId && branchId && reservationDate) {
      fetchSlots();
    }
  }, [organizationId, branchId, reservationDate]);

  return (
    <Select
      allowClear
      placeholder="Select time slot"
      value={value}
      disabled={!branchId || !reservationDate}
      loading={loading}
      onChange={onChange}
      notFoundContent={loading ? <Spin size="small" /> : "No slots"}
      options={slots.map((s) => ({
        label: `${s.startTime} – ${s.endTime}`,
        value: s.id,
      }))}
    />
  );
}
