"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Play, Pause, Trash2, Activity, Terminal } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  command: string
  args: string
  latency: number
  clientIp: string
}

const COMMANDS = ["GET", "SET", "HGETALL", "ZRANGE", "SADD", "XADD", "EVAL", "PING", "DEL", "SCAN"]
const KEYS = ["session:user:1042", "config:feature_flags", "cache:api:users", "leaderboard:global", "system:logs", "user:90210:cart"]

function generateMockLog(): LogEntry {
  const cmd = COMMANDS[Math.floor(Math.random() * COMMANDS.length)]
  const key = KEYS[Math.floor(Math.random() * KEYS.length)]
  let latency = Math.random() * 5
  
  // Occasional slow queries
  if (Math.random() > 0.95) {
    latency = 50 + Math.random() * 200
  }

  // Generate some realistic args
  let args = key
  if (cmd === "SET") args += ` "value_${Math.floor(Math.random() * 1000)}"`
  else if (cmd === "XADD") args += ` * event "login" user_id 1042`
  else if (cmd === "EVAL") args = `"return redis.call('get', KEYS[1])" 1 ${key}`

  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    command: cmd,
    args: args,
    latency: Number(latency.toFixed(2)),
    clientIp: `10.0.1.${Math.floor(Math.random() * 255)}`
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [search, setSearch] = useState("")
  
  const maxLogs = 500

  useEffect(() => {
    if (isPaused) return

    // Generate multiple logs per second (e.g. interval every 200ms)
    const interval = setInterval(() => {
      // Sometimes push 1 log, sometimes push 3 at once to simulate bursty traffic
      const burstCount = Math.floor(Math.random() * 3) + 1
      const newLogs = Array.from({ length: burstCount }, generateMockLog)
      
      setLogs(prev => {
        // Prepend new logs to the top
        const combined = [...newLogs, ...prev]
        if (combined.length > maxLogs) {
          return combined.slice(0, maxLogs)
        }
        return combined
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isPaused])

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs
    const lowerSearch = search.toLowerCase()
    return logs.filter(l => 
      l.command.toLowerCase().includes(lowerSearch) || 
      l.args.toLowerCase().includes(lowerSearch) ||
      l.clientIp.includes(lowerSearch)
    )
  }, [logs, search])

  const getLatencyColor = (latency: number) => {
    if (latency < 5) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    if (latency < 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    return "text-destructive bg-destructive/10 border-destructive/20"
  }

  const getCommandColor = (cmd: string) => {
    if (["GET", "HGETALL", "ZRANGE", "SCAN", "PING"].includes(cmd)) return "text-blue-400"
    if (["SET", "SADD", "XADD"].includes(cmd)) return "text-emerald-400"
    if (["DEL"].includes(cmd)) return "text-destructive"
    if (["EVAL"].includes(cmd)) return "text-purple-400"
    return "text-foreground"
  }

  return (
    <div className="flex flex-1 flex-col h-full max-w-7xl mx-auto w-full p-6 gap-6 overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Command Logs</h1>
        <p className="text-muted-foreground mt-1">
          Monitor real-time traffic to your cluster.
        </p>
      </div>

      <Card className="flex flex-col flex-1 border-border bg-card shadow-sm overflow-hidden min-h-0">
        {/* Control Bar */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by command, key, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border focus-visible:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant={isPaused ? "default" : "secondary"} 
              size="sm" 
              onClick={() => setIsPaused(!isPaused)}
              className="gap-2 w-full sm:w-auto"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "Resume Stream" : "Pause Stream"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLogs([])}
              className="gap-2 border-border hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 border-b border-border bg-background/50 flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Activity className={`w-3.5 h-3.5 ${isPaused ? 'text-muted-foreground' : 'text-emerald-500 animate-pulse'}`} />
            {isPaused ? 'STREAM PAUSED' : 'STREAM ACTIVE'}
          </span>
          <span>|</span>
          <span>BUFFER: {logs.length} / {maxLogs}</span>
          {search && (
            <>
              <span>|</span>
              <span className="text-primary">SHOWING: {filteredLogs.length}</span>
            </>
          )}
        </div>

        {/* Log Viewer */}
        <div className="flex-1 overflow-y-auto bg-[#09090B]">
          <div className="p-4 font-mono text-sm">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground py-12 opacity-50">
                <Terminal className="w-12 h-12 mb-4" />
                <p>Waiting for commands...</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex flex-wrap items-start sm:items-center gap-x-3 gap-y-1 py-1 hover:bg-muted/30 transition-colors rounded px-2 -mx-2">
                    <span className="text-muted-foreground/60 text-xs min-w-[190px] shrink-0">
                      {new Date(log.timestamp).toISOString().replace('T', ' ').replace('Z', '')}
                    </span>
                    
                    <span className="text-muted-foreground/80 text-xs min-w-[90px] shrink-0">
                      [{log.clientIp}]
                    </span>

                    <Badge variant="outline" className={`min-w-[65px] justify-center px-1 text-[10px] font-mono h-5 ${getLatencyColor(log.latency)} shrink-0`}>
                      {log.latency}ms
                    </Badge>
                    
                    <span className={`font-bold min-w-[70px] shrink-0 ${getCommandColor(log.command)}`}>
                      {log.command}
                    </span>
                    
                    <span className="text-emerald-400/90 break-all">
                      {log.args}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
