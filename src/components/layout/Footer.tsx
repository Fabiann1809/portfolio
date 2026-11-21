import { footer, socials } from "@/data/socials";

export function Footer() {
  return (
    <footer className="border-t border-current/20 px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm">{footer.text}</p>
        <ul className="flex gap-4">
          {socials.map((social) => (
            <li key={social.id}>
              <a href={social.url} target="_blank" rel="noreferrer">{social.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
