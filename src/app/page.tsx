"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, Database, Server, Share2, Zap } from "lucide-react"
import { useMetricsStore, MetricDataPoint } from "@/lib/store"
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { navItems } from "@/components/layout/sidebar"
import { useRouter } from "next/navigation"
import { ValkeyLogo } from "@/components/valkey-logo"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function Home() {
  const store = useMetricsStore()
  const [entered, setEntered] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (entered) {
      store.connectWebSocket()
    }
  }, [store, entered])

  return (
    <>
      <AnimatePresence>
        {!entered && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)", scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex bg-[#0c0c0e] overflow-hidden"
          >
            {/* Background Marquee Grid */}
            <div className="absolute inset-0 flex justify-between gap-4 md:gap-8 p-4 md:p-8 opacity-40 hover:opacity-70 transition-opacity duration-700">
              {/* Generate 4 columns scrolling at different speeds */}
              {[45, 60, 50, 70].map((duration, colIndex) => {
                // Shuffle or offset the items per column so they don't look identical
                const colItems = [...navItems].sort((a, b) => (a.name.length * colIndex) % 2 === 0 ? 1 : -1)
                
                return (
                  <div key={colIndex} className="relative w-1/4 h-[300vh] overflow-hidden">
                    <motion.div 
                      animate={{ y: ["0%", "-50%"] }}
                      transition={{ duration, repeat: Infinity, ease: "linear" }}
                      className="flex flex-col gap-16 md:gap-24"
                    >
                      {[...colItems, ...colItems].map((item, i) => {
                        const Icon = item.icon
                        const gradients = [
                          "from-blue-500/20 to-purple-500/20",
                          "from-emerald-500/20 to-teal-500/20",
                          "from-orange-500/20 to-red-500/20",
                          "from-pink-500/20 to-rose-500/20",
                          "from-indigo-500/20 to-cyan-500/20"
                        ]
                        const gradient = gradients[(i + colIndex) % gradients.length]
                        
                        return (
                          <div 
                            key={i} 
                            className="flex flex-col gap-3 group cursor-pointer"
                            onClick={() => {
                              if (item.href === "/") setEntered(true)
                              else router.push(item.href)
                            }}
                          >
                            <div className={`w-full aspect-[4/5] md:aspect-square bg-gradient-to-br ${gradient} border border-white/5 flex items-center justify-center overflow-hidden relative group-hover:border-white/20 transition-colors duration-500`}>
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                              <Icon className="w-16 h-16 text-white/50 group-hover:text-white transition-colors duration-500 relative z-10 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-bold text-sm md:text-base text-white group-hover:text-primary transition-colors">{item.name}</h3>
                              <p className="text-xs text-muted-foreground">Valkey Infrastructure</p>
                              <p className="text-[10px] text-muted-foreground/50 mt-1">2026</p>
                            </div>
                          </div>
                        )
                      })}
                    </motion.div>
                  </div>
                )
              })}
            </div>

            {/* Center Overlay: Title and Button */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 bg-black/20 backdrop-blur-[2px]">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center gap-10 p-12 rounded-[3rem] bg-black/60 backdrop-blur-3xl border border-white/10 shadow-2xl pointer-events-auto"
              >
                <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-background/50 border border-primary/30 shadow-[0_0_60px_rgba(59,130,246,0.3)]">
                  <ValkeyLogo className="w-12 h-12 text-primary" />
                </div>
                
                <div className="text-center space-y-2">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/20">
                    VALKEY <span className="text-primary">ADMIN</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground font-light tracking-widest uppercase">
                    Next-Generation Infrastructure
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEntered(true)}
                  className="mt-4 px-10 py-5 bg-primary text-primary-foreground font-bold rounded-full text-lg tracking-wide shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] hover:bg-primary/90 transition-all"
                >
                  INITIALIZE SYSTEM
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 gap-8 p-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/50 px-8 py-24 text-center sm:px-16 sm:py-32 shadow-sm backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-background/50 border-primary/20 text-primary">
            Valkey Admin NextGen v1.0
          </Badge>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Manage, observe and optimize your infrastructure{" "}
            <span className="text-muted-foreground">without context switching.</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            AI-powered administration and observability platform for developers and SRE teams.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border bg-background hover:bg-muted">
              Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Cluster Overview</h2>
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
            <div className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </Badge>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={itemVariants}>
          <MetricCard
            title="Cluster Health"
            value={`${store.clusterHealth}%`}
            icon={Activity}
            trend="+0.1%"
            trendUp={true}
            description="vs last 24h"
            data={store.healthHistory}
            color="#10b981"
          />
          </motion.div>
          <motion.div variants={itemVariants}>
          <MetricCard
            title="Active Nodes"
            value={store.activeNodes.toString()}
            icon={Server}
            trend="+2"
            trendUp={true}
            description="new nodes spun up"
            data={store.healthHistory}
            color="#3b82f6"
          />
          </motion.div>
          <motion.div variants={itemVariants}>
          <MetricCard
            title="Memory Usage"
            value={`${store.memoryUsageGB} GB`}
            icon={Database}
            trend="+2.1 GB"
            trendUp={false}
            description="usage increased"
            data={store.memoryHistory}
            color="#f59e0b"
          />
          </motion.div>
          <motion.div variants={itemVariants}>
          <MetricCard
            title="CPU Load"
            value={`${store.cpuLoadPercent}%`}
            icon={Cpu}
            trend="-5%"
            trendUp={true}
            description="vs yesterday"
            data={store.cpuHistory}
            color="#ef4444"
          />
          </motion.div>
          <motion.div variants={itemVariants}>
          <MetricCard
            title="Cache Hit Ratio"
            value={`${store.cacheHitRatio}%`}
            icon={Zap}
            trend="+1.2%"
            trendUp={true}
            description="improving efficiency"
            data={store.healthHistory}
            color="#10b981"
          />
          </motion.div>
          <motion.div variants={itemVariants}>
          <MetricCard
            title="Active Connections"
            value={store.activeConnections.toLocaleString()}
            icon={Share2}
            trend="+1,200"
            trendUp={true}
            description="peak traffic"
            data={store.connectionsHistory}
            color="#8b5cf6"
          />
          </motion.div>
        </motion.div>
      </section>
    </div>
    </>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  description,
  data,
  color,
}: {
  title: string
  value: string
  icon: React.ElementType
  trend: string
  trendUp: boolean
  description: string
  data: MetricDataPoint[]
  color: string
}) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1 text-xs">
          <span
            className={
              trendUp ? "text-emerald-500 font-medium" : "text-destructive font-medium"
            }
          >
            {trend}
          </span>
          <span className="ml-1.5 text-muted-foreground">{description}</span>
        </div>
        <div className="mt-4 h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis domain={['auto', 'auto']} hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
