"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Code, Clock, CheckCircle2, AlertTriangle, Save, Download } from "lucide-react"

const DEFAULT_SCRIPT = `-- Atomic conditional decrement (e.g. rate limiter)
local current = redis.call('GET', KEYS[1])
if current then
  current = tonumber(current)
  if current <= tonumber(ARGV[1]) then
    return -1 -- Rate limit exceeded
  else
    redis.call('DECRBY', KEYS[1], ARGV[1])
    return current - tonumber(ARGV[1])
  end
else
  -- Key does not exist, initialize it
  redis.call('SET', KEYS[1], ARGV[2])
  redis.call('EXPIRE', KEYS[1], 3600)
  return tonumber(ARGV[2])
end`

type ExecutionLog = {
  status: "success" | "error"
  result: string
  timeMs: number
}

export default function LuaDebuggerPage() {
  const [code, setCode] = useState(DEFAULT_SCRIPT)
  const [keysInput, setKeysInput] = useState("user:10042:tokens")
  const [argvInput, setArgvInput] = useState("1, 100")
  
  const [isExecuting, setIsExecuting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastExecution, setLastExecution] = useState<ExecutionLog | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Calculate line numbers
  const lineCount = code.split('\n').length
  const lineNumbers = Array.from({ length: Math.max(15, lineCount) }, (_, i) => i + 1)

  // Sync scroll between textarea and line numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const gutter = document.getElementById("line-numbers")
    if (gutter) {
      gutter.scrollTop = e.currentTarget.scrollTop
    }
  }

  const handleExecute = () => {
    setIsExecuting(true)
    setLastExecution(null)

    // Simulate network latency and processing time
    setTimeout(() => {
      // Very basic validation simulation
      if (code.includes("syntax error") || keysInput === "") {
        setLastExecution({
          status: "error",
          result: "(error) ERR Error compiling script (new function): user_script:2: unexpected symbol near 'error'",
          timeMs: parseFloat((Math.random() * 0.5).toFixed(3))
        })
      } else {
        setLastExecution({
          status: "success",
          result: "(integer) 99", // Mocked successful decrement
          timeMs: parseFloat((Math.random() * 1.5 + 0.1).toFixed(3))
        })
      }
      setIsExecuting(false)
    }, 600)
  }

  const handleSaveSnippet = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full max-w-screen-2xl mx-auto w-full p-6 gap-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LUA Script Debugger</h1>
          <p className="text-muted-foreground mt-1">
            Write, execute, and profile custom server-side scripts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveSnippet}
            disabled={isSaving}
            className="gap-2 border-border"
          >
            {isSaving ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saved!" : "Save as Snippet"}
          </Button>
          <Button 
            onClick={handleExecute}
            disabled={isExecuting}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            {isExecuting ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isExecuting ? "Executing..." : "Execute Script"}
          </Button>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Editor Pane */}
        <Card className="flex-1 flex flex-col border-border bg-[#09090b] shadow-sm min-h-[400px]">
          <CardHeader className="py-3 px-4 border-b border-border/50 bg-card/50 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Editor.lua</CardTitle>
            </div>
            <div className="flex gap-1.5">
               <Badge variant="outline" className="text-[10px] text-muted-foreground border-border bg-background">LUA 5.1</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex relative overflow-hidden">
            {/* Line Numbers Gutter */}
            <div 
              id="line-numbers"
              className="w-12 bg-[#121215] border-r border-border/50 text-right pr-3 pt-4 pb-4 select-none overflow-hidden text-xs text-[#52525b] font-mono leading-relaxed"
            >
              {lineNumbers.map(num => (
                <div key={num}>{num}</div>
              ))}
            </div>
            {/* Raw Textarea Editor */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              spellCheck="false"
              className="flex-1 bg-transparent text-[#e4e4e7] p-4 text-sm font-mono leading-relaxed resize-none outline-none custom-scrollbar whitespace-pre"
              placeholder="-- Write your LUA script here"
            />
          </CardContent>
        </Card>

        {/* Execution & Output Pane */}
        <div className="w-full lg:w-[400px] xl:w-[500px] flex flex-col gap-6 shrink-0 overflow-y-auto">
          
          {/* Inputs Card */}
          <Card className="border-border bg-card shadow-sm shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Execution Arguments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  KEYS (Comma separated)
                </label>
                <input
                  type="text"
                  value={keysInput}
                  onChange={(e) => setKeysInput(e.target.value)}
                  className="w-full bg-[#121215] border border-border rounded-md px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="key1, key2"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  ARGV (Comma separated)
                </label>
                <input
                  type="text"
                  value={argvInput}
                  onChange={(e) => setArgvInput(e.target.value)}
                  className="w-full bg-[#121215] border border-border rounded-md px-3 py-2 text-sm font-mono text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="arg1, arg2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Output Console Card */}
          <Card className="border-border bg-card shadow-sm flex-1 flex flex-col min-h-[250px]">
            <CardHeader className="py-3 border-b border-border/50 bg-card/50 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-sm font-medium">Output Console</CardTitle>
              {lastExecution && (
                <Badge variant="outline" className={`gap-1.5 ${lastExecution.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                  <Clock className="w-3 h-3" />
                  {lastExecution.timeMs}ms
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-[#09090b]">
              {!lastExecution && !isExecuting && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm flex-col gap-2 opacity-50">
                   <Download className="w-8 h-8 opacity-50" />
                   Ready to execute
                </div>
              )}
              {isExecuting && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm flex-col gap-3">
                   <RefreshCwIcon className="w-6 h-6 animate-spin text-emerald-500" />
                   Evaluating...
                </div>
              )}
              {lastExecution && !isExecuting && (
                <div className="p-4 font-mono text-sm h-full overflow-y-auto">
                   {lastExecution.status === "error" ? (
                     <div className="flex items-start gap-2 text-red-400">
                       <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                       <span className="whitespace-pre-wrap leading-relaxed">{lastExecution.result}</span>
                     </div>
                   ) : (
                     <div className="flex flex-col gap-3">
                       <div className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Return Value</div>
                       <div className="text-zinc-300 font-bold text-lg">{lastExecution.result}</div>
                       <div className="mt-4 pt-4 border-t border-border/30">
                         <div className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-2">Profiler Log</div>
                         <div className="text-xs text-emerald-500/80 leading-relaxed">
                           [0.000ms] Script cached in script cache<br/>
                           [0.005ms] Evaluated KEYS array (1 keys)<br/>
                           [0.010ms] Executed redis.call('GET')<br/>
                           [{lastExecution.timeMs}ms] Execution completed successfully
                         </div>
                       </div>
                     </div>
                   )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
