"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Database, Clock, RefreshCw, Trash2, Edit2, Play } from "lucide-react"

type ValkeyType = "string" | "hash" | "list" | "set" | "zset" | "stream"

interface ValkeyKey {
  name: string
  type: ValkeyType
  size: string
  ttl: number // seconds, -1 for no expiry
  value: string
}

const mockKeys: ValkeyKey[] = [
  { name: "session:user:1042", type: "hash", size: "1.2 KB", ttl: 3600, value: '{\n  "id": 1042,\n  "username": "alice",\n  "role": "admin",\n  "lastLogin": "2024-05-12T08:30:00Z"\n}' },
  { name: "session:user:1043", type: "hash", size: "1.1 KB", ttl: 1200, value: '{\n  "id": 1043,\n  "username": "bob",\n  "role": "editor"\n}' },
  { name: "config:feature_flags", type: "string", size: "450 B", ttl: -1, value: '{"newDashboard":true,"betaAI":false,"maxUploadMB":50}' },
  { name: "cache:api:users:list", type: "string", size: "4.5 MB", ttl: 300, value: '[{"id":1,"name":"Alice"},...4999 more]' },
  { name: "metrics:daily_active", type: "set", size: "800 KB", ttl: -1, value: '1042\n1043\n1044\n1045\n1046' },
  { name: "leaderboard:global", type: "zset", size: "2.4 MB", ttl: -1, value: '1) "alice" (9500)\n2) "charlie" (8200)\n3) "bob" (7100)' },
  { name: "system:logs:error", type: "stream", size: "15 MB", ttl: -1, value: '1715494800000-0: type="Timeout" msg="Database disconnected"\n1715494812000-0: type="Auth" msg="Invalid token"' },
  { name: "queue:email_jobs", type: "list", size: "5.1 KB", ttl: -1, value: '1) {"to":"alice@example.com","template":"welcome"}\n2) {"to":"bob@example.com","template":"reset_pwd"}' },
  { name: "cache:html:homepage", type: "string", size: "45 KB", ttl: 60, value: '<!DOCTYPE html>\n<html lang="en">\n<head>...</head>\n<body>...</body>\n</html>' },
  { name: "ratelimit:ip:192.168.1.1", type: "string", size: "8 B", ttl: 55, value: '42' },
]

export default function ExplorerPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedKey, setSelectedKey] = useState<ValkeyKey | null>(mockKeys[0])

  const filteredKeys = useMemo(() => {
    return mockKeys.filter(k => {
      const matchesSearch = k.name.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === "all" || k.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [search, typeFilter])

  const getTypeColor = (type: ValkeyType) => {
    switch (type) {
      case "string": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "hash": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "list": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "set": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "zset": return "bg-pink-500/10 text-pink-500 border-pink-500/20"
      case "stream": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full overflow-hidden p-6 gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Explorer</h1>
        <p className="text-muted-foreground mt-1">
          Browse, search, and inspect keys within your Valkey cluster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Pane: Key List */}
        <Card className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col border-border bg-card shadow-sm overflow-hidden h-full">
          <div className="p-4 border-b border-border space-y-3 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keys..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-border focus-visible:ring-primary"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="hash">Hash</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="set">Set</SelectItem>
                <SelectItem value="zset">Sorted Set (ZSet)</SelectItem>
                <SelectItem value="stream">Stream</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground font-medium px-1 pt-1">
              {filteredKeys.length} keys found
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredKeys.map((k) => (
                <button
                  key={k.name}
                  onClick={() => setSelectedKey(k)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex flex-col gap-1.5 transition-colors ${
                    selectedKey?.name === k.name 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between truncate w-full">
                    <span className="font-mono truncate font-medium text-foreground">{k.name}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 uppercase tracking-wider ${getTypeColor(k.type)}`}>
                      {k.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{k.size}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Pane: Inspector */}
        <Card className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col border-border bg-card shadow-sm overflow-hidden h-full">
          {selectedKey ? (
            <>
              <div className="p-5 border-b border-border bg-muted/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold font-mono text-foreground break-all">{selectedKey.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-primary" /> {selectedKey.size}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" /> {selectedKey.ttl === -1 ? 'Persistent' : `${selectedKey.ttl}s`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border hover:bg-muted">
                    <RefreshCw className="w-3.5 h-3.5" /> Reload
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border hover:bg-muted">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 border-destructive/20 text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 bg-background/50 relative">
                {/* Simulated Monospace Editor */}
                <ScrollArea className="absolute inset-0 h-full w-full">
                  <div className="p-4 md:p-6 min-h-full">
                    <pre className="font-mono text-sm leading-relaxed text-emerald-400 whitespace-pre-wrap break-all selection:bg-primary/30">
                      {selectedKey.value}
                    </pre>
                  </div>
                </ScrollArea>
              </div>
              
              <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>UTF-8 Encoding</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Copy to clipboard</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a key from the list to inspect its contents.</p>
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
