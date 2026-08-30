const AboutPage = () => {
  return (
    <section className="bg-page">
      {/* Hero */}
      <div className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            About Verdant Noir
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl">
            Connecting people with
            <br />
            the right specialists.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-secondary">
            Verdant Noir is a service platform designed to make it easier
            for people to find skilled specialists and request the help
            they need.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Our purpose
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Simple requests. Meaningful help.
            </h2>
          </div>

          <div>
            <p className="text-sm leading-7 text-secondary">
              Whether you need technical assistance, teaching, design,
              repairs, or another professional service, Verdant Noir
              provides a simple space to describe your needs and connect
              with available workers.
            </p>

            <p className="mt-5 text-sm leading-7 text-secondary">
              Our goal is to keep the experience straightforward,
              transparent, and easy to use for both customers and
              specialists.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-line bg-card p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              01
            </p>

            <h3 className="mt-5 text-lg font-semibold text-ink">
              Simple
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted">
              A clear experience without unnecessary complexity.
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-line bg-card p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              02
            </p>

            <h3 className="mt-5 text-lg font-semibold text-ink">
              Reliable
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted">
              Helping customers find suitable specialists for their
              service needs.
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-line bg-card p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              03
            </p>

            <h3 className="mt-5 text-lg font-semibold text-ink">
              Human
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted">
              Built around real people, real requests, and useful
              services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;