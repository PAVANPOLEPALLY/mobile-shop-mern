import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import { getFeaturedProducts, getProducts } from "../services/api";
import { getPublicBanners } from "../services/bannerService";

const BannerSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
    ))}
  </div>
);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [offerBanners, setOfferBanners] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => setFeaturedProducts((data || []).slice(0, 8)))
      .catch(console.error);

    getProducts()
      .then((data) => {
        const sorted = [...(data || [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLatestProducts(sorted.slice(0, 8));
      })
      .catch(console.error);

    getPublicBanners("hero")
      .then(setHeroBanners)
      .catch(console.error)
      .finally(() => setLoadingHero(false));

    getPublicBanners("offer")
      .then(setOfferBanners)
      .catch(console.error)
      .finally(() => setLoadingOffers(false));
  }, []);

  return (
    <div className="space-y-8 py-8 md:space-y-12 animate-fade-in">
      <HeroSlider banners={heroBanners} loading={loadingHero} />

      {featuredProducts.length > 0 && (
        <section className="space-y-4 rounded-2xl bg-amber-50/60 p-4 ring-1 ring-amber-100 animate-fade-up sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold sm:text-2xl">Featured Mobiles</h2>
            <Link
              to="/products"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-200"
            >
              View All
            </Link>
          </div>
          <div className="stagger-grid grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        </section>
      )}

      {!loadingOffers && offerBanners.length > 0 && (
        <section className="space-y-4 animate-fade-up">
          <h2 className="text-xl font-bold sm:text-2xl">Latest Offers</h2>
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
        <h2 className="text-xl font-bold sm:text-2xl">Latest Products</h2>
        <div className="stagger-grid grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {latestProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
