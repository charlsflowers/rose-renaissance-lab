import { MapPin } from "lucide-react";

interface Props {
  title: string;
  intro: string;
  zones: string[];
}

const LandingZonesList = ({ title, intro, zones }: Props) => (
  <section className="mb-16">
    <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{title}</h2>
    <p className="font-body text-sm text-muted-foreground mb-6">{intro}</p>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {zones.map((zone, i) => (
        <li key={i} className="flex items-start gap-3 p-3 bg-cream rounded-lg">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span className="font-body text-sm text-foreground">{zone}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default LandingZonesList;