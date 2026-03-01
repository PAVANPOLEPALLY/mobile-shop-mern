import { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import { getPublicBanners } from "../services/bannerService";

const BannerSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
    ))}
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [offerBanners, setOfferBanners] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);

    getPublicBanners("hero")
      .then(setHeroBanners)
      .catch(console.error)
      .finally(() => setLoadingHero(false));

    getPublicBanners("offer")
      .then(setOfferBanners)
      .catch(console.error)
      .finally(() => setLoadingOffers(false));
  }, []);

  const featured = products.slice(0, 8);

  return (
    <div className="space-y-12 animate-fade-in">
      <HeroSlider banners={heroBanners} loading={loadingHero} />

      {!loadingOffers && offerBanners.length > 0 && (
        <section className="space-y-4 animate-fade-up">
          <h2 className="text-2xl font-bold">Latest Offers</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {offerBanners.map((banner) => {
              const Wrapper = banner.link ? "a" : "div";
              return (
                <Wrapper
                  key={banner._id}
                  href={banner.link || undefined}
                  target={banner.link ? "_blank" : undefined}
                  rel={banner.link ? "noreferrer" : undefined}
                  className="min-w-[280px] flex-1 rounded-2xl ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-40 overflow-hidden rounded-2xl">
                    <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">{banner.title}</h3>
                        {banner.subtitle && (
                          <p className="line-clamp-2 text-xs text-slate-100">{banner.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </section>
      )}

      {loadingOffers && <BannerSkeleton />}

      <section className="space-y-4 animate-fade-up">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <div className="stagger-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
