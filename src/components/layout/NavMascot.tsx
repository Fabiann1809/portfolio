/** Tiny round ghost with two eyes; decorative, perches on the active nav pill. */
export function NavMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M12 2.5c-4.7 0-8 3.4-8 8v9.2c0 .8.9 1.2 1.5.7l1.7-1.5 1.8 1.6c.5.4 1.1.4 1.6 0l1.4-1.2 1.4 1.2c.5.4 1.1.4 1.6 0l1.8-1.6 1.7 1.5c.6.5 1.5.1 1.5-.7v-9.2c0-4.6-3.3-8-8-8Z"
        fill="var(--emphasis)"
        stroke="var(--background)"
        strokeWidth="1.2"
      />
      <g className="nav-mascot-eyes" fill="var(--background)">
        <ellipse cx="9" cy="10.5" rx="1.4" ry="1.8" />
        <ellipse cx="15" cy="10.5" rx="1.4" ry="1.8" />
      </g>
      <ellipse cx="6.8" cy="13.6" rx="1.2" ry=".7" fill="var(--background)" opacity=".35" />
      <ellipse cx="17.2" cy="13.6" rx="1.2" ry=".7" fill="var(--background)" opacity=".35" />
    </svg>
  );
}
