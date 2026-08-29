import AuthForm from "../components/auth/AuthForm";

const AuthPage = () => {
  return (
    <section className="min-h-screen bg-page px-6 py-10 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card shadow-card lg:grid-cols-2">

          {/* Brand side */}
          <div className="hidden min-h-[600px] flex-col justify-between bg-brand p-12 text-white lg:flex">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                Verdant Noir
              </p>

              <div className="mt-24 max-w-md">
                <p className="mb-5 text-sm uppercase tracking-[0.2em] text-white/50">
                  Quiet luxury. Thoughtful design.
                </p>

                <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight">
                  A refined space
                  <br />
                  for your work.
                </h1>

                <p className="mt-7 max-w-sm text-sm leading-7 text-white/65">
                  Sign in to continue, or create an account and make this
                  space yours.
                </p>
              </div>
            </div>

            <p className="text-xs tracking-wide text-white/40">
              © 2026 Verdant Noir
            </p>

          </div>

          {/* Form side */}
          <div className="flex min-h-[600px] items-center justify-center p-7 sm:p-12">
            <div className="w-full max-w-md">
              <AuthForm />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AuthPage;