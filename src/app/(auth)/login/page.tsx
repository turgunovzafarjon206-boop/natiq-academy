"use client";
import { useState } from "react";

// Kirish sahifasi — /api/auth/login endpoint'iga yuboradi.
export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) return setError(json.error?.message ?? "Xatolik");
    window.location.href = "/panel.html";
  }

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", fontFamily: "system-ui" }}>
      <form onSubmit={onSubmit} style={{ width: 360, padding: 28, border: "1px solid #E1DCD1", borderRadius: 14 }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Kirish</h1>
        <p style={{ color: "#727C77", fontSize: 13, marginBottom: 18 }}>Natiq Academy hisobingizga kiring</p>
        <label style={{ fontSize: 13, fontWeight: 600 }}>Telefon raqami</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67"
          style={{ width: "100%", padding: 10, margin: "6px 0 14px", borderRadius: 9, border: "1px solid #E1DCD1" }} />
        <label style={{ fontSize: 13, fontWeight: 600 }}>Parol</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "6px 0 14px", borderRadius: 9, border: "1px solid #E1DCD1" }} />
        {error && <p style={{ color: "#C0503F", fontSize: 13 }}>{error}</p>}
        <button disabled={loading}
          style={{ width: "100%", padding: 11, background: "#0E6F63", color: "#fff", border: "none", borderRadius: 9, fontWeight: 600, cursor: "pointer" }}>
          {loading ? "Kutilmoqda…" : "Kirish"}
        </button>
      </form>
    </main>
  );
}
