const AboutPage = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">About Us</h1>
      </header>

      <article className="card space-y-4 p-6">
        <h2 className="text-2xl font-semibold text-brand-700">Our Story</h2>
        <p className="leading-7 text-slate-700">
          What started as a small neighborhood mobile shop with a simple goal, helping people
          choose the right phone at the right price, has grown into a trusted online destination for
          smartphone shoppers across India.
        </p>
        <p className="leading-7 text-slate-700">
          From day one, we focused on genuine products, honest guidance, and dependable service.
          Today, we combine that same local trust with the convenience of modern e-commerce, so you
          can shop confidently from anywhere.
        </p>
      </article>

      <article className="card space-y-4 p-6">
        <h2 className="text-2xl font-semibold text-brand-700">Our Mission</h2>
        <p className="leading-7 text-slate-700">
          Our mission is simple: affordable smartphones for everyone.
        </p>
        <p className="leading-7 text-slate-700">
          We believe technology should be accessible, whether you are a student, a working
          professional, a business owner, or buying your first smartphone for your family.
        </p>
        <p className="leading-7 text-slate-700">
          By offering competitive pricing, transparent deals, and EMI options, we make it easier for
          every Indian customer to upgrade without financial stress.
        </p>
      </article>

      <article className="card space-y-4 p-6">
        <h2 className="text-2xl font-semibold text-brand-700">Why Choose Us</h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          <li>
            <span className="font-semibold">100% Original Products:</span> Only authentic
            smartphones and accessories from trusted brands.
          </li>
          <li>
            <span className="font-semibold">Fast Delivery Across India:</span> Quick and reliable
            shipping so your order reaches you on time.
          </li>
          <li>
            <span className="font-semibold">Secure Payments:</span> Safe checkout with trusted
            payment methods.
          </li>
          <li>
            <span className="font-semibold">Easy Returns:</span> Hassle-free return process for
            added peace of mind.
          </li>
          <li>
            <span className="font-semibold">Flexible EMI Options:</span> Convenient monthly payment
            plans to fit your budget.
          </li>
        </ul>
      </article>

      <article className="card space-y-4 p-6">
        <h2 className="text-2xl font-semibold text-brand-700">Customer Commitment</h2>
        <p className="leading-7 text-slate-700">Our customers are at the center of everything we do.</p>
        <p className="leading-7 text-slate-700">
          From browsing to delivery and after-sales support, we are committed to making your shopping
          experience smooth, transparent, and worry-free. Our team is here to assist you with product
          advice, order updates, and support whenever you need it.
        </p>
        <p className="text-lg font-semibold text-slate-900">
          At our store, you don’t just buy a phone, you shop with confidence.
        </p>
      </article>
    </section>
  );
};

export default AboutPage;
