export interface NavItem {
  id: string;
  label: string;
}

export interface MenuLabels {
  /** Accessible name of the toggle while the menu is closed. */
  open: string;
  /** Accessible name of the toggle while the menu is open. */
  close: string;
  /** Accessible name of the full-screen menu. */
  panel: string;
  /** Accessible name of the section links in the header pill. */
  sections: string;
}

export interface NavbarBrand {
  label: string;
  cta: { label: string; targetId: string };
}
