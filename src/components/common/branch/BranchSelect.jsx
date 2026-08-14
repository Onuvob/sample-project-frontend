import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getBranchSummaryList } from "@/services/branchService";

export default function BranchSelect({
    organizationId,
    value,
    onChange,
    onBranchLoaded, // optional callback
}) {
    const [branches, setBranches] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchBranches = async (name = "", pageNo = 0) => {
        if (!organizationId) return;

        try {
            setFetching(true);

            const res = await getBranchSummaryList({
                organizationId,
                name, // ✅ SEARCH PARAM
                timeSlotEnabled: true,
                page: pageNo,
                size: 10,
            });

            const list =
                pageNo === 0 ? res.content : [...branches, ...res.content];

            setBranches(list);
            setHasMore(!res.last);
            setPage(pageNo);

            onBranchLoaded?.(list);
        } catch {
            // optional: message.error("Failed to load branches");
        } finally {
            setFetching(false);
        }
    };

    /* Reload when organization changes */
    useEffect(() => {
        setBranches([]);
        setSearchText("");
        setPage(0);
        setHasMore(true);

        if (organizationId) {
            fetchBranches("", 0);
        }
    }, [organizationId]);

    return (
        <Select
            showSearch
            allowClear
            placeholder="Select branch"
            disabled={!organizationId}
            value={value}
            filterOption={false} // ✅ REQUIRED for server search
            onChange={(branchId) => {
                const branch = branches.find((b) => b.id === branchId);
                onChange?.(branchId, branch);
            }}
            onSearch={(value) => {
                setSearchText(value);
                fetchBranches(value, 0); // ✅ SEARCH TRIGGER
            }}
            onPopupScroll={(e) => {
                const t = e.target;
                if (
                    t.scrollTop + t.offsetHeight === t.scrollHeight &&
                    hasMore &&
                    !fetching
                ) {
                    fetchBranches(searchText, page + 1);
                }
            }}
            onFocus={() => {
                if (branches.length === 0 && organizationId) {
                    fetchBranches("", 0);
                }
            }}
            notFoundContent={fetching ? <Spin size="small" /> : "No branches"}
            options={branches.map((b) => ({
                label: b.name,
                value: b.id,
            }))}
            style={{ width: "100%" }}
        />
    );
}
