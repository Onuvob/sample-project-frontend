"use client";

import { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import { getTaskList } from "@/services/organization/taskService";

/**
 * OrgTaskSelect
 *
 * Props:
 * - value        -> number | number[]
 * - onChange     -> (value, task | task[]) => void
 * - disabledIds  -> number[]
 * - disabled     -> boolean
 * - mode         -> "multiple" | undefined (default: single)
 */
export default function OrgTaskSelect({
  value,
  onChange,
  disabledIds = [],
  disabled = false,
  mode, // undefined | "multiple"
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (search = "") => {
    setLoading(true);
    try {
      const data = await getTaskList({ name: search, size: 10 });
      setTasks(data?.content || []);
    } catch {
      message.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (selected) => {
    // ---- CLEAR ----
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      onChange?.(mode === "multiple" ? [] : null, mode === "multiple" ? [] : null);
      return;
    }

    // ---- MULTIPLE ----
    if (mode === "multiple") {
      const selectedTasks = selected
        .map((id) => tasks.find((t) => t.id === id))
        .filter(Boolean);

      onChange?.(selected, selectedTasks);
      return;
    }

    // ---- SINGLE ----
    const task = tasks.find((t) => t.id === selected);
    onChange?.(selected, task);
  };

  return (
    <Select
      showSearch
      allowClear
      mode={mode}
      placeholder="Search task by name"
      value={value ?? (mode === "multiple" ? [] : null)}
      disabled={disabled}
      loading={loading}
      filterOption={false}
      onSearch={fetchTasks}
      onChange={handleChange}
      notFoundContent={loading ? <Spin size="small" /> : undefined}
      options={tasks.map((task) => ({
        label: task.name,
        value: task.id,
        disabled: disabledIds.includes(task.id),
      }))}
      style={{ width: "100%" }}
    />
  );
}
