"use client";

import { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import { getProductList } from "@/services/productService";

/**
 * Reusable Product Select Component
 *
 * Props:
 * - value
 * - onChange(productId, productObject)
 * - disabled
 */
export default function ProductSelect({
    value,
    onChange,
    disabled = false,
}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (searchName = "") => {
        setLoading(true);
        try {
            const data = await getProductList({ name: searchName });
            setProducts(data?.content || []);
        } catch (error) {
            message.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (productId) => {
        const product = products.find((p) => p.id === productId);
        onChange?.(productId, product);
    };

    return (
        <Select
            showSearch
            allowClear
            placeholder="Search product by name"
            value={value}
            disabled={disabled}
            loading={loading}
            filterOption={false}
            onSearch={fetchProducts}
            onChange={handleChange}
            notFoundContent={loading ? <Spin size="small" /> : null}
            options={products.map((product) => ({
                label: product.name,
                value: product.id,
            }))}
        />
    );
}
