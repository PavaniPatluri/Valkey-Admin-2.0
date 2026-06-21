"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Shield, KeyRound, ScrollText, Check, Plus, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your team, configure roles, set up authentication, and view audit trails.
        </p>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full max-w-[600px] grid-cols-4 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="members" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="auth" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <KeyRound className="w-4 h-4 mr-2" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ScrollText className="w-4 h-4 mr-2" />
            Audit
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="members" className="m-0 focus-visible:outline-none">
            <TeamMembers />
          </TabsContent>
          <TabsContent value="roles" className="m-0 focus-visible:outline-none">
            <RolesMatrix />
          </TabsContent>
          <TabsContent value="auth" className="m-0 focus-visible:outline-none">
            <AuthSettings />
          </TabsContent>
          <TabsContent value="audit" className="m-0 focus-visible:outline-none">
            <AuditLogs />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function TeamMembers() {
  const members = [
    { name: "Alice Admin", email: "alice@valkey.io", role: "Super Admin", status: "Active" },
    { name: "Bob Builder", email: "bob@valkey.io", role: "Developer", status: "Active" },
    { name: "Charlie Cluster", email: "charlie@valkey.io", role: "Cluster Admin", status: "Active" },
    { name: "Dave Data", email: "dave@valkey.io", role: "Read Only", status: "Pending" },
    { name: "Eve Eyeball", email: "eve@valkey.io", role: "Auditor", status: "Active" },
  ]

  return (
    <Card className="bg-card shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage who has access to this Valkey organization.</CardDescription>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.email} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {m.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      m.status === 'Active' 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function RolesMatrix() {
  const roles = ["Super Admin", "Cluster Admin", "Developer", "Read Only", "Auditor"]
  const permissions = [
    "View Cluster Metrics",
    "View Keys & Data",
    "Modify Keys",
    "Delete Keys (Single)",
    "Batch Delete / Flush",
    "Run Arbitrary Commands",
    "Export Data",
    "Configure Nodes / Scale",
  ]

  const defaultMatrix: Record<string, boolean[]> = {
    "Super Admin": [true, true, true, true, true, true, true, true],
    "Cluster Admin": [true, true, true, true, false, true, true, true],
    "Developer": [true, true, true, true, false, false, true, false],
    "Read Only": [true, true, false, false, false, false, false, false],
    "Auditor": [true, false, false, false, false, false, true, false],
  }

  return (
    <Card className="bg-card shadow-sm border-border overflow-hidden">
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
        <CardDescription>Granular access control matrix for your organization roles.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[250px] sticky left-0 bg-card border-r border-border z-10">Permission</TableHead>
                {roles.map(role => (
                  <TableHead key={role} className="text-center min-w-[120px]">{role}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm, i) => (
                <TableRow key={perm} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium sticky left-0 bg-card border-r border-border z-10 text-muted-foreground">
                    {perm}
                  </TableCell>
                  {roles.map(role => {
                    const hasPerm = defaultMatrix[role][i]
                    return (
                      <TableCell key={role} className="text-center">
                        {hasPerm ? (
                          <div className="flex justify-center">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function AuthSettings() {
  const [ssoConfig, setSsoConfig] = useState({
    ldap: false,
    saml: true,
    google: true,
    github: false
  })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-card shadow-sm border-border">
        <CardHeader>
          <CardTitle>Enterprise Identity</CardTitle>
          <CardDescription>Configure organizational SSO and directory syncing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">SAML / OAuth2 SSO</p>
              <p className="text-sm text-muted-foreground">Authenticate using Okta, Entra ID, etc.</p>
            </div>
            <Switch checked={ssoConfig.saml} onCheckedChange={(v) => setSsoConfig({...ssoConfig, saml: v})} className="data-[state=checked]:bg-primary" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">LDAP / Active Directory</p>
              <p className="text-sm text-muted-foreground">Legacy directory sync integration.</p>
            </div>
            <Switch checked={ssoConfig.ldap} onCheckedChange={(v) => setSsoConfig({...ssoConfig, ldap: v})} className="data-[state=checked]:bg-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader>
          <CardTitle>Social Login</CardTitle>
          <CardDescription>Enable quick authentication for developers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Google Login</p>
              <p className="text-sm text-muted-foreground">Allow login via Google Workspace.</p>
            </div>
            <Switch checked={ssoConfig.google} onCheckedChange={(v) => setSsoConfig({...ssoConfig, google: v})} className="data-[state=checked]:bg-primary" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">GitHub Login</p>
              <p className="text-sm text-muted-foreground">Allow login via GitHub Accounts.</p>
            </div>
            <Switch checked={ssoConfig.github} onCheckedChange={(v) => setSsoConfig({...ssoConfig, github: v})} className="data-[state=checked]:bg-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AuditLogs() {
  const logs = [
    { id: "LOG-0042", actor: "Alice Admin", action: "Deleted Keys", target: "session:user:8923", cluster: "Prod-US-East", timestamp: "2 mins ago" },
    { id: "LOG-0041", actor: "System", action: "Scaled Up", target: "Node-14", cluster: "Prod-US-East", timestamp: "1 hour ago" },
    { id: "LOG-0040", actor: "Bob Builder", action: "Executed SCAN", target: "*", cluster: "Staging", timestamp: "3 hours ago" },
    { id: "LOG-0039", actor: "Charlie Cluster", action: "Updated Config", target: "maxmemory-policy", cluster: "Prod-US-East", timestamp: "Yesterday" },
    { id: "LOG-0038", actor: "Dave Data", action: "Failed Login", target: "-", cluster: "-", timestamp: "Yesterday" },
  ]

  return (
    <Card className="bg-card shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audit Trails</CardTitle>
          <CardDescription>Immutable ledger of organizational actions.</CardDescription>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Immutable
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30 transition-colors font-mono text-xs">
                  <TableCell className="text-muted-foreground">{log.id}</TableCell>
                  <TableCell className="font-sans font-medium text-foreground">{log.actor}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.action.includes('Deleted') ? 'bg-destructive/10 text-destructive' :
                      log.action.includes('Failed') ? 'bg-amber-500/10 text-amber-500' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.target}</TableCell>
                  <TableCell className="text-muted-foreground">{log.cluster}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
