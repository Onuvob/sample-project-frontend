"use client";

import { useEffect, useState } from "react";
import { Modal, Avatar, Typography, Space, Spin, Tag, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUserSummary } from "@/services/userService";

const { Title, Text } = Typography;

export default function UserModal({ userId, visible, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && userId) {
            setLoading(true);
            getUserSummary(userId)
                .then((data) => setUser(data))
                .catch((err) => console.error("Failed to load user", err))
                .finally(() => setLoading(false));
        } else {
            setUser(null);
        }
    }, [visible, userId]);

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            styles={{ body: { padding: 24 } }}
            destroyOnHidden
        >
            {loading ? (
                <div style={{ textAlign: "center", padding: 50 }}>
                    <Spin size="large" />
                </div>
            ) : user ? (
                <Space orientation="vertical" style={{ width: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                        <Avatar
                            size={80}
                            src={user.avatar}
                            icon={!user.avatar && <UserOutlined />}
                            style={{ marginBottom: 16 }}
                        />
                        <Title level={4} style={{ margin: 0 }}>
                            {user.firstName} {user.lastName}
                        </Title>
                    </div>
                    <Divider />
                    <div>
                        <Text strong>Roles:</Text>
                        <div style={{ marginTop: 8 }}>
                            {user.roles && user.roles.length > 0 ? (
                                user.roles.map((role) => (
                                    <Tag key={role} color="blue" style={{ marginBottom: 4 }}>
                                        {role}
                                    </Tag>
                                ))
                            ) : (
                                <Text type="secondary">No roles assigned</Text>
                            )}
                        </div>
                    </div>
                </Space>
            ) : (
                <Text type="secondary">User not found.</Text>
            )}
        </Modal>
    );
}
