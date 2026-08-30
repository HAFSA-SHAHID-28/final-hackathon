import { Link } from "react-router-dom";
import {
  HiOutlineCode,
  HiOutlineAcademicCap,
  HiOutlinePhotograph,
  HiOutlineHome,
  HiOutlineCog,
  HiOutlineBriefcase,
} from "react-icons/hi";

const services = [
  {
    title: "Technical",
    description:
      "Get help with websites, software, computers, and other technical needs.",
    icon: HiOutlineCode,
  },
  {
    title: "Teaching",
    description:
      "Find someone who can help you learn a subject or develop a new skill.",
    icon: HiOutlineAcademicCap,
  },
  {
    title: "Design",
    description:
      "Get creative support for graphics, interfaces, branding, and visual work.",
    icon: HiOutlinePhotograph,
  },
  {
    title: "Home Services",
    description:
      "Find assistance for everyday home maintenance and related tasks.",
    icon: HiOutlineHome,
  },
  {
    title: "Repairs",
    description:
      "Request help with fixing devices, equipment, and everyday problems.",
    icon: HiOutlineCog,
  },
  {
    title: "Professional",
    description:
      "Connect with specialists offering a range of professional services.",
    icon: HiOutlineBriefcase,
  },
];

const ServicesPage = () => {
  return (
    <section className="bg-page">
      {/* Hero */}
      <div className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Services
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl">
            Find the right help
            <br />
            for what you need.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-secondary">
            Explore the services available through Verdant Noir and
            connect with specialists who can help.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-[var(--radius-md)] border border-line bg-card p-7 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-page text-brand transition group-hover:border-brand/40">
                  <Icon size={21} />
                </div>

                <h2 className="mt-6 text-lg font-semibold text-ink">
                  {service.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[var(--radius-lg)] border border-line bg-card p-8 text-center md:mt-24 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Need assistance?
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            Tell us what you need.
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
            Create a service request and find an available specialist
            for your needs.
          </p>

          <Link
            to="/dashboard"
            className="mt-7 inline-flex rounded-[var(--radius-sm)] bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Create a request
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;