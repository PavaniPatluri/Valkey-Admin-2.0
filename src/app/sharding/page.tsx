"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layers, Network, Activity, Cpu, HardDrive, ArrowRightLeft, Server } from "lucide-react"

type ShardNode = {
  id: string
  ip: string
  role: "master"
  slots: [number, number]
  memoryUsage: number
  cpuLoad: number
  replicas: { id: string, ip: string, status: string }[]
}

const initialShards: ShardNode[] = [
  {
    id: "node-a-mstr",
    ip: "10.0.1.101:6379",
    role: "master",
    slots: [0, 5460],
    memoryUsage: 82, // Hot shard
    cpuLoad: 65,
    replicas: [
      { id: "node-a-rep1", ip: "10.0.1.102:6379", status: "online" }
    ]
  },
  {
    id: "node-b-mstr",
    ip: "10.0.2.101:6379",
    role: "master",
    slots: [5461, 10922],
    memoryUsage: 45,
    cpuLoad: 30,
    replicas: [
      { id: "node-b-rep1", ip: "10.0.2.102:6379", status: "online" }
    ]
  },
  {
    id: "node-c-mstr",
    ip: "10.0.3.101:6379",
    role: "master",
    slots: [10923, 16383],
    memoryUsage: 38,
    cpuLoad: 25,
    replicas: [
      { id: "node-c-rep1", ip: "10.0.3.102:6379", status: "online" }
    ]
  }
]

export default function ShardingPage() {
  const [shards, setShards] = useState<ShardNode[]>(initialShards)
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationProgress, setMigrationProgress] = useState(0)

  // Simulate slot migration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMigrating) {
      interval = setInterval(() => {
        setMigrationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsMigrating(false)
            
            // Rebalance the hot shard memory in UI
            setShards(current => current.map(shard => {
              if (shard.id === "node-a-mstr") return { ...shard, memoryUsage: 55, cpuLoad: 40, slots: [0, 4000] }
              if (shard.id === "node-b-mstr") return { ...shard, memoryUsage: 58, cpuLoad: 35, slots: [4001, 10922] }
              return shard
            }))
            
            return 100
          }
          return prev + 10 // 10 ticks = roughly 1 second at 100ms
        })
      }, 150)
    }
    return () => clearInterval(interval)
  }, [isMigrating])

  const handleRebalance = () => {
    setMigrationProgress(0)
    setIsMigrating(true)
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-6 gap-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cluster Sharding & Rebalance</h1>
          <p className="text-muted-foreground mt-1">
            Visualize hash slot distribution and migrate load across physical nodes.
          </p>
        </div>
        <Button 
          onClick={handleRebalance}
          disabled={isMigrating}
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
        >
          {isMigrating ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
          {isMigrating ? "Migrating Slots..." : "Trigger Auto-Rebalance"}
        </Button>
      </div>

      {/* Cluster KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Master Nodes</CardTitle>
            <Server className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">3</div>
            <p className="text-xs text-muted-foreground mt-1">+ 3 Replicas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hash Slots</CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">16,384</div>
            <p className="text-xs text-blue-500 mt-1">100% Covered</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cluster State</CardTitle>
            <Network className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-emerald-500">OK</div>
            <p className="text-xs text-muted-foreground mt-1">All nodes reachable</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm relative overflow-hidden">
          {isMigrating && (
            <div className="absolute inset-0 bg-blue-500/10 animate-pulse border border-blue-500/30 rounded-lg pointer-events-none" />
          )}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Migrations</CardTitle>
            <Activity className={`h-4 w-4 ${isMigrating ? 'text-blue-500 animate-spin-slow' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold font-mono">{isMigrating ? '1,460' : '0'}</div>
            <p className={`text-xs mt-1 ${isMigrating ? 'text-blue-500' : 'text-muted-foreground'}`}>
              {isMigrating ? 'Slots moving...' : 'Balanced'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Migration Progress Bar */}
      {isMigrating && (
        <Card className="border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm font-medium text-blue-400">
              <span>Migrating slots 4001-5460 from Node A to Node B...</span>
              <span>{migrationProgress}%</span>
            </div>
            <Progress value={migrationProgress} className="h-2 bg-blue-950" indicatorColor="bg-blue-500" />
          </CardContent>
        </Card>
      )}

      {/* Shard Topology Grid */}
      <h2 className="text-lg font-bold mt-4">Active Shards</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {shards.map((shard) => (
          <div key={shard.id} className="flex flex-col gap-3">
            {/* Master Node Card */}
            <Card className={`border-border bg-[#09090b] shadow-sm relative overflow-hidden ${shard.memoryUsage > 80 && !isMigrating ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''}`}>
              <CardHeader className="pb-3 border-b border-border/50 bg-card/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-500" />
                      {shard.id}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{shard.ip}</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">MASTER</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-5">
                
                {/* Hash Slots Allocation */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-bold uppercase tracking-wider">Hash Slots</span>
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {shard.slots[0]} - {shard.slots[1]}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    ({(shard.slots[1] - shard.slots[0] + 1).toLocaleString()} slots owned)
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  {/* Memory Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><HardDrive className="w-3 h-3" /> Memory</span>
                      <span className={`font-mono font-medium ${shard.memoryUsage > 80 ? 'text-amber-500' : 'text-foreground'}`}>{shard.memoryUsage}%</span>
                    </div>
                    <Progress 
                      value={shard.memoryUsage} 
                      className="h-1.5 bg-muted" 
                      indicatorColor={shard.memoryUsage > 80 ? "bg-amber-500" : "bg-emerald-500"} 
                    />
                  </div>

                  {/* CPU Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Cpu className="w-3 h-3" /> CPU Load</span>
                      <span className="font-mono font-medium">{shard.cpuLoad}%</span>
                    </div>
                    <Progress value={shard.cpuLoad} className="h-1.5 bg-muted" indicatorColor="bg-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nested Replica Cards */}
            <div className="flex flex-col gap-2 pl-6 relative">
              {/* Visual connection line */}
              <div className="absolute left-3 top-0 bottom-4 w-px bg-border/50" />
              
              {shard.replicas.map(replica => (
                <div key={replica.id} className="relative">
                  {/* Horizontal connection line */}
                  <div className="absolute -left-3 top-1/2 w-3 h-px bg-border/50" />
                  
                  <Card className="bg-[#121215] border-border/50 py-2 px-3 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <Server className="w-3 h-3" />
                        {replica.id}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/70">{replica.ip}</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] h-4">SYNCING</Badge>
                  </Card>
                </div>
              ))}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}

function RefreshCwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
