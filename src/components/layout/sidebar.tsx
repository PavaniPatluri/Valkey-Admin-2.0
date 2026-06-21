"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Server, 
  Activity, 
  Network, 
  Key, 
  TerminalSquare, 
  BellRing, 
  Bot, 
  Settings,
  Shield,
  HardDrive,
  Users,
  Database,
  Code
} from "lucide-react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ValkeyLogo } from "@/components/valkey-logo"

export const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Data Explorer", href: "/explorer", icon: Key },
  { name: "Topology Map", href: "/topology", icon: Network },
  { name: "Cluster Shards", href: "/sharding", icon: Server },
  { name: "Time Travel Metrics", href: "/metrics", icon: Activity },
  { name: "Query Profiler", href: "/profiler", icon: Activity },
  { name: "Memory Analyzer", href: "/memory", icon: HardDrive },
  { name: "Command Logs", href: "/logs", icon: TerminalSquare },
  { name: "Alerts & Incidents", href: "/alerts", icon: BellRing },
  { name: "Client Connections", href: "/clients", icon: Users },
  { name: "Backup & Restore", href: "/backups", icon: Database },
  { name: "Terminal Emulator", href: "/cli", icon: TerminalSquare },
  { name: "LUA Debugger", href: "/lua", icon: Code },
  { name: "Security & ACL", href: "/acl", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar/40 backdrop-blur-xl pt-4">
      <div className="px-6 pb-6">
        <h2 className="text-lg font-bold tracking-tight text-sidebar-foreground flex items-center gap-2">
          <ValkeyLogo className="h-5 w-5 text-primary" />
          Valkey Admin
        </h2>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium relative transition-colors",
                isActive
                  ? "text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:text-sidebar-foreground"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 rounded-md bg-sidebar-accent" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <motion.div 
                className="relative z-10 flex items-center w-full"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon
                  className={cn(
                    "mr-3 h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
