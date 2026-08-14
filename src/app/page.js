"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>Pilot Booking System</div>

        <button
          style={styles.loginButton}
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Pilot Booking & Coupon Payment Management
        </h1>

        <p style={styles.heroSubtitle}>
          A complete platform for managing vehicle service bookings, route
          management, coupon-based payments, and pilot assignments securely and
          efficiently.
        </p>

        <div style={styles.heroActions}>
          <button
            style={styles.primaryButton}
            onClick={() => router.push("/login")}
          >
            Get Started
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div style={styles.featureCard}>
          <h3>Service Booking</h3>
          <p>
            Create service bookings by selecting an approved vehicle and an
            available route.
          </p>
        </div>

        <div style={styles.featureCard}>
          <h3>Coupon Payment</h3>
          <p>
            Pay route service fees securely using valid coupons with automatic
            verification.
          </p>
        </div>

        <div style={styles.featureCard}>
          <h3>Pilot Assignment</h3>
          <p>
            Administrators approve bookings and assign available pilots to
            complete the requested service.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Pilot Booking & Coupon Payment Management
        System. All rights reserved.
      </footer>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  wrapper: {
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "#ffffff",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 60px",
  },

  logo: {
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  loginButton: {
    padding: "10px 22px",
    background: "transparent",
    border: "1px solid #38bdf8",
    color: "#38bdf8",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },

  hero: {
    textAlign: "center",
    padding: "120px 20px 100px",
    maxWidth: "900px",
    margin: "0 auto",
  },

  heroTitle: {
    fontSize: "52px",
    fontWeight: "800",
    marginBottom: "20px",
    lineHeight: "1.2",
  },

  heroSubtitle: {
    fontSize: "18px",
    color: "#cbd5f5",
    marginBottom: "40px",
  },

  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },

  primaryButton: {
    padding: "14px 32px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#020617",
  },

  secondaryButton: {
    padding: "14px 32px",
    background: "transparent",
    border: "1px solid #475569",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#e5e7eb",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    padding: "80px 60px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  featureCard: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
  },

  footer: {
    textAlign: "center",
    padding: "30px",
    color: "#94a3b8",
    fontSize: "14px",
  },
};
