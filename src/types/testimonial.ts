export interface Testimonial {
  id: string;
  name: string;
  role: string;
  /** Optional organization shown after the role. */
  company?: string;
  quote: string;
  /** Small-resolution image path (rendered pixelated). Initials fallback when missing. */
  avatar?: string;
}

export interface TestimonialsMarqueeConfig {
  /** Region label for assistive tech. */
  regionLabel: string;
  pauseLabel: string;
  playLabel: string;
  /** Auto-scroll speed in px/s while the pointer is away. */
  fastSpeed: number;
  /** Auto-scroll speed in px/s on phones (max-width 767px) and touch devices. */
  mobileSpeed: number;
  /** Speed in px/s while hovering with a mouse. */
  slowSpeed: number;
  /** Time constant (ms) of the speed easing. */
  dampingMs: number;
  /** Gap between cards in px. */
  gap: number;
}
