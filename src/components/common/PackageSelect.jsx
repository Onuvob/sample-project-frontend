import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getPackageSummaryList } from "@/services/organization/packageService";

export default function PackageSelect({
  organizationId,
  value,
  onChange,
}) {
  const [packages, setPackages] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPackages = async (pageNo = 0) => {
    if (!organizationId) return;

    try {
      setFetching(true);
      const res = await getPackageSummaryList({
        organizationId,
        page: pageNo,
        size: 10,
      });

      const list =
        pageNo === 0 ? res.content : [...packages, ...res.content];

      setPackages(list);
      setHasMore(!res.last);
      setPage(pageNo);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setPackages([]);
    setPage(0);
    setHasMore(true);

    if (organizationId) {
      fetchPackages(0);
    }
  }, [organizationId]);

  return (
    <Select
      showSearch
      allowClear
      placeholder="Select package"
      disabled={!organizationId}
      value={value}
      filterOption={false}
      onChange={onChange}
      onPopupScroll={(e) => {
        const t = e.target;
        if (
          t.scrollTop + t.offsetHeight === t.scrollHeight &&
          hasMore &&
          !fetching
        ) {
          fetchPackages(page + 1);
        }
      }}
      onFocus={() => {
        if (packages.length === 0 && organizationId) {
          fetchPackages(0);
        }
      }}
      notFoundContent={fetching ? <Spin size="small" /> : "No packages"}
      options={packages.map((p) => ({
        label: p.title,
        value: p.id,
      }))}
      style={{ width: "100%" }}
    />
  );
}
