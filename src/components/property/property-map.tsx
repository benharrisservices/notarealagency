"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type MapMarker = { lat: number; lng: number; label: string; href?: string };

export function PropertyMap({
  markers,
  zoom = 14,
  className,
}: {
  markers: MapMarker[];
  zoom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || map) return;

      const center: [number, number] = markers[0]
        ? [markers[0].lat, markers[0].lng]
        : [51.5435, -0.0238];

      map = L.map(ref.current, { scrollWheelZoom: false, attributionControl: true }).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const pts: import("leaflet").Marker[] = [];
      markers.forEach((m) => {
        const icon = L.divIcon({
          className: "",
          html: `<span class="nara-pin">${m.label}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map!);
        if (m.href) marker.on("click", () => { window.location.href = m.href!; });
        pts.push(marker);
      });

      if (pts.length > 1) {
        const group = L.featureGroup(pts);
        map.fitBounds(group.getBounds().pad(0.25));
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers), zoom]);

  return <div ref={ref} className={cn("h-[420px] w-full bg-surface-2", className)} />;
}
