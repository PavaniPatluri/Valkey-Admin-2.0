"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Gauge, ZapOff, Activity, Clock, Target, Trash2 } from "lucide-react"

// Mock Data
const latencyHistogram = [
  { bucket: "< 1ms", count: 845000, color: "#10b981" }, // emerald-500
  { bucket: "1 - 5ms", count: 125000, color: "#3b82f6" }, // blue-500
  { bucket: "5 - 50ms", count: 12000, color: "#f59e0b" }, // amber-500
  { bucket: "> 50ms", count: 842, color: "#ef4444" },     // red-500
]

type SlowQuery = {
  id: string
  command: string
  count: number
  avgLatency: number
  maxLatency: number
  lastSeen: string
}

const initialSlowQueries: SlowQuery[] = [
  { id: "q1", command: "KEYS session:*", count: 142, avgLatency: 450, maxLatency: 840, lastSeen: "2 mins ago" },
  { id: "q2", command: "EVAL 'return redis.call...'", count: 89, avgLatency: 120, maxLatency: 350, lastSeen: "15 mins ago" },
  { id: "q3", command: "ZRANGE leaderboard 0 -1", count: 4200, avgLatency: 85, maxLatency: 210, lastSeen: "Just now" },
  { id: "q4", command: "HGETALL user:large_profile", count: 850, avgLatency: 65, maxLatency: 180, lastSeen: "5 mins ago" },
  { id: "q5", command: "SMEMBERS group:global_auth", count: 12, avgLatency: 45, maxLatency: 95, lastSeen: "1 hour ago" },
]

export default function ProfilerPage() {
  const [slowQueries, setSlowQueries] = useState<SlowQuery[]>(initialSlowQueries)

  const handleKill = (id: string) => {
    setSlowQueries(prev => prev.filter(q => q.id !== id))
  }

  const getCommandBadge = (cmd: string) => {
    const base = cmd.split(" ")[0]
    switch(base) {
      case "KEYS": return "bg-destructive/10 text-destructive border-destructive/20"
      case "EVAL": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "ZRANGE": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "HGETALL": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default: return "bg-muted text-foreground"
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-xl">
          <p className="text-muted-foreground text-sm font-semibold mb-1">{label}</p>
          <p className="text-foreground font-mono text-lg">
            {payload[0].value.toLocaleString()} <span className="text-xs text-muted-foreground">queries</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-6 gap-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Query Performance Profiler</h1>
        <p className="text-muted-foreground mt-1">
          Identify slow commands, visualize latency distributions, and pinpoint bottlenecks.
        </p>
      </div>

      {/* Global Latency KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">p50 Latency</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">1.2<span className="text-lg text-muted-foreground ml-1">ms</span></div>
            <p className="text-xs text-emerald-500 mt-1">Healthy distribution</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">p95 Latency</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">5.8<span className="text-lg text-muted-foreground ml-1">ms</span></div>
            <p className="text-xs text-muted-foreground mt-1">Slight long-tail observed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">p99 Latency</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-amber-500">45.2<span className="text-lg opacity-50 ml-1">ms</span></div>
            <p className="text-xs text-amber-500 mt-1">Impacting 1% of traffic</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Max Latency</CardTitle>
            <Gauge className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-destructive">840<span className="text-lg opacity-50 ml-1">ms</span></div>
            <p className="text-xs text-destructive mt-1">Critical blocking query detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        {/* Latency Histogram */}
        <Card className="col-span-1 lg:col-span-3 border-border bg-card shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latency Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Logarithmic spread of query execution times across the cluster.</p>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyHistogram} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="bucket" 
                  stroke="#888" 
                  tick={{ fill: '#888' }} 
                  axisLine={{ stroke: '#333' }}
                />
                <YAxis 
                  scale="log" 
                  domain={['auto', 'auto']} 
                  stroke="#888" 
                  tick={{ fill: '#888' }}
                  axisLine={{ stroke: '#333' }}
                  tickFormatter={(val) => {
                    if (val >= 1000000) return `${val / 1000000}M`
                    if (val >= 1000) return `${val / 1000}k`
                    return val
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#222', opacity: 0.4 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {latencyHistogram.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Slow Query Ledger */}
        <Card className="col-span-1 lg:col-span-3 border-border bg-card shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Slow Query Ledger</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Absolute slowest commands currently executing.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border-t border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[300px]">Command Signature</TableHead>
                    <TableHead className="text-right">Exec Count</TableHead>
                    <TableHead className="text-right">Avg Latency</TableHead>
                    <TableHead className="text-right">Max Latency</TableHead>
                    <TableHead className="text-right">Last Seen</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slowQueries.length === 0 ? (
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        <ZapOff className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        No slow queries detected in the current window.
                      </TableCell>
                    </TableRow>
                  ) : (
                    slowQueries.map((query) => (
                      <TableRow key={query.id} className="border-border">
                        <TableCell className="font-mono">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`text-[10px] w-16 justify-center ${getCommandBadge(query.command)}`}>
                              {query.command.split(" ")[0]}
                            </Badge>
                            <span className="text-emerald-400 truncate max-w-[200px]" title={query.command}>
                              {query.command}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {query.count.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className={query.avgLatency > 50 ? "text-amber-500" : ""}>
                            {query.avgLatency}ms
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold">
                          <span className={query.maxLatency > 100 ? "text-destructive" : ""}>
                            {query.maxLatency}ms
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                          {query.lastSeen}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleKill(query.id)}
                            className="h-7 text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" /> Kill
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
