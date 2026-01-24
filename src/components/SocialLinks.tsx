import type { ReactNode } from "react";
import { FaGithub, FaLinkedin, FaXTwitter, FaEnvelope, FaBoxArchive } from "react-icons/fa6";

export type SocialKey = "github" | "linkedin" | "x" | "email";

type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

type Props = {
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
  htb?: string;
  variant?: "icon" | "icon+text";
};

export default function SocialLinks({
  github,
  linkedin,
  x,
  email,
  htb,
  variant = "icon+text",
}: Props) {
  const links: SocialLink[] = [
    github
      ? { key: "github", label: "GitHub", href: github, icon: <FaGithub />, external: true }
      : null,
    linkedin
      ? { key: "linkedin", label: "LinkedIn", href: linkedin, icon: <FaLinkedin />, external: true }
      : null,
    x ? { key: "x", label: "X", href: x, icon: <FaXTwitter />, external: true } : null,
    email ? { key: "email", label: "Email", href: `mailto:${email}`, icon: <FaEnvelope /> } : null,
    htb ? { key: "htb", label: "HackTheBox", href: htb, icon: <FaBoxArchive />, external: true } : null,
  ].filter(Boolean) as SocialLink[];

  return (
    <div className="social">
      {links.map((l) => (
        <a
          key={l.key}
          className="iconLink"
          href={l.href}
          target={l.external ? "_blank" : undefined}
          rel={l.external ? "noreferrer" : undefined}
          aria-label={l.label}
          title={l.label}
        >
          <span className="icon" aria-hidden="true">
            {l.icon}
          </span>
          {variant === "icon+text" && <span>{l.label}</span>}
        </a>
      ))}
    </div>
  );
}
