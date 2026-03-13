export default function BenefitsSection() {
    return (
        <section className="bg-[#F2F2F0] py-20 px-4">
            <div className="max-w-[880px] mx-auto">

                {/* ── Header ── */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-widest uppercase text-gray-500 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900 inline-block" />
                        Benefits
                    </span>
                    <h2 className="text-[2.4rem] md:text-[3rem] font-black tracking-[-0.04em] text-gray-950 leading-[1.08] mb-4">
                        Your all-purpose<br className="hidden md:block" /> scheduling app
                    </h2>
                    <p className="text-[15px] text-gray-500 max-w-sm mx-auto leading-[1.7]">
                        Discover advanced features — unlimited and free for individuals.
                    </p>
                    <div className="mt-7 flex items-center justify-center gap-2.5 flex-wrap">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-950 px-6 py-2.5 text-[13px] font-bold text-white tracking-tight hover:bg-black transition-all shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                        >
                            Get started <span className="opacity-70">→</span>
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                        >
                            Book a demo <span className="opacity-50">→</span>
                        </button>
                    </div>
                </div>

                {/* ── 2×2 Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    {/* ── Card 1: Meeting overload ── */}
                    <div className="group bg-white rounded-[20px] border border-gray-200/80 p-7 overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                        <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Availability</span>
                        <h3 className="text-[17px] font-black tracking-tight text-gray-950 mb-2 leading-snug">Avoid meeting overload</h3>
                        <p className="text-[13px] text-gray-500 leading-[1.65] mb-6">
                            Only get booked when you want to. Set daily, weekly or monthly limits
                            and add buffers around your events.
                        </p>
                        {/* Mockup */}
                        <div className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-4">
                            <p className="text-[13px] font-bold text-gray-900 mb-4">Notice and buffers</p>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Minimum notice</p>
                                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px]">
                                        <span className="text-gray-800 font-medium">2 days</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[["Buffer before event", "0 mins"], ["Buffer after event", "30 mins"]].map(([label, val]) => (
                                        <div key={label}>
                                            <p className="text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest leading-tight">{label}</p>
                                            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[13px]">
                                                <span className="text-gray-800 font-medium">{val}</span>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Time-slot intervals</p>
                                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px]">
                                        <span className="text-gray-800 font-medium">1 hour</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Card 2: Custom booking link ── */}
                    <div className="group bg-white rounded-[20px] border border-gray-200/80 p-7 overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                        <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Branding</span>
                        <h3 className="text-[17px] font-black tracking-tight text-gray-950 mb-2 leading-snug">Stand out with a custom booking link</h3>
                        <p className="text-[13px] text-gray-500 leading-[1.65] mb-6">
                            A short, memorable link for your bookers. No more long, complicated URLs.
                        </p>
                        {/* Mockup */}
                        <div className="relative mt-2">
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 bg-gray-950 text-white text-[11px] font-bold rounded-full px-4 py-1.5 tracking-tight shadow-lg whitespace-nowrap">
                                cal.com/bailey
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-[#FAFAFA] pt-6 pb-4 px-4">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-[10px] font-black shadow-sm">BP</div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-800">Bailey Pumfleet</p>
                                        <p className="text-[10px] text-gray-400">Product Designer</p>
                                    </div>
                                </div>
                                <p className="font-black text-[15px] text-gray-950 mb-1.5 tracking-tight">Business meeting</p>
                                <p className="text-[11px] text-gray-500 leading-relaxed mb-3.5">
                                    Let&#39;s talk strategy, partnerships, or how Cal.com fits into your infrastructure goals.
                                </p>
                                <div className="flex items-center gap-1.5 mb-3.5 flex-wrap">
                                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#d1d5db" strokeWidth="1.5" /><path d="M8 4v4l2.5 2" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                    {["15m", "30m", "45m", "1h"].map((t) => (
                                        <span key={t} className="border border-gray-200 bg-white rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-gray-600">{t}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-4 h-4 rounded-md bg-blue-500 flex items-center justify-center">
                                            <span className="text-white text-[8px] font-black">Z</span>
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-700">Zoom</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#d1d5db" strokeWidth="1.5" /><path d="M8 2a6 6 0 0 1 0 12M8 2a6 6 0 0 0 0 12M2 8h12" stroke="#d1d5db" strokeWidth="1" /></svg>
                                        <span>N. America / California</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Card 3: Calendar overlay ── */}
                    <div className="group bg-white rounded-[20px] border border-gray-200/80 p-7 overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                        <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Experience</span>
                        <h3 className="text-[17px] font-black tracking-tight text-gray-950 mb-2 leading-snug">Streamline your bookers&#39; experience</h3>
                        <p className="text-[13px] text-gray-500 leading-[1.65] mb-5">
                            Overlay calendars, receive confirmations via text or email, and allow easy rescheduling.
                        </p>
                        {/* Calendar mockup */}
                        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-[18px] rounded-full bg-gray-950 relative flex-shrink-0">
                                        <div className="absolute top-[3px] right-[3px] w-3 h-3 rounded-full bg-white shadow-sm" />
                                    </div>
                                    <span className="text-[11px] font-medium text-gray-600">Overlay my calendar</span>
                                </div>
                                <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                                    <button className="text-[10px] font-bold text-white bg-gray-900 rounded-md px-2 py-0.5">12h</button>
                                    <button className="text-[10px] font-medium text-gray-400 px-2 py-0.5">24h</button>
                                </div>
                            </div>
                            {/* Day headers */}
                            <div className="grid grid-cols-5 border-b border-gray-100 text-center bg-[#FAFAFA]">
                                {[["Wed", "06"], ["Thu", "07"], ["Fri", "08"], ["Sat", "09"], ["Sun", "10"]].map(([d, n]) => (
                                    <div key={n} className="py-2">
                                        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{d}</div>
                                        <div className="text-[13px] font-black text-gray-800">{n}</div>
                                    </div>
                                ))}
                            </div>
                            {/* Events */}
                            <div className="grid grid-cols-5 gap-1 p-2 min-h-[100px] bg-white">
                                <div><div className="rounded-lg bg-pink-50 border border-pink-100 text-pink-700 px-1.5 py-1 text-[9px] font-bold leading-tight">Lunch date<br /><span className="font-normal opacity-80">12–3 PM</span></div></div>
                                <div className="space-y-1">
                                    <div className="rounded-lg bg-violet-50 border border-violet-100 text-violet-700 px-1.5 py-1 text-[9px] font-bold leading-tight">Coffee<br /><span className="font-normal opacity-80">11–12 PM</span></div>
                                    <div className="rounded-lg bg-gray-50 border border-gray-200 text-gray-500 px-1.5 py-1 text-[9px] font-bold leading-tight">Design conf.<br /><span className="font-normal opacity-70">12–2 PM</span></div>
                                </div>
                                <div><div className="rounded-lg bg-gray-50 border border-gray-200 text-gray-500 px-1.5 py-1 text-[9px] font-bold leading-tight">Design conf.<br /><span className="font-normal opacity-70">12–2 PM</span></div></div>
                                <div><div className="rounded-lg bg-sky-50 border border-sky-100 text-sky-700 px-1.5 py-1 text-[9px] font-bold leading-tight">Hiring call<br /><span className="font-normal opacity-80">11:30–1 PM</span></div></div>
                                <div><div className="rounded-lg bg-sky-50 border border-sky-100 text-sky-700 px-1.5 py-1 text-[9px] font-bold leading-tight">Co. meeting<br /><span className="font-normal opacity-80">11–2:30 PM</span></div></div>
                            </div>
                        </div>
                    </div>

                    {/* ── Card 4: No-shows ── */}
                    <div className="group bg-white rounded-[20px] border border-gray-200/80 p-7 overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                        <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Automation</span>
                        <h3 className="text-[17px] font-black tracking-tight text-gray-950 mb-2 leading-snug">Reduce no-shows with automated reminders</h3>
                        <p className="text-[13px] text-gray-500 leading-[1.65] mb-6">
                            Send SMS or email reminders about bookings, and automated follow-ups to gather
                            relevant info before the meeting.
                        </p>
                        {/* Notification stack */}
                        <div className="relative">
                            {/* Shadow card behind */}
                            <div className="absolute top-2.5 left-4 right-4 h-full rounded-2xl border border-gray-100 bg-gray-50" />
                            {/* Main notification */}
                            <div className="relative z-10 rounded-2xl border border-gray-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-4 flex items-start gap-3">
                                <div className="w-10 h-10 rounded-[14px] bg-gray-950 flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-sm">
                                    Cal
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="text-[13px] font-black text-gray-950 tracking-tight">Meeting canceled</p>
                                        <p className="text-[10px] text-gray-400 font-semibold whitespace-nowrap mt-0.5">just now</p>
                                    </div>
                                    <p className="text-[12px] text-gray-500 leading-relaxed mb-2.5">
                                        James Clarwell has just canceled the meeting.
                                    </p>
                                    <div className="space-y-1.5">
                                        <div className="h-[7px] rounded-full bg-gray-100 w-full" />
                                        <div className="h-[7px] rounded-full bg-gray-100 w-2/3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Footer tagline ── */}
                <div className="text-center mt-16">
                    <p className="text-[2.2rem] md:text-[2.8rem] font-black tracking-[-0.04em] text-gray-950">
                        ...and so much more!
                    </p>
                </div>

            </div>
        </section>
    );
}