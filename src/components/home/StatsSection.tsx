const stats = [
  { number: "5+", label: "AI Models Integrated" },
  { number: "100+", label: "AI Tools Cataloged" },
  { number: "∞", label: "Possibilities" },
  { number: "24/7", label: "Available" },
];

export function StatsSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-display text-4xl md:text-5xl font-black text-center bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent mb-12">
          Why Choose CHOTU?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass text-center p-6 md:p-8 rounded-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="font-display text-4xl md:text-5xl font-black gradient-text">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm md:text-base mt-2 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
