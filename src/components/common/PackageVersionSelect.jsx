import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getPackageVersionList } from "@/services/organization/packageService";

export default function PackageVersionSelect({
  packageId,
  value,
  onChange,
  onVersionLoaded,
}) {
  const [versions, setVersions] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchVersions = async () => {
    if (!packageId) return;

    try {
      setFetching(true);
      const res = await getPackageVersionList(packageId);
      setVersions(res || []);
      onVersionLoaded?.(res || []);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setVersions([]);
    if (packageId) {
      fetchVersions();
    }
  }, [packageId]);

  return (
    <Select
      allowClear
      placeholder="Select package version"
      disabled={!packageId}
      loading={fetching}
      value={value}
      onChange={(versionId) => {
        const version = versions.find((v) => v.id === versionId);
        onChange?.(versionId, version);
      }}
      notFoundContent={fetching ? <Spin size="small" /> : "No versions"}
      options={versions.map((v) => ({
        label: v.title,
        value: v.id,
      }))}
      style={{ width: "100%" }}
    />
  );
}
