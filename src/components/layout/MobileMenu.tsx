import { navigation } from "@/data/navigation";

interface MobileMenuProps {
  open: boolean;
  activeId: string;
  onNavigate: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function MobileMenu({ open, activeId, onNavigate }: MobileMenuProps) {
  if (!open) return null;
  return (
    <nav id="mobile-menu" className="bg-background border-t border-current/20 md:hidden">
      <ul className="flex flex-col p-4">
        {navigation.map((item) => (
          <li key={item.id}>
            <a
              href={"#" + item.id}
              onClick={(event) => onNavigate(item.id, event)}
              aria-current={activeId === item.id ? "true" : undefined}
              className="block py-2"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
