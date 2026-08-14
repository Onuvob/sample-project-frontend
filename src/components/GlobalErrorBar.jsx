"use client";

import { useEffect, useState } from "react";
import { errorStore } from "@/store/globalErrorStore";

export default function GlobalErrorBar() {
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const unsubscribe = errorStore.subscribe((msg) => {
            if (msg) {
                // Add new error to list
                setErrors((prev) => [...prev, msg]);

                // Auto remove after 5 seconds
                setTimeout(() => {
                    setErrors((prev) => prev.filter((e) => e !== msg));
                }, 5000);
            }
        });
        return unsubscribe;
    }, []);

    if (errors.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 20,
                right: 20,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            {errors.map((error, index) => (
                <div
                    key={index}
                    style={{
                        minWidth: "250px",
                        background: "#fff1f0",
                        color: "#a8071a",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        animation: "slideIn 0.3s ease-out",
                    }}
                >
                    <span>{error}</span>
                    <button
                        onClick={() =>
                            setErrors((prev) => prev.filter((_, i) => i !== index))
                        }
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginLeft: "10px",
                        }}
                    >
                        ✕
                    </button>
                </div>
            ))}

            {/* Animation Keyframes */}
            <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
