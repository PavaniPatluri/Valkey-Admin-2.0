export default function FeaturesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto p-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-emerald-500">Enterprise Features</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Valkey Admin NextGen comes packed with everything you need to manage your infrastructure.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <h3 className="font-bold text-lg mb-2">Real-Time Observability</h3>
          <p className="text-muted-foreground text-sm">Monitor RAM, CPU, operations per second, and network I/O in real-time with stunning visualizations.</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <h3 className="font-bold text-lg mb-2">AI Incident Investigator</h3>
          <p className="text-muted-foreground text-sm">Automatically diagnose slow queries, memory spikes, and network partitions with our built-in AI Copilot.</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <h3 className="font-bold text-lg mb-2">Cluster Sharding & Rebalancing</h3>
          <p className="text-muted-foreground text-sm">Visually rebalance hash slots across master nodes to eliminate hot-shards and optimize load.</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <h3 className="font-bold text-lg mb-2">Advanced Security (ACLs)</h3>
          <p className="text-muted-foreground text-sm">Granular command restrictions and keyspace access controls to enforce zero-trust security policies.</p>
        </div>
      </div>
    </div>
  )
}
