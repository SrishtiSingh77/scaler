"use client";

import { useState, useEffect } from "react";
import BenefitsSection from "@/components/BenefitsSection";

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
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1240,
            padding: "48px 32px 40px",
          }}
        >
          {/* Main card */}
          <main>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 24,
                boxShadow: "0 24px 55px rgba(15,23,42,0.16)",
                padding: "40px 40px 44px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.25fr)",
                  columnGap: 40,
                  alignItems: "stretch",
                }}
              >
                {/* Left: text */}
                <div style={{ paddingRight: 20, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      border: "1px solid #e5e7eb",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 13,
                      color: "#374151",
                      marginBottom: 28,
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    {/* Calix launches v6.2 */}
                    {/* <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg> */}
                  </div>

                  <h1
                    style={{
                      fontSize: "clamp(32px, 3.2vw, 44px)",
                      fontWeight: 800,
                      lineHeight: 1.15,
                      color: "#0a0a0a",
                      marginBottom: 14,
                      letterSpacing: "-0.03em",
                      maxWidth: 420,
                    }}
                  >
                    The better way to schedule your meetings
                  </h1>

                  <p
                    style={{
                      fontSize: 14,
                      color: "#6b7280",
                      lineHeight: 1.6,
                      marginBottom: 28,
                      maxWidth: 420,
                    }}
                  >
                    A fully customizable scheduling software for individuals, businesses
                    taking calls and developers building scheduling platforms where users
                    meet users.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
                    <button
                      type="button"
                      style={{
                        backgroundColor: "#111827",
                        color: "#fff",
                        border: "none",
                        borderRadius: 999,
                        padding: "12px 22px",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Ratings */}
                  <div
                    style={{
                      display: "flex",
                      gap: 32,
                      marginTop: 36,
                      alignItems: "center",
                    }}
                  >
                    {[
                      { color: "#00b67a", label: "Trustpilot", icon: "T", half: true },
                      {
                        color: "#f59e0b",
                        label: "Product Hunt",
                        icon: "P",
                        iconBg: "#da552f",
                        half: false,
                      },
                      {
                        color: "#ff492c",
                        label: "G2",
                        icon: "G",
                        iconBg: "#ff492c",
                        half: true,
                        missing: 1,
                      },
                    ].map(({ color, label, icon, iconBg, half, missing }) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1, 2, 3, 4, 5].map((i) => {
                            const isMissing = missing && i === 5;
                            const isHalf = half && i === 5 && !isMissing;
                            return (
                              <svg
                                key={i}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={isMissing ? "#e5e7eb" : color}
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            );
                          })}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {iconBg ? (
                            <div
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                backgroundColor: iconBg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>
                                {icon}
                              </span>
                            </div>
                          ) : (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6b7280"
                              strokeWidth="2"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          )}
                          <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Booking card */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "260px 1px 1fr",
                  }}
                >
                  {/* Event info */}
                  <div style={{ padding: "28px 24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          backgroundColor: "#d1d5db",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 12, color: "#6b7280" }}>
                        Cédric van Ravesteijn
                      </span>
                    </div>
                    <h2
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: 10,
                        lineHeight: 1.3,
                      }}
                    >
                      Partnerships Meeting
                    </h2>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "#6b7280",
                        lineHeight: 1.6,
                        marginBottom: 22,
                      }}
                    >
                      Are you an agency, influencer, SaaS founder, or business looking to
                      collaborate with Calix? Let&apos;s chat!
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6b7280"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <div style={{ display: "flex", gap: 4 }}>
                          {durations.map((dur) => (
                            <button
                              key={dur}
                              type="button"
                              onClick={() => setSelectedDuration(dur)}
                              style={{
                                padding: "3px 8px",
                                borderRadius: 6,
                                border: "1px solid #e5e7eb",
                                background:
                                  selectedDuration === dur ? "#f3f4f6" : "#fff",
                                fontSize: 11,
                                fontWeight: selectedDuration === dur ? 600 : 400,
                                cursor: "pointer",
                                color:
                                  selectedDuration === dur ? "#111827" : "#9ca3af",
                              }}
                            >
                              {dur}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6b7280"
                          strokeWidth="2"
                        >
                          <rect x="2" y="7" width="20" height="15" rx="2" />
                          <polyline points="17 2 12 7 7 2" />
                        </svg>
                        <span style={{ fontSize: 12.5, color: "#374151" }}>
                          Cal Video
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6b7280"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span style={{ fontSize: 12.5, color: "#374151" }}>
                          Europe/Amsterdam
                        </span>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9ca3af"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ backgroundColor: "#e5e7eb" }} />

                  {/* Calendar */}
                  <div style={{ padding: "28px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 18,
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                        May{" "}
                        <span style={{ color: "#6b7280", fontWeight: 400 }}>2025</span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {["left", "right"].map((dir) => (
                          <button
                            key={dir}
                            type="button"
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              border: "1px solid #e5e7eb",
                              background: "#fff",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6b7280"
                              strokeWidth="2"
                            >
                              {dir === "left" ? (
                                <polyline points="15 18 9 12 15 6" />
                              ) : (
                                <polyline points="9 18 15 12 9 6" />
                              )}
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        marginBottom: 4,
                      }}
                    >
                      {days.map((d) => (
                        <div
                          key={d}
                          style={{
                            textAlign: "center",
                            fontSize: 9.5,
                            fontWeight: 600,
                            color: "#9ca3af",
                            letterSpacing: "0.04em",
                            padding: "2px 0",
                          }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: 3,
                      }}
                    >
                      {Array.from({ length: startDayOffset }).map((_, i) => (
                        <div key={`e-${i}`} />
                      ))}
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
                            onClick={() =>
                              isAvailable && setSelectedDate(isSelected ? null : day)
                            }
                            style={{
                              height: 34,
                              borderRadius: 8,
                              border: isSelected
                                ? "2px solid #111827"
                                : isAvailable
                                  ? "1px solid #e5e7eb"
                                  : "1px solid transparent",
                              backgroundColor: isSelected
                                ? "#111827"
                                : isAnimating
                                  ? "#e5e7eb"
                                  : isAvailable
                                    ? "#f9fafb"
                                    : "transparent",
                              color: isSelected
                                ? "#fff"
                                : isAvailable
                                  ? "#111827"
                                  : "#d1d5db",
                              fontSize: 13,
                              fontWeight: isAvailable ? 500 : 400,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: isAvailable ? "pointer" : "default",
                              transition:
                                "background-color 0.5s ease, border-color 0.4s ease, color 0.3s ease",
                              position: "relative",
                            }}
                          >
                            {day}
                            {day === 15 && (
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: 3,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  width: 3,
                                  height: 3,
                                  borderRadius: "50%",
                                  backgroundColor: isSelected ? "#fff" : "#111827",
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>

      <section className="mb-6 bg-[#f5f5f4] py-10">
        <div className="max-w-5xl mx-auto px-4">
          {/* Badge */}
          <div className="flex justify-center">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm ring-1 ring-gray-200"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-gray-800" />
              How it works
            </button>
          </div>

          {/* Heading */}
          <div className="mt-3 text-center">
            <h2 className="text-[1.9rem] md:text-[2.4rem] font-extrabold tracking-tight text-gray-900 leading-tight">
              With us, appointment scheduling is easy
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-500 leading-relaxed">
              Effortless scheduling for business and individuals, powerful solutions for
              fast-growing modern companies.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg黑 transition-colors"
            >
              Get started <span className="ml-1 text-lg leading-none">→</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-7 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Book a demo <span className="ml-1 text-lg leading-none">→</span>
            </button>
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {/* Card 1 – Connect your calendar */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-wide text-gray-400 mb-3">
                01
              </span>
              <h3 className="text-sm font-bold text-gray-900">Connect your calendar</h3>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed mb-4">
                We&apos;ll handle all the cross-referencing, so you don&apos;t have to worry about double bookings.
              </p>
              {/* Calendar illustration */}
              <div className="rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center py-6">
                <div className="relative w-24 h-24">
                  {/* Outer ring */}
                  <div className="w-24 h-24 rounded-full border border-gray-200 bg-white flex items-center justify-center text-xs font-bold text-gray-900">
                    Calix
                  </div>
                  {/* Google Calendar icon – top right */}
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect width="16" height="16" rx="3" fill="#4285F4" />
                      <rect x="2.5" y="2.5" width="4" height="4" rx="1" fill="white" />
                      <rect x="9.5" y="2.5" width="4" height="4" rx="1" fill="#34A853" />
                      <rect x="2.5" y="9.5" width="4" height="4" rx="1" fill="#FBBC04" />
                      <rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="#EA4335" />
                    </svg>
                  </div>
                  {/* Outlook icon – bottom left */}
                  <div className="absolute bottom-3 -left-4 w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect width="16" height="16" rx="3" fill="#1D72B8" />
                      <text x="8" y="12" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">
                        O
                      </text>
                    </svg>
                  </div>
                  {/* Calendar date icon – bottom right */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect width="16" height="16" rx="3" fill="#E8423F" />
                      <text x="8" y="12" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
                        17
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 – Set your availability */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-wide text-gray-400 mb-3">
                02
              </span>
              <h3 className="text-sm font-bold text-gray-900">Set your availability</h3>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed mb-4">
                Want to block off weekends? Set up any buffers? We make that easy.
              </p>
              {/* Availability illustration */}
              <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-0">
                {[
                  { day: "Mon", start: "8:30 am", end: "5:00 pm" },
                  { day: "Tue", start: "9:00 am", end: "6:30 pm" },
                  { day: "Wed", start: "10:00 am", end: "7:00 pm" },
                ].map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0 text-[11px] text-gray-600"
                  >
                    {/* Toggle */}
                    <div className="w-7 h-4 rounded-full bg-gray-200 flex-shrink-0 relative">
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white border border-gray-300" />
                    </div>
                    <span className="w-6 font-semibold text-gray-400">{row.day}</span>
                    <span>{row.start}</span>
                    <span className="text-gray-300">—</span>
                    <span>{row.end}</span>
                    <span className="ml-auto text-gray-300 text-xs">+</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 – Choose how to meet */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-wide text-gray-400 mb-3">
                03
              </span>
              <h3 className="text-sm font-bold text-gray-900">Choose how to meet</h3>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed mb-4">
                It could be a video chat, phone call, or a walk in the park!
              </p>
              {/* Video call illustration */}
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                {/* Browser bar */}
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
                  ))}
                </div>
                {/* Video grid */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-200 rounded-xl h-14 flex items-center justify-center"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-gray-400" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-3 rounded-t-full bg-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Toolbar */}
                <div className="bg-white rounded-xl px-2 py-2 flex items-center justify-center gap-2">
                  {[
                    <rect key="cam" width="12" height="8" rx="2" x="2" y="4" fill="#9ca3af" />,
                    <circle
                      key="mic"
                      cx="8"
                      cy="8"
                      r="4"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                    />,
                    <circle key="chat" cx="8" cy="8" r="5" fill="#9ca3af" />,
                    <rect
                      key="screen"
                      width="14"
                      height="10"
                      rx="2"
                      x="1"
                      y="3"
                      fill="#9ca3af"
                    />,
                    <rect
                      key="more"
                      width="14"
                      height="5"
                      rx="1"
                      x="1"
                      y="5.5"
                      fill="#9ca3af"
                    />,
                  ].map((icon, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        {icon}
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <BenefitsSection />
          {/* Logo strip */}
        </div>
      </section>
    </>
  );
}