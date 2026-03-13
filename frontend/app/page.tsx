"use client";

import { useState, useEffect } from "react";

export default function LandingPage() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const availableDates = [15, 16, 20, 21, 22, 23, 27, 28, 29, 30];
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState("15m");
  const [highlightedDate, setHighlightedDate] = useState<number | null>(null);
  const durations = ["15m", "30m", "45m", "1h"];
  const startDayOffset = 4;
  const totalDays = 31;


  useEffect(() => {
    let idx = 0;
    const cycle = () => {
      setHighlightedDate(availableDates[idx % availableDates.length]);
      idx++;
    };
    cycle();
    const interval = setInterval(cycle, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Nav */}
      <nav style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 40px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>Calix</span>
        <div style={{ display: "flex", gap: 32 }}>
          {["Home", "People", "Events", "Dashboard", "Bookings"].map((item) => (
            <a key={item} href="#" style={{ fontSize: 14, color: "#374151", textDecoration: "none", fontWeight: 500 }}>{item}</a>
          ))}
        </div>
        <button type="button" style={{ backgroundColor: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Get started
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 680px",
        gap: 0,
        padding: "64px 80px",
        alignItems: "center",
        minHeight: "calc(100vh - 56px)",
      }}>
        {/* Left: text */}
        <div style={{ paddingRight: 60 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            border: "1px solid #e5e7eb", borderRadius: 100,
            padding: "5px 12px", fontSize: 13, color: "#374151",
            marginBottom: 32, cursor: "pointer",
          }}>
            Calix launches v6.2
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </div>

          <h1 style={{
            fontSize: "clamp(42px, 5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.08,
            color: "#0a0a0a",
            marginBottom: 24,
            letterSpacing: "-0.03em",
          }}>
            The better way to schedule your meetings
          </h1>

          <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.65, marginBottom: 36, maxWidth: 520 }}>
            A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
            <button type="button" style={{
              backgroundColor: "#111827", color: "#fff", border: "none",
              borderRadius: 10, padding: "14px 24px", fontWeight: 600,
              fontSize: 15, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

            <button type="button" style={{
              backgroundColor: "#f9fafb", color: "#111827",
              border: "1px solid #e5e7eb", borderRadius: 10,
              padding: "14px 24px", fontWeight: 500, fontSize: 15, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              Sign up with email
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            <span style={{ fontSize: 12.5, color: "#9ca3af", textAlign: "center" }}>No credit card required</span>
          </div>

          {/* Ratings */}
          <div style={{ display: "flex", gap: 32, marginTop: 40, alignItems: "center" }}>
            {[
              { color: "#00b67a", label: "Trustpilot", icon: "T", half: true },
              { color: "#f59e0b", label: "Product Hunt", icon: "P", iconBg: "#da552f", half: false },
              { color: "#ff492c", label: "G2", icon: "G", iconBg: "#ff492c", half: true, missing: 1 },
            ].map(({ color, label, icon, iconBg, half, missing }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const isMissing = missing && i === 5;
                    const isHalf = half && i === 5 && !isMissing;
                    return (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={isMissing ? "#e5e7eb" : color}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    );
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {iconBg ? (
                    <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>{icon}</span>
                    </div>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  )}
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "260px 1px 1fr",
        }}>
          {/* Event info */}
          <div style={{ padding: "28px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#d1d5db", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#6b7280" }}>Cédric van Ravesteijn</span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 10, lineHeight: 1.3 }}>
              Partnerships Meeting
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.6, marginBottom: 22 }}>
              Are you an agency, influencer, SaaS founder, or business looking to collaborate with Cal.com? Let&apos;s chat!
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <div style={{ display: "flex", gap: 4 }}>
                  {durations.map((dur) => (
                    <button key={dur} type="button" onClick={() => setSelectedDuration(dur)} style={{
                      padding: "3px 8px", borderRadius: 6, border: "1px solid #e5e7eb",
                      background: selectedDuration === dur ? "#f3f4f6" : "#fff",
                      fontSize: 11, fontWeight: selectedDuration === dur ? 600 : 400,
                      cursor: "pointer", color: selectedDuration === dur ? "#111827" : "#9ca3af",
                    }}>
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" /><polyline points="17 2 12 7 7 2" /></svg>
                <span style={{ fontSize: 12.5, color: "#374151" }}>Cal Video</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <span style={{ fontSize: 12.5, color: "#374151" }}>Europe/Amsterdam</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ backgroundColor: "#e5e7eb" }} />

          {/* Calendar */}
          <div style={{ padding: "28px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                May <span style={{ color: "#6b7280", fontWeight: 400 }}>2025</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["left", "right"].map((dir) => (
                  <button key={dir} type="button" style={{
                    width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb",
                    background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
              {days.map((d) => (
                <div key={d} style={{ textAlign: "center", fontSize: 9.5, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.04em", padding: "2px 0" }}>{d}</div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
              {Array.from({ length: startDayOffset }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const isAvailable = availableDates.includes(day);
                const isSelected = day === selectedDate;
                const isAnimating = day === highlightedDate && !selectedDate;

                return (
                  <button
                    type="button"
                    key={day}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && setSelectedDate(isSelected ? null : day)}
                    style={{
                      height: 34,
                      borderRadius: 8,
                      border: isSelected ? "2px solid #111827" : isAvailable ? "1px solid #e5e7eb" : "1px solid transparent",
                      backgroundColor: isSelected ? "#111827" : isAnimating ? "#e5e7eb" : isAvailable ? "#f9fafb" : "transparent",
                      color: isSelected ? "#fff" : isAvailable ? "#111827" : "#d1d5db",
                      fontSize: 13,
                      fontWeight: isAvailable ? 500 : 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isAvailable ? "pointer" : "default",
                      transition: "background-color 0.5s ease, border-color 0.4s ease, color 0.3s ease",
                      position: "relative",
                    }}
                  >
                    {day}
                    {day === 15 && (
                      <span style={{
                        position: "absolute", bottom: 3, left: "50%",
                        transform: "translateX(-50%)",
                        width: 3, height: 3, borderRadius: "50%",
                        backgroundColor: isSelected ? "#fff" : "#111827",
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}