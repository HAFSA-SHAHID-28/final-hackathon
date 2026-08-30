import { Link } from "react-router-dom";
import { HiArrowRight, HiSparkles, HiShieldCheck } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  return <section className="overflow-hidden bg-page"><div className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.2fr_.8fr] md:px-8">
    <div><p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-gold"><HiSparkles /> Service requests, refined</p><h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-ink md:text-7xl">Support that feels <span className="text-brand">considered.</span></h1><p className="mt-7 max-w-xl text-base leading-8 text-secondary">Choose the right specialist, track every update in real time, and close each service experience with confidence.</p><Link to={user ? "/dashboard" : "/auth"} className="mt-9 inline-flex items-center gap-3 rounded-md bg-brand px-6 py-3.5 text-sm font-semibold text-card transition hover:bg-brand-dark">{user ? "Open dashboard" : "Get started"}<HiArrowRight /></Link></div>
    <div className="relative rounded-lg border border-line bg-card p-6 shadow-card"><div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold-light"/><p className="relative text-xs font-bold uppercase tracking-[.18em] text-muted">Live request</p><h2 className="relative mt-3 text-2xl font-semibold">Mathematics tutoring</h2><div className="relative mt-7 space-y-4"><div className="rounded-md bg-brand-light p-4"><p className="text-xs text-secondary">Selected specialist</p><p className="mt-1 font-semibold">Rohama · 4.9 ★</p></div><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-status-success"/><span className="text-sm text-secondary">In Progress · updated instantly</span></div></div><div className="relative mt-8 flex items-center gap-3 border-t border-line pt-5 text-sm text-muted"><HiShieldCheck className="text-brand" size={21}/> Secure, role-based service flow</div></div>
  </div></section>;
}
