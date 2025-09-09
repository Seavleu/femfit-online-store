import LinkHover from "@/animation/LinkHover";

interface NavigationLinkProps {
  href: string;
  title: string;
  className?: string;
}

export default function NavigationLink({ href, title, className = "" }: NavigationLinkProps) {
  return (
    <LinkHover
      key={title}
      className={`w-fit sub-paragraph font-medium capitalize before:h-[1px] after:h-[1px] before:bottom-[1px] after:bottom-[1px] ${className}`}
      title={title}
      href={href}
    />
  );
}
