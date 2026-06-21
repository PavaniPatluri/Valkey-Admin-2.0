"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, WifiOff, ShieldAlert, Radio, Trash2, Ban, Skull } from "lucide-react"

type ClientConnection = {
  id: string
  name: string
  ip: string
  port: number
  idleSecs: number
  lastCommand: string
  flags: string[]
}

const mockClients: ClientConnection[] = [
  { id: "10042", name: "api-worker-production-1", ip: "10.0.1.42", port: 54321, idleSecs: 0, lastCommand: "GET", flags: ["normal"] },
  { id: "10043", name: "api-worker-production-2", ip: "10.0.1.43", port: 49152, idleSecs: 2, lastCommand: "HGETALL", flags: ["normal"] },
  { id: "9012", name: "legacy-billing-job", ip: "10.0.2.15", port: 33061, idleSecs: 450, lastCommand: "KEYS", flags: ["idle", "warning"] },
  { id: "11050", name: "valkey-admin-dashboard", ip: "10.0.0.5", port: 8080, idleSecs: 5, lastCommand: "CLIENT LIST", flags: ["admin"] },
  { id: "8001", name: "event-stream-consumer", ip: "10.0.1.99", port: 60123, idleSecs: 0, lastCommand: "XREAD", flags: ["pubsub"] },
  { id: "8002", name: "unknown-external-script", ip: "192.168.1.100", port: 4444, idleSecs: 1200, lastCommand: "FLUSHALL", flags: ["idle", "critical"] },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientConnection[]>(mockClients)
  const [blockedIps, setBlockedIps] = useState<number>(12)

  const handleKill = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id))
  }

  const handleBlockIp = (id: string, ip: string) => {
    setClients(prev => prev.filter(c => c.id !== id))
    setBlockedIps(prev => prev + 1)
  }

  const handleKillIdle = () => {
    setClients(prev => prev.filter(c => c.idleSecs < 300))
  }

  const getFlagBadge = (flag: string) => {
    switch(flag) {
      case "normal": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Normal</Badge>
      case "admin": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">Admin</Badge>
      case "pubsub": return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">Pub/Sub</Badge>
      case "idle": return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">Idle</Badge>
      case "warning": return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">Warning</Badge>
      case "critical": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] animate-pulse">Critical</Badge>
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-6 gap-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Connection Manager</h1>
          <p className="text-muted-foreground mt-1">
            Monitor, audit, and securely terminate active cluster connections.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleKillIdle}
          className="gap-2 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
        >
          <Skull className="w-4 h-4" />
          Kill All Idle Connections
        </Button>
      </div>

      {/* Connection KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{clients.length}</div>
            <p className="text-xs text-emerald-500 mt-1">Stable</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peak Connections</CardTitle>
            <WifiOff className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">1,420</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pub/Sub Subscribers</CardTitle>
            <Radio className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-purple-500">
              {clients.filter(c => c.flags.includes("pubsub")).length}
            </div>
            <p className="text-xs text-purple-500 mt-1">Listening to streams</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blocked IPs</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-destructive">{blockedIps}</div>
            <p className="text-xs text-destructive mt-1">Connections rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Client Ledger */}
      <Card className="border-border bg-card shadow-sm flex flex-col flex-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Active Client Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-t border-border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Client / Application Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Idle Time</TableHead>
                  <TableHead>Last Command</TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead className="text-right w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow className="border-border hover:bg-transparent">
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No active client connections.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id} className="border-border">
                      <TableCell className="font-mono text-muted-foreground text-xs">{client.id}</TableCell>
                      <TableCell className="font-mono text-foreground">{client.name}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">
                        {client.ip}:{client.port}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className={client.idleSecs > 300 ? "text-destructive font-bold" : client.idleSecs > 60 ? "text-amber-500" : "text-emerald-500"}>
                          {client.idleSecs}s
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-emerald-400 text-xs">{client.lastCommand}</TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 flex-wrap">
                          {client.flags.map((flag, i) => <span key={i}>{getFlagBadge(flag)}</span>)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleKill(client.id)}
                            className="h-7 px-2 text-[11px] gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                          >
                            <Trash2 className="w-3 h-3" /> Kill
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleBlockIp(client.id, client.ip)}
                            className="h-7 px-2 text-[11px] gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                          >
                            <Ban className="w-3 h-3" /> Block IP
                          </Button>
                        </div>
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
  )
}
