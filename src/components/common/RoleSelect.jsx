import { useState } from "react";
import { Select, Spin, message } from "antd";
import { getRoleList } from "@/services/authorizationService";

export default function RoleSelect({ value, onChange, width }) {
  const [roles, setRoles] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchRoles = async (name = "", pageNo = 0) => {
    try {
      setFetching(true);
      const res = await getRoleList({ name, page: pageNo, size: 10 });
      setRoles(pageNo === 0 ? res.content : [...roles, ...res.content]);
      setHasMore(!res.last);
      setPage(pageNo);
    } catch {
      message.error("Failed to load roles");
    } finally {
      setFetching(false);
    }
  };

  return (
    <Select
      showSearch
      allowClear
      placeholder="Search role"
      filterOption={false}
      value={value}
      onChange={onChange}
      onSearch={(v) => {
        setSearchText(v);
        fetchRoles(v, 0);
      }}
      onPopupScroll={(e) => {
        const t = e.target;
        if (t.scrollTop + t.offsetHeight === t.scrollHeight && hasMore && !fetching) {
          fetchRoles(searchText, page + 1);
        }
      }}
      onFocus={() => roles.length === 0 && fetchRoles("", 0)}
      notFoundContent={fetching ? <Spin size="small" /> : "No roles"}
      options={roles.map((r) => ({ label: r.name, value: r.id }))}
      style={{ width: width }}
    />
  );
}
