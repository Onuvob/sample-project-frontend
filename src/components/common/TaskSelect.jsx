"use client";

import { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import { getTaskList } from "@/services/taskService";

/**
 * Reusable Task Select Component
 *
 * Props:
 * - value
 * - onChange(taskId, taskObject)
 * - disabled
 */
export default function TaskSelect({
    value,
    onChange,
    disabled = false,
}) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async (searchName = "") => {
        setLoading(true);
        try {
            const data = await getTaskList({ name: searchName });
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

    const handleChange = (taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        onChange?.(taskId, task);
    };

    return (
        <Select
            showSearch
            allowClear
            placeholder="Search task by name"
            value={value}
            disabled={disabled}
            loading={loading}
            filterOption={false}
            onSearch={fetchTasks}
            onChange={handleChange}
            notFoundContent={loading ? <Spin size="small" /> : null}
            options={tasks.map((task) => ({
                label: task.name,
                value: task.id,
            }))}
        />
    );
}
