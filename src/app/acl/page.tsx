"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield, Key, UserCheck, ShieldAlert, Plus, ShieldCheck, KeyRound, Copy, Trash2, Settings2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type AclUser = {
  id: string
  username: string
  isActive: boolean
  keyspace: string
  commands: string[]
  isDefault?: boolean
}

const initialUsers: AclUser[] = [
  { id: "u1", username: "default", isActive: true, keyspace: "~*", commands: ["+@all"], isDefault: true },
  { id: "u2", username: "api_worker_prod", isActive: true, keyspace: "~app:prod:*", commands: ["+@read", "+@write", "-@admin", "-@dangerous"] },
  { id: "u3", username: "data_analyst", isActive: true, keyspace: "~*", commands: ["+@read", "-@write", "-@admin"] },
  { id: "u4", username: "legacy_sync", isActive: false, keyspace: "~legacy:*", commands: ["+get", "+set"] },
]

export default function AclManagerPage() {
  const [users, setUsers] = useState<AclUser[]>(initialUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // New User Form State
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u))
  }

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let pwd = ""
    for(let i=0; i<24; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    setNewPassword(pwd)
  }

  const handleCreateUser = () => {
    if(!newUsername) return
    const newUser: AclUser = {
      id: `u${Date.now()}`,
      username: newUsername,
      isActive: true,
      keyspace: "~*",
      commands: ["+@read"]
    }
    setUsers([...users, newUser])
    setIsDialogOpen(false)
    setNewUsername("")
    setNewPassword("")
  }

  const renderCommandBadge = (cmd: string) => {
    if (cmd.includes("+@all") || cmd.includes("+@admin")) {
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-mono text-[10px]">{cmd}</Badge>
    }
    if (cmd.startsWith("+")) {
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-[10px]">{cmd}</Badge>
    }
    if (cmd.startsWith("-")) {
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono text-[10px]">{cmd}</Badge>
    }
    return <Badge variant="outline" className="font-mono text-[10px]">{cmd}</Badge>
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-6 gap-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ACL & Security Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage Role-Based Access Control, generate secure credentials, and enforce least-privilege.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <Plus className="w-4 h-4" /> Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                Create New ACL User
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g., reporting_service"
                  className="bg-[#121215] border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Secure Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPassword}
                    readOnly
                    placeholder="Click generate ->"
                    className="flex-1 bg-[#121215] border border-border rounded-md px-3 py-2 text-sm font-mono text-muted-foreground focus:outline-none"
                  />
                  <Button variant="outline" onClick={generatePassword} className="shrink-0 border-border">
                    <KeyRound className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Permissions</label>
                <div className="p-3 bg-muted/30 border border-border rounded-md text-xs font-mono text-muted-foreground">
                  ~* +@read -@write -@admin
                </div>
                <p className="text-[10px] text-muted-foreground">Permissions can be modified after creation.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateUser}>Provision User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{users.filter(u=>u.isActive).length} currently active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active ACL Rules</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">14</div>
            <p className="text-xs text-emerald-500 mt-1">Enforced across cluster</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Auth Attempts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-destructive">42</div>
            <p className="text-xs text-destructive mt-1">In the last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Keys Rotated</CardTitle>
            <Key className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">2</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* User Ledger Table */}
      <Card className="border-border bg-card shadow-sm flex flex-col flex-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Configured ACL Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-t border-border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Username</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keyspace Access</TableHead>
                  <TableHead>Command Rules</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className={`border-border ${!user.isActive ? 'opacity-50 grayscale' : ''}`}>
                    <TableCell className="font-medium text-foreground flex items-center gap-2">
                      <UserCheck className={`w-4 h-4 ${user.isDefault ? 'text-primary' : 'text-muted-foreground'}`} />
                      {user.username}
                      {user.isDefault && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] ml-1">ADMIN</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={user.isActive} 
                          onCheckedChange={() => toggleUserStatus(user.id)}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                        <span className="text-xs text-muted-foreground">{user.isActive ? 'Active' : 'Disabled'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs text-blue-400 font-mono">
                        {user.keyspace}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5 flex-wrap">
                        {user.commands.map((cmd, i) => <span key={i}>{renderCommandBadge(cmd)}</span>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Settings2 className="w-4 h-4" />
                        </Button>
                        {!user.isDefault ? (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteUser(user.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        ) : (
                          <div className="h-8 w-8" /> // Spacer for default admin
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
