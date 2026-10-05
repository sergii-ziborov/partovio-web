"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ViewBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname });
    fetch("/beacon", { method: "POST", headers: { "content-type": "application/json" }, body }).catch(() => undefined);
  }, [pathname]);
  return null;
}
