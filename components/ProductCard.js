import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ p }) {
  const image =
    p.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85";

  return (
    <Link
      href={`/products/${p.slug}`}
      className="product-card product-card-animated"
    >
      <Image
        src={image}
        alt={p.name}
        width={800}
        height={800}
        loading="eager"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={80}
      />

      <div>
        <span>{p.category || p.code}</span>

        <h3>{p.name}</h3>

        <b>Rs. {Number(p.price).toLocaleString()}</b>
      </div>
    </Link>
  );
}
