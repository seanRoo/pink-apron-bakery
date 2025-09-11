import { useParams } from "react-router-dom";

export default function Product() {
  const { slug } = useParams();
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-semibold">Product</h2>
      <p className="text-warmgray">Slug: {slug}</p>
    </section>
  );
}
