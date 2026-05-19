type PlatformSectionContentProps = {
  className?: string;
};

export default function PlatformSectionContent({
  className = "",
}: PlatformSectionContentProps) {
  return (
    <div className={className}>
      <div className="mx-auto w-full">
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#ec721a] md:text-5xl">
          Treasury intelligence built for institutions that move first.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/60">
          The cinematic journey ends here — scroll continues naturally into the
          platform story. Replace this section with your product narrative,
          metrics, and feature grid.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Predictive liquidity",
              body: "AI models surface stress before settlement windows tighten.",
            },
            {
              title: "Holographic dashboards",
              body: "Multi-state views morph as positions and corridors shift.",
            },
            {
              title: "Dimensional routing",
              body: "Orchestrate flows across entities with institutional guardrails.",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-black/10 bg-white/[0.03] p-8 backdrop-blur-sm"
            >
              <h3 className="text-lg font-medium text-black">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/55">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
