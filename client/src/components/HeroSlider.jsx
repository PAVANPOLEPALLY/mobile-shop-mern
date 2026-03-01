import { useEffect, useMemo, useState } from "react";

const FALLBACK_BANNER = {
  title: "Latest Smartphones, Trusted Service",
  subtitle: "Explore premium mobiles with EMI and exclusive local offers.",
  image:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
  link: "/products"
};

const HeroSlider = ({ banners = [], loading = false }) => {
  const slides = useMemo(() => (banners.length ? banners : [FALLBACK_BANNER]), [banners]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [slides.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const onTouchStart = (event) => setTouchStart(event.touches[0].clientX);
  const onTouchEnd = (event) => {
    if (touchStart === null) return;
    const distance = touchStart - event.changedTouches[0].clientX;
    if (distance > 40) next();
    if (distance < -40) prev();
    setTouchStart(null);
  };

  if (loading) {
    return <div className="h-[260px] animate-pulse rounded-3xl bg-slate-200 sm:h-[320px] md:h-[430px]" />;
  }

  return (
    <section
      className="relative overflow-hidden rounded-3xl shadow-xl"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[260px] sm:h-[320px] md:h-[430px]">
        {slides.map((slide, index) => (
          <article
            key={`${slide.title}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
              loading={index === currentIndex ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/45 to-transparent" />
            <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-10">
              <div className="max-w-2xl space-y-3 text-center text-white md:space-y-4 md:text-left">
                <h1 className="text-2xl font-bold leading-tight md:text-4xl lg:text-5xl">{slide.title}</h1>
                {slide.subtitle && <p className="text-sm text-slate-100 sm:text-base">{slide.subtitle}</p>}
                {slide.link && (
                  <a
                    href={slide.link}
                    className="inline-flex min-h-[44px] items-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-brand-700 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Shop Now
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 hidden min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/40 px-3 py-2 text-white transition hover:bg-black/55 md:flex"
            aria-label="Previous banner"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 hidden min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/40 px-3 py-2 text-white transition hover:bg-black/55 md:flex"
            aria-label="Next banner"
          >
            <span aria-hidden="true">&gt;</span>
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                type="button"
                key={index}
                aria-label={`Go to banner ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  currentIndex === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
