type Props = { title: string };
export default function StaticPage({ title }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-warmgray">Placeholder copy for {title}.</p>
    </section>
  );
}
