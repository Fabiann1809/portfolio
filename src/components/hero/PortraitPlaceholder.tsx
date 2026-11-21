/** Tasteful stand-in silhouette shown until the real cut-out exists. Tinted from the theme tokens. */
export function PortraitPlaceholder() {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="portrait-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="color-mix(in srgb, var(--foreground) 22%, var(--background))" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--foreground) 8%, var(--background))" />
        </linearGradient>
      </defs>
      <path
        d="M40 500 C44 410 78 352 150 332 L170 296 C150 280 142 252 142 226 C142 168 168 128 200 128 C232 128 258 168 258 226 C258 252 250 280 230 296 L250 332 C322 352 356 410 360 500 Z"
        fill="url(#portrait-body)"
      />
    </svg>
  );
}
