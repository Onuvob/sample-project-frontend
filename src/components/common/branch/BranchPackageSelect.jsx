"use client";

import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getPackageList } from "@/services/branch/packageService";

export default function BranchPackageSelect({
  organizationId,
  branchId,
  value,
  onChange,
}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {
    if (!organizationId || !branchId) return;

    setLoading(true);
    try {
      const res = await getPackageList({
        organizationId,
        branchId,
        page: 0,
        size: 20,
      });
      setPackages(res.content || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPackages([]);
    if (organizationId && branchId) {
      fetchPackages();
    }
  }, [organizationId, branchId]);

  return (
    <Select
      allowClear
      placeholder="Optional"
      value={value}
      disabled={!branchId}
      loading={loading}
      onChange={(pkgId) => {
        const pkg = packages.find((p) => p.id === pkgId);
        onChange?.(pkgId, pkg);
      }}
      notFoundContent={loading ? <Spin size="small" /> : "No packages"}
      options={packages.map((p) => ({
        label: `${p.orgPackageName} — ${p.orgPackageVersionName}`,
        value: p.id,
      }))}
    />
  );
}
