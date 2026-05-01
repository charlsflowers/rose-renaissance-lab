import { Link } from "@/i18n/LocalizedRouter";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  links: { label: string; slug: string }[];
}

const LandingInternalLinks = ({ title, links }: Props) => (
  <section className="mb-12 bg-cream rounded-lg p-6">
    <h2 className="font-display text-xl font-semibold text-foreground mb-4">{title}</h2>
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.slug}>
          <Link
            to={`/${l.slug}`}
            className="inline-flex items-center gap-2 font-body text-sm text-primary hover:underline"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default LandingInternalLinks;