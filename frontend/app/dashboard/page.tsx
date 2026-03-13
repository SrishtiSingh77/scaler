"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/event-types");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
      Redirecting to event types…
    </div>
  );
}