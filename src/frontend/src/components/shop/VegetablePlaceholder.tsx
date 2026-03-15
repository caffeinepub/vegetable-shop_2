export function VegetablePlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-fresh/20 to-primary/30 gap-2">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse
          cx="24"
          cy="36"
          rx="10"
          ry="4"
          fill="oklch(0.42 0.15 148 / 0.2)"
        />
        <path
          d="M24 10 C24 10, 14 16, 14 26 C14 32 18.5 36 24 36 C29.5 36 34 32 34 26 C34 16 24 10 24 10Z"
          fill="oklch(0.42 0.15 148 / 0.6)"
        />
        <path
          d="M24 10 C24 10, 20 14, 19 22 C22 20 26 20 28 22 C27 14 24 10 24 10Z"
          fill="oklch(0.65 0.15 130 / 0.7)"
        />
        <line
          x1="24"
          y1="10"
          x2="24"
          y2="36"
          stroke="oklch(0.42 0.15 148 / 0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M24 18 C24 18, 16 14, 12 8 C16 10 22 14 24 18Z"
          fill="oklch(0.55 0.18 148 / 0.5)"
        />
        <path
          d="M24 18 C24 18, 32 14, 36 8 C32 10 26 14 24 18Z"
          fill="oklch(0.55 0.18 148 / 0.5)"
        />
      </svg>
      <span className="text-xs font-medium text-primary/60 text-center px-2 truncate w-full text-center">
        {name}
      </span>
    </div>
  );
}
