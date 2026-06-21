"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts"
import { AlertTriangle, ShieldAlert, Bot, CheckCircle2, ChevronRight, Zap, XOctagon } from "lucide-react"

type Severity = "Critical" | "Warning" | "Info"
type Status = "Active" | "Resolved"

interface Incident {
  id: string
  title: string
  severity: Severity
  status: Status
  time: string
  metricData: any[]
  aiAnalysis: string
  actions: { label: string; variant: "default" | "destructive" | "outline" }[]
}

const mockMetricSpike = Array.from({ length: 20 }, (_, i) => ({
  value: i > 12 ? 95 + Math.random() * 5 : 40 + Math.random() * 10
}))

const mockMetricDrop = Array.from({ length: 20 }, (_, i) => ({
  value: i > 15 ? Math.random() * 5 : 80 + Math.random() * 10
}))

const initialIncidents: Incident[] = [
  {
    id: "INC-9042",
    title: "Critical Memory Exhaustion Risk",
    severity: "Critical",
    status: "Active",
    time: "2 mins ago",
    metricData: mockMetricSpike,
    aiAnalysis: "I've detected a sudden 140% spike in memory utilization originating from the `session_cache:*` namespace. This correlates with a massive influx of `HSET` commands from IP `10.0.1.45`. The cluster is currently at 94% memory capacity. If this trajectory continues, OOM kills will begin in approximately 4 minutes.",
    actions: [
      { label: "Trigger Eviction (LRU)", variant: "default" },
      { label: "Block IP 10.0.1.45", variant: "destructive" },
    ]
  },
  {
    id: "INC-9041",
    title: "Event Loop Blocking Detected",
    severity: "Warning",
    status: "Active",
    time: "15 mins ago",
    metricData: mockMetricSpike,
    aiAnalysis: "Execution latency has spiked to >500ms. I traced this back to a rogue `KEYS *` command being executed sequentially by the `reporting-worker` service. This is blocking the main event loop.",
    actions: [
      { label: "Kill Slow Queries", variant: "destructive" },
      { label: "View Command Logs", variant: "outline" },
    ]
  },
  {
    id: "INC-9038",
    title: "Replica Disconnect (Node-14)",
    severity: "Critical",
    status: "Resolved",
    time: "2 hours ago",
    metricData: mockMetricDrop,
    aiAnalysis: "Replica `Node-14` dropped connection due to a network partition. The AI automatically initiated a failover to `Node-15`. The cluster is stable, but `Node-14` requires manual inspection before rejoining.",
    actions: [
      { label: "Inspect Node-14 Logs", variant: "outline" }
    ]
  }
]

export default function AlertsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [selectedId, setSelectedId] = useState<string>(incidents[0].id)

  const selectedIncident = incidents.find(i => i.id === selectedId)

  const handleResolve = (id: string) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status: "Resolved" } : inc
    ))
  }

  const getSeverityIcon = (sev: Severity) => {
    switch (sev) {
      case "Critical": return <XOctagon className="w-5 h-5 text-destructive" />
      case "Warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case "Info": return <ShieldAlert className="w-5 h-5 text-blue-500" />
    }
  }

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case "Critical": return "bg-destructive/10 border-destructive/20 text-destructive"
      case "Warning": return "bg-amber-500/10 border-amber-500/20 text-amber-500"
      case "Info": return "bg-blue-500/10 border-blue-500/20 text-blue-500"
    }
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-6 gap-6 overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          AI Incident Investigator <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/20">Beta</Badge>
        </h1>
        <p className="text-muted-foreground mt-1">
          Automated root cause analysis and one-click remediations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Pane: Incident Feed */}
        <Card className="col-span-1 md:col-span-4 lg:col-span-4 flex flex-col border-border bg-card shadow-sm overflow-hidden h-full">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="font-semibold text-sm">Active Incidents ({incidents.filter(i => i.status === 'Active').length})</h3>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedId(inc.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm flex gap-3 transition-colors ${
                    selectedId === inc.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-background hover:bg-muted/50 border border-border'
                  } ${inc.status === 'Resolved' ? 'opacity-60' : ''}`}
                >
                  <div className="mt-0.5">
                    {inc.status === 'Resolved' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : getSeverityIcon(inc.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold truncate pr-2 text-foreground">{inc.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getSeverityColor(inc.severity)}`}>
                        {inc.severity}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">{inc.time}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Pane: AI Investigator */}
        <Card className="col-span-1 md:col-span-8 lg:col-span-8 flex flex-col border-border bg-card shadow-sm overflow-hidden h-full relative">
          {selectedIncident ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border bg-background">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{selectedIncident.id}</span>
                      {selectedIncident.status === 'Resolved' ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Resolved</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Active Investigation</Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedIncident.title}</h2>
                  </div>
                  {selectedIncident.status === 'Active' && (
                    <Button onClick={() => handleResolve(selectedIncident.id)} variant="outline" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                    </Button>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 bg-muted/10 p-6">
                <div className="max-w-2xl mx-auto space-y-8 pb-10">
                  
                  {/* AI Analysis Block (Copilot Style) */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center border border-primary/30 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">Root Cause Analysis</h4>
                        <div className="bg-background border border-border rounded-xl p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                          {selectedIncident.aiAnalysis}
                        </div>
                      </div>

                      {/* Contextual Chart Snippet */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Metric Context</h4>
                        <div className="h-32 bg-background border border-border rounded-xl p-3 shadow-sm">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={selectedIncident.metricData}>
                              <defs>
                                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={selectedIncident.severity === 'Critical' ? '#EF4444' : '#F59E0B'} stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor={selectedIncident.severity === 'Critical' ? '#EF4444' : '#F59E0B'} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <YAxis hide domain={['auto', 'auto']} />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={selectedIncident.severity === 'Critical' ? '#EF4444' : '#F59E0B'} 
                                strokeWidth={2}
                                fill="url(#colorMetric)" 
                                isAnimationActive={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Remediation Actions */}
                      {selectedIncident.status === 'Active' && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-primary" /> Suggested Remediations
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedIncident.actions.map((action, i) => (
                              <Button 
                                key={i} 
                                variant={action.variant} 
                                onClick={() => handleResolve(selectedIncident.id)}
                                className={action.variant === 'destructive' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20' : ''}
                              >
                                {action.label} <ChevronRight className="w-4 h-4 ml-1 opacity-50" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </ScrollArea>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
              <p>Select an incident to view the AI investigation report.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
