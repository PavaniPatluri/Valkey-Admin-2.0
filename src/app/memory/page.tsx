"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line 
} from "recharts"
import { HardDrive, TrendingUp, AlertTriangle, RefreshCw, Trash2 } from "lucide-react"

// Mock Data
const memoryByType = [
  { name: "Strings", value: 4.2, color: "#10b981" }, // emerald-500
  { name: "Hashes", value: 2.8, color: "#3b82f6" },  // blue-500
  { name: "Sets", value: 1.5, color: "#8b5cf6" },    // violet-500
  { name: "ZSets", value: 1.1, color: "#f59e0b" },   // amber-500
  { name: "Lists", value: 0.4, color: "#ec4899" },   // pink-500
]

const topNamespaces = [
  { name: "session:*", value: 3.2, fill: "#3b82f6" },
  { name: "cache:api:*", value: 2.1, fill: "#10b981" },
  { name: "user:profile:*", value: 1.8, fill: "#8b5cf6" },
  { name: "leaderboard:*", value: 1.2, fill: "#f59e0b" },
  { name: "config:*", value: 0.5, fill: "#ec4899" },
]

const evictionTrends = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  evicted: Math.floor(Math.random() * 500) + (i === 14 ? 4500 : 0), // Spike at 14:00
  expired: Math.floor(Math.random() * 1200) + 500
}))

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 40;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
  if (percent < 0.05) return null; // Don't label tiny slices

  return (
    <text x={x} y={y} fill="currentColor" className="text-xs font-medium fill-muted-foreground" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function MemoryAnalyzerPage() {
  const [isPurging, setIsPurging] = useState(false)

  const handlePurge = () => {
    setIsPurging(true)
    setTimeout(() => {
      setIsPurging(false)
      // In a real app, this would trigger a toast and refetch data
    }, 1500)
  }

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full p-6 gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Memory Analyzer</h1>
          <p className="text-muted-foreground mt-1">
            Deep dive into allocation, fragmentation, and eviction trends.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handlePurge}
          disabled={isPurging}
          className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          {isPurging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {isPurging ? "Purging..." : "Memory Purge (GC)"}
        </Button>
      </div>

      {/* Global Memory KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Used Memory</CardTitle>
            <HardDrive className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">10.0<span className="text-lg text-muted-foreground ml-1">GB</span></div>
            <p className="text-xs text-emerald-500 mt-1">62% of system total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peak Memory</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">12.4<span className="text-lg text-muted-foreground ml-1">GB</span></div>
            <p className="text-xs text-muted-foreground mt-1">Recorded 4 days ago</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fragmentation Ratio</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-amber-500">1.45</div>
            <p className="text-xs text-amber-500 mt-1">Elevated overhead detected</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evicted Keys (24h)</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">4,520</div>
            <p className="text-xs text-muted-foreground mt-1">Due to maxmemory limits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Distribution Donut */}
        <Card className="border-border bg-card shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Allocation by Data Type</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={memoryByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={true}
                >
                  {memoryByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} GB`, 'Memory Used']}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Namespaces BarChart */}
        <Card className="border-border bg-card shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Namespaces</CardTitle>
            <p className="text-sm text-muted-foreground">Largest prefixes consuming memory.</p>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topNamespaces} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value} GB`, 'Memory']}
                  cursor={{ fill: '#222', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Eviction Trends */}
      <Card className="border-border bg-card shadow-sm flex flex-col">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Eviction & Expiration Trends (24h)</CardTitle>
            <p className="text-sm text-muted-foreground">Track TTL expirations vs. forced maxmemory evictions.</p>
          </div>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Eviction Spike Detected</Badge>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evictionTrends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="time" stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="expired" name="Normal Expirations" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="evicted" name="Forced Evictions" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
}
