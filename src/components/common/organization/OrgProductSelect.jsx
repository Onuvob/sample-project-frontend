"use client";

import { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import { getProductList } from "@/services/organization/productService";

/**
 * OrgProductSelect
 *
 * Props:
 * - organizationId (required)
 * - value          -> number | number[]
 * - onChange       -> (value, product | product[]) => void
 * - disabledIds    -> number[]        (disable specific products)
 * - disabled       -> boolean         (disable whole select)
 * - mode           -> "multiple" | undefined (default: single)
 */
export default function OrgProductSelect({
    organizationId,
    value,
    onChange,
    disabledIds = [],
    disabled = false,
    mode, // undefined | "multiple"
}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (search = "") => {
        if (!organizationId) return;

        setLoading(true);
        try {
            const data = await getProductList({
                organizationId,
                name: search,
                size: 10,
                isActive: true,
            });

            setProducts(data?.content || []);
        } catch {
            message.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    /* Reload when organization changes */
    useEffect(() => {
        setProducts([]);
        if (organizationId) {
            fetchProducts();
        }
    }, [organizationId]);

    const handleChange = (selected) => {
        // ---- CLEAR ----
        if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            onChange?.(
                mode === "multiple" ? [] : null,
                mode === "multiple" ? [] : null
            );
            return;
        }

        // ---- MULTIPLE ----
        if (mode === "multiple") {
            const selectedProducts = selected
                .map((id) => products.find((p) => p.id === id))
                .filter(Boolean);

            onChange?.(selected, selectedProducts);
            return;
        }

        // ---- SINGLE ----
        const product = products.find((p) => p.id === selected);
        onChange?.(selected, product);
    };

    return (
        <Select
            showSearch
            allowClear
            mode={mode}
            placeholder="Search product by name"
            value={value ?? (mode === "multiple" ? [] : null)}
            disabled={disabled || !organizationId}
            loading={loading}
            filterOption={false}
            onSearch={fetchProducts}
            onChange={handleChange}
            notFoundContent={loading ? <Spin size="small" /> : undefined}
            options={products.map((product) => ({
                label: `${product.productName}${product.sku ? ` (${product.sku})` : ""}`,
                value: product.id,
                disabled: disabledIds.includes(product.id),
            }))}
            style={{ width: "100%" }}
        />
    );
}
