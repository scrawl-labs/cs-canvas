export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Horizontal axis line */}
      <line
        x1="2"
        y1="52"
        x2="98"
        y2="52"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Curve (cubic function shape: peak left, trough right) */}
      <path
        d="M10 65 C 20 65, 25 18, 38 18 C 48 18, 48 52, 50 52 C 52 52, 52 82, 62 82 C 75 82, 80 38, 90 38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Red dot (left) */}
      <circle cx="28" cy="52" r="5" fill="#ef4444" />
      {/* Blue dot (center) */}
      <circle cx="50" cy="52" r="5" fill="#3b82f6" />
      {/* Green dot (right) */}
      <circle cx="72" cy="52" r="5" fill="#22c55e" />
    </svg>
  );
}
