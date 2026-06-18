import { cn } from "@/lib/utils";

// A restrained, abstract site-plan / floorplan motif drawn in hairlines.
// Colour comes from the parent via currentColor (kept low-contrast).
export function ArchitecturalMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={cn("h-auto w-full", className)}
    >
      {/* plot boundary */}
      <rect x="40" y="40" width="400" height="400" strokeWidth="1.5" />
      {/* setback line */}
      <rect x="64" y="64" width="352" height="352" strokeWidth="0.75" strokeDasharray="3 5" />

      {/* building footprint, subdivided */}
      <g strokeWidth="1.25">
        <rect x="96" y="120" width="208" height="184" />
        <line x1="200" y1="120" x2="200" y2="304" />
        <line x1="96" y1="212" x2="304" y2="212" />
        <line x1="200" y1="212" x2="304" y2="160" />
      </g>

      {/* secondary volume */}
      <g strokeWidth="1">
        <rect x="324" y="232" width="72" height="120" />
        <line x1="324" y1="292" x2="396" y2="292" />
      </g>

      {/* circulation / tree */}
      <circle cx="150" cy="372" r="34" strokeWidth="0.9" />
      <circle cx="150" cy="372" r="3" strokeWidth="0.9" />

      {/* dimension ticks (top edge) */}
      <g strokeWidth="0.75">
        <line x1="40" y1="26" x2="440" y2="26" />
        <line x1="40" y1="20" x2="40" y2="32" />
        <line x1="240" y1="20" x2="240" y2="32" />
        <line x1="440" y1="20" x2="440" y2="32" />
      </g>

      {/* north arrow */}
      <g strokeWidth="1" transform="translate(400 96)">
        <circle cx="0" cy="0" r="16" strokeWidth="0.75" />
        <path d="M0 -12 L4 4 L0 0 L-4 4 Z" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
