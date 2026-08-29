const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">

        {/* Brand Mark */}
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-card shadow-soft">
          <div className="h-3 w-3 rounded-full bg-brand animate-pulse" />
        </div>

        {/* Brand */}
        <h1 className="text-lg font-semibold tracking-[0.18em] text-ink uppercase">
          Verdant Noir
        </h1>

        <p className="mt-2 text-sm text-muted">
          Preparing your workspace
        </p>

        {/* Loading line */}
        <div className="mt-7 h-px w-32 overflow-hidden bg-line">
          <div className="h-full w-1/2 bg-brand animate-pulse" />
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;