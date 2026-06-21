"use client"

import { useState, useMemo, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, Activity, Cpu, Server, Database } from "lucide-react"

type TimeWindow = "1h" | "24h" | "7d" | "30d"

interface MetricSnapshot {
  time: string
  timestamp: number
  cpu: number
  memory: number
  connections: number
}

// Generate realistic mock data based on the selected window
const generateData = (window: TimeWindow): MetricSnapshot[] => {
  const data: MetricSnapshot[] = []
  const now = Date.now()
  let count = 0
  let intervalMs = 0

  switch (window) {
    case "1h":
      count = 60
      intervalMs = 60 * 1000 // 1 minute
      break
    case "24h":
      count = 144
      intervalMs = 10 * 60 * 1000 // 10 minutes
      break
    case "7d":
      count = 1008 // 10 minute intervals for 7 days
      intervalMs = 10 * 60 * 1000 // 10 minutes
      break
    case "30d":
      count = 720 // 1 hour intervals for 30 days
      intervalMs = 60 * 60 * 1000 // 1 hour
      break
  }

  // Base values
  let cpu = 40
  let memory = 60
  let connections = 12000

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * intervalMs
    const date = new Date(timestamp)
    
    // Format time differently based on window
    const timeStr = window === "1h" || window === "24h" 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : `${date.getMonth()+1}/${date.getDate()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    // Introduce anomalies
    const isOutage = window === "7d" && i > 50 && i < 60 // Fake outage in the past week
    const isSpike = window === "24h" && i > 100 && i < 110

    if (isOutage) {
      cpu = Math.min(100, cpu + 30)
      memory = Math.min(100, memory + 20)
      connections = Math.max(0, connections - 5000)
    } else if (isSpike) {
      cpu = 95
      memory = 90
      connections = 25000
    } else {
      cpu = Math.max(10, Math.min(100, cpu + (Math.random() * 10 - 5)))
      memory = Math.max(20, Math.min(100, memory + (Math.random() * 5 - 2.5)))
      connections = Math.max(5000, Math.min(30000, connections + (Math.random() * 2000 - 1000)))
    }

    data.push({
      time: timeStr,
      timestamp,
      cpu: Number(cpu.toFixed(1)),
      memory: Number(memory.toFixed(1)),
      connections: Math.floor(connections)
    })
  }

  return data
}

export default function MetricsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [window, setWindow] = useState<TimeWindow>("24h")
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const data = useMemo(() => isMounted ? generateData(window) : [], [window, isMounted])
  const [sliderIndex, setSliderIndex] = useState(0)

  // Reset slider when window changes
  useMemo(() => {
    if (data.length > 0) setSliderIndex(data.length - 1)
  }, [data.length])

  const safeIndex = Math.min(sliderIndex, Math.max(0, data.length - 1))
  const snapshot = data.length > 0 ? (data[safeIndex] || data[data.length - 1]) : null

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-4 w-96 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="h-24 bg-muted rounded-xl"></div>
            <div className="h-24 bg-muted rounded-xl"></div>
            <div className="h-24 bg-muted rounded-xl"></div>
            <div className="h-24 bg-muted rounded-xl"></div>
          </div>
          <div className="h-[500px] w-full bg-muted rounded-xl mt-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Travel Metrics</h1>
          <p className="text-muted-foreground mt-2">
            Replay historical cluster states and investigate past incidents.
          </p>
        </div>
        
        <ToggleGroup type="single" value={window} onValueChange={(val) => val && setWindow(val as TimeWindow)} className="bg-muted/50 p-1 rounded-xl">
          <ToggleGroupItem value="1h" aria-label="1 Hour" className="rounded-lg data-[state=on]:bg-background data-[state=on]:shadow-sm">
            1h
          </ToggleGroupItem>
          <ToggleGroupItem value="24h" aria-label="24 Hours" className="rounded-lg data-[state=on]:bg-background data-[state=on]:shadow-sm">
            24h
          </ToggleGroupItem>
          <ToggleGroupItem value="7d" aria-label="7 Days" className="rounded-lg data-[state=on]:bg-background data-[state=on]:shadow-sm">
            7d
          </ToggleGroupItem>
          <ToggleGroupItem value="30d" aria-label="30 Days" className="rounded-lg data-[state=on]:bg-background data-[state=on]:shadow-sm">
            30d
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Snapshot Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-sm col-span-1 md:col-span-4 bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Snapshot Timestamp</p>
                <p suppressHydrationWarning className="text-2xl font-bold font-mono text-foreground">
                  {snapshot ? new Date(snapshot.timestamp).toLocaleString() : 'Loading...'}
                </p>
              </div>
            </div>
            {sliderIndex < data.length - 1 && (
              <Button variant="outline" size="sm" onClick={() => setSliderIndex(data.length - 1)}>
                Jump to Live
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4" /> CPU Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {snapshot?.cpu ?? 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Database className="w-4 h-4" /> Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {snapshot?.memory ?? 0} GB
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" /> Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {snapshot?.connections?.toLocaleString() ?? 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Server className="w-4 h-4" /> Active Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {(snapshot?.connections ?? 0) < 10000 && window === '7d' ? '12 (Degraded)' : '24'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrubber */}
      <div className="px-2 py-4">
        <Slider 
          value={[safeIndex]} 
          max={data.length - 1} 
          step={1}
          onValueChange={(vals) => setSliderIndex(vals[0])}
          className="cursor-ew-resize"
        />
      </div>

      {/* Stacked Charts */}
      <div className="flex flex-col gap-6 flex-1 min-h-[500px]">
        {/* CPU Chart */}
        <Card className="flex-1 bg-card border-border shadow-sm p-4 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} syncId="timeTravel">
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090B', borderColor: '#27272A', borderRadius: '8px' }}
                itemStyle={{ color: '#E4E4E7' }}
                labelStyle={{ color: '#A1A1AA' }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCpu)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Memory Chart */}
        <Card className="flex-1 bg-card border-border shadow-sm p-4 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} syncId="timeTravel">
              <defs>
                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090B', borderColor: '#27272A', borderRadius: '8px' }}
                itemStyle={{ color: '#E4E4E7' }}
                labelStyle={{ color: '#A1A1AA' }}
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMem)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Connections Chart */}
        <Card className="flex-1 bg-card border-border shadow-sm p-4 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} syncId="timeTravel">
              <defs>
                <linearGradient id="colorConn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" tick={{fill: '#71717A', fontSize: 12}} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090B', borderColor: '#27272A', borderRadius: '8px' }}
                itemStyle={{ color: '#E4E4E7' }}
                labelStyle={{ color: '#A1A1AA' }}
              />
              <Area 
                type="monotone" 
                dataKey="connections" 
                stroke="#10B981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorConn)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
