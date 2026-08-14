import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getOrganizationSummaryList } from "@/services/organizationService";

export default function OrganizationSelect({ value, onChange }) {
  const [organizations, setOrganizations] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrganizations = async (name = "", pageNo = 0) => {
    try {
      setFetching(true);
      const res = await getOrganizationSummaryList({ name, page: pageNo, size: 10 });
      setOrganizations(pageNo === 0 ? res.content : [...organizations, ...res.content]);
      setHasMore(!res.last);
      setPage(pageNo);
    } catch {
      // handle error
    } finally {
      setFetching(false);
    }
  };

  return (
    <Select
      showSearch
      placeholder="Select organization"
      filterOption={false}
      allowClear
      value={value}
      onChange={onChange}
      onSearch={(v) => {
        setSearchText(v);
        fetchOrganizations(v, 0);
      }}
      onPopupScroll={(e) => {
        const t = e.target;
        if (t.scrollTop + t.offsetHeight === t.scrollHeight && hasMore && !fetching) {
          fetchOrganizations(searchText, page + 1);
        }
      }}
      onFocus={() => organizations.length === 0 && fetchOrganizations("", 0)}
      notFoundContent={fetching ? <Spin size="small" /> : "No organizations"}
      options={organizations.map((o) => ({ label: o.name, value: o.id }))}
      style={{ width: "100%" }}
    />
  );
}
