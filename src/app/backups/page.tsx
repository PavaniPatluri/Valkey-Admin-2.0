"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import { Database, HardDrive, CheckCircle2, Save, Download, RotateCcw, Trash2, Clock, AlertTriangle } from "lucide-react"

type BackupFile = {
  id: string
  filename: string
  date: string
  type: "Manual" | "Auto"
  size: string
  status: "Verified" | "Pending" | "Failed"
}

const mockBackups: BackupFile[] = [
  { id: "b1", filename: "dump-20240512-1400.rdb", date: "Today, 14:00", type: "Auto", size: "4.2 GB", status: "Verified" },
  { id: "b2", filename: "dump-20240512-0200.rdb", date: "Today, 02:00", type: "Auto", size: "4.1 GB", status: "Verified" },
  { id: "b3", filename: "manual-pre-deploy.rdb", date: "Yesterday, 18:30", type: "Manual", size: "4.0 GB", status: "Verified" },
  { id: "b4", filename: "dump-20240511-0200.rdb", date: "Yesterday, 02:00", type: "Auto", size: "3.9 GB", status: "Verified" },
  { id: "b5", filename: "dump-corrupted.rdb", date: "May 10, 02:00", type: "Auto", size: "1.2 MB", status: "Failed" },
]

export default function BackupsPage() {
  const [backups, setBackups] = useState<BackupFile[]>(mockBackups)
  const [aofEnabled, setAofEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Restore Modal State
  const [restoreTarget, setRestoreTarget] = useState<BackupFile | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleManualSave = () => {
    setIsSaving(true)
    
    // Create a pending backup
    const newBackup: BackupFile = {
      id: `b${Date.now()}`,
      filename: `manual-save-${new Date().getTime()}.rdb`,
      date: "Just now",
      type: "Manual",
      size: "Calculating...",
      status: "Pending"
    }
    
    setBackups(prev => [newBackup, ...prev])

    // Simulate completion after 3 seconds
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === newBackup.id 
          ? { ...b, size: "4.3 GB", status: "Verified" } 
          : b
      ))
      setIsSaving(false)
    }, 3000)
  }

  const handleDelete = (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id))
  }

  const confirmRestore = () => {
    if (!restoreTarget) return
    setIsRestoring(true)
    
    // Simulate restore taking some time
    setTimeout(() => {
      setIsRestoring(false)
      setRestoreTarget(null)
      // In a real app we'd show a success toast here
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Verified": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Verified</Badge>
      case "Pending": return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] animate-pulse">Saving...</Badge>
      case "Failed": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Failed</Badge>
      default: return null
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full max-w-7xl mx-auto w-full p-6 gap-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup & Restore Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage RDB snapshots, configure AOF persistence, and secure your cluster data.
          </p>
        </div>
        <Button 
          onClick={handleManualSave}
          disabled={isSaving}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          {isSaving ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "BGSAVE in progress..." : "Trigger Manual BGSAVE"}
        </Button>
      </div>

      {/* Persistence KPIs & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{backups.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Available snapshots</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">20.5<span className="text-lg text-muted-foreground ml-1">GB</span></div>
            <p className="text-xs text-emerald-500 mt-1">Across all files</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Successful</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-foreground tracking-tight">Today</div>
            <p className="text-xs text-muted-foreground mt-1">14:00 (Auto)</p>
          </CardContent>
        </Card>

        {/* AOF Toggle Control */}
        <Card className={`border-border shadow-sm transition-colors ${aofEnabled ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">AOF Persistence</CardTitle>
            <Switch 
              checked={aofEnabled} 
              onCheckedChange={setAofEnabled}
              className="data-[state=checked]:bg-primary"
            />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {aofEnabled ? 'Enabled (fsync)' : 'Disabled'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {aofEnabled ? 'Data appended every second.' : 'RDB snapshots only.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Snapshot Ledger */}
      <Card className="border-border bg-card shadow-sm flex flex-col flex-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Historical RDB Snapshots</CardTitle>
          <CardDescription>A complete log of all automated and manual database dumps.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <div className="rounded-md border-t border-border overflow-auto h-full">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[250px]">Filename</TableHead>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">File Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-[240px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.length === 0 ? (
                  <TableRow className="border-border hover:bg-transparent">
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <HardDrive className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No backups available.
                    </TableCell>
                  </TableRow>
                ) : (
                  backups.map((backup) => (
                    <TableRow key={backup.id} className="border-border">
                      <TableCell className="font-mono font-medium text-foreground">
                        {backup.filename}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1.5">
                        <Clock className="w-3.5 h-3.5" /> {backup.date}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs ${backup.type === 'Manual' ? 'text-primary' : 'text-muted-foreground'}`}>
                          {backup.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {backup.size}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(backup.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={backup.status !== 'Verified'}
                            className="h-8 px-2.5 text-xs gap-1.5 border-border hover:bg-muted"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setRestoreTarget(backup)}
                            disabled={backup.status !== 'Verified'}
                            className="h-8 px-2.5 text-xs gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(backup.id)}
                            className="h-8 px-2.5 text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Restore Confirmation Dialog */}
      <Dialog open={!!restoreTarget} onOpenChange={(open) => !open && setRestoreTarget(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Confirm Destructive Action
            </DialogTitle>
            <DialogDescription className="pt-3 pb-2 text-muted-foreground">
              You are about to restore the cluster from the snapshot: <br />
              <strong className="text-foreground font-mono mt-1 block">{restoreTarget?.filename}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive font-medium">
            This will completely overwrite the current cluster dataset. All data generated after {restoreTarget?.date} will be permanently lost.
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setRestoreTarget(null)} disabled={isRestoring}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmRestore} 
              disabled={isRestoring}
              className="gap-2"
            >
              {isRestoring ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              {isRestoring ? "Restoring Dataset..." : "Yes, Restore Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
