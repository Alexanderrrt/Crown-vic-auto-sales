"use client";

import { useEffect } from "react";

export function VehicleViewTracker({ vehicleSlug }: { vehicleSlug: string }) {
  useEffect(() => {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "vehicle_view",
        vehicleSlug,
        visitorId: getVisitorId(),
      }),
    }).catch(() => undefined);
  }, [vehicleSlug]);

  return null;
}

function getVisitorId() {
  if (typeof window === "undefined") return "server";

  const key = "crown-vic-visitor-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}
