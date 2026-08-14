import { useState } from "react";
import { Select, Spin, message } from "antd";
import { getUserList } from "@/services/userService";

export default function UserSelect({
  value,
  onChange,
  onSelectUser,   // NEW
  style,
  width = "100%",
}) {
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async (username = "", pageNo = 0) => {
    try {
      setFetching(true);
      const res = await getUserList({ username, page: pageNo, size: 10 });
      setUsers(pageNo === 0 ? res.content : [...users, ...res.content]);
      setHasMore(!res.last);
      setPage(pageNo);
    } catch {
      message.error("Failed to load users");
    } finally {
      setFetching(false);
    }
  };

  return (
    <Select
      showSearch
      allowClear
      placeholder="Search user"
      filterOption={false}
      value={value}
      onChange={(userId) => {
        onChange?.(userId);

        if (onSelectUser) {
          const user = users.find((u) => u.id === userId);
          onSelectUser(user || null);
        }
      }}
      onSearch={(v) => {
        setSearchText(v);
        fetchUsers(v, 0);
      }}
      onPopupScroll={(e) => {
        const t = e.target;
        if (t.scrollTop + t.offsetHeight === t.scrollHeight && hasMore && !fetching) {
          fetchUsers(searchText, page + 1);
        }
      }}
      onFocus={() => users.length === 0 && fetchUsers("", 0)}
      notFoundContent={fetching ? <Spin size="small" /> : "No users"}
      options={users.map((u) => ({
        label: `${u.username} — ${u.firstname} ${u.lastname}`,
        value: u.id,
      }))}
      style={{ width, ...style }}
    />
  );
}

