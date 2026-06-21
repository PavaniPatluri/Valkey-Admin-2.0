import { TopologyGraph } from "@/components/topology-graph"
import { Badge } from "@/components/ui/badge"

export default function TopologyPage() {
  return (
    <div className="flex flex-col h-full gap-6 p-8 max-w-[1600px] mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Cluster Topology</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time interactive map of your Valkey cluster architecture and replication flows.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary">
            2 Masters
          </Badge>
          <Badge variant="outline" className="bg-background/50 border-emerald-500/20 text-emerald-500">
            3 Replicas
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 relative rounded-xl bg-card shadow-sm">
        <TopologyGraph />
      </div>
    </div>
  )
}
