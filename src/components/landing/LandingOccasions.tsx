interface Props {
  title: string;
  intro: string;
  occasions: string[];
}

const LandingOccasions = ({ title, intro, occasions }: Props) => (
  <section className="mb-16">
    <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{title}</h2>
    <p className="font-body text-sm text-muted-foreground mb-4">{intro}</p>
    <ul className="space-y-2 list-disc pl-5">
      {occasions.map((item, i) => (
        <li key={i} className="font-body text-sm text-foreground leading-relaxed">{item}</li>
      ))}
    </ul>
  </section>
);

export default LandingOccasions;