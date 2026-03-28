import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { categories, categoryProducts } from "@/lib/catalogData";
import { ArrowLeft } from "lucide-react";

const CategoryProducts = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const products = slug ? categoryProducts[slug] || [] : [];

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">Category not found</p>
          <Link to="/" className="text-primary font-body underline mt-4 inline-block">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="text-center mb-12">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">{category.description}</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">{category.title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <div key={product.id}>
                <Link to={`/categoria/${slug}/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl text-muted-foreground/30">🌹</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground text-center">{product.name}</h3>
                  
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">
                    From ${product.sizes[0].price}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
