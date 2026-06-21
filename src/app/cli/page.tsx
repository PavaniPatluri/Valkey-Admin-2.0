"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal } from "lucide-react"

type LogEntry = {
  id: string
  type: "input" | "output" | "error" | "system"
  text: string
}

const WELCOME_BANNER = String.raw`
__      __   _ _                                          
\ \    / /  | | |                             _           
 \ \  / /_ _| | | _____ _   _     / \     __| | _ __ ___   (_) _ __  
  \ \/ / _' | | |/ / _ \ | | |   / _ \   / _' || '_ ' _ \  | || '_ \ 
   \  / (_| | |   <  __/ |_| |  / ___ \ | (_| || | | | | | | || | | |
    \/ \__,_|_|_|\_\___|\__, | /_/   \_\ \__,_||_| |_| |_| |_||_| |_|
                         __/ |                            
                        |___/                             

Valkey Admin NextGen CLI (v1.0.0)
Connected to 127.0.0.1:6379 (standalone)
Type "help" or "INFO" to get started. "CLEAR" clears the screen.
`

export default function CliTerminalPage() {
  const [history, setHistory] = useState<LogEntry[]>([
    { id: "init", type: "system", text: WELCOME_BANNER }
  ])
  const [inputStr, setInputStr] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  // Focus input on any click in the window
  const handleWindowClick = () => {
    inputRef.current?.focus()
  }

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    // Add input to display history
    setHistory(prev => [...prev, { id: `in-${Date.now()}`, type: "input", text: trimmed }])
    
    // Add to command history (for up/down arrows)
    setCommandHistory(prev => [trimmed, ...prev])
    setHistoryIndex(-1)

    const args = trimmed.split(" ")
    const command = args[0].toUpperCase()

    setTimeout(() => {
      let outputText = ""
      let outputType: "output" | "error" = "output"

      switch(command) {
        case "CLEAR":
          setHistory([{ id: `clear-${Date.now()}`, type: "system", text: "Terminal cleared." }])
          return
        case "PING":
          outputText = "PONG"
          break
        case "ECHO":
          outputText = args.slice(1).join(" ").replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
          if (!outputText) {
            outputText = "(error) ERR wrong number of arguments for 'echo' command"
            outputType = "error"
          } else {
            outputText = `"${outputText}"`
          }
          break
        case "GET":
          if (args.length !== 2) {
            outputText = "(error) ERR wrong number of arguments for 'get' command"
            outputType = "error"
          } else {
            outputText = `"${args[1]}_mock_value"`
          }
          break
        case "SET":
          if (args.length < 3) {
            outputText = "(error) ERR wrong number of arguments for 'set' command"
            outputType = "error"
          } else {
            outputText = "OK"
          }
          break
        case "INFO":
          outputText = `# Server\nvalkey_version:7.2.4\nvalkey_mode:standalone\nos:Linux 5.15.0-101-generic x86_64\n# Clients\nconnected_clients:12\n# Memory\nused_memory_human:1.20G`
          break
        case "HELP":
          outputText = `Available mock commands: PING, ECHO, GET, SET, INFO, CLEAR, HELP`
          break
        default:
          outputText = `(error) ERR unknown command '${args[0]}', with args beginning with:`
          if (args.length > 1) {
             outputText += ` '${args.slice(1).join("', '")}'`
          }
          outputType = "error"
      }

      setHistory(prev => [...prev, { id: `out-${Date.now()}`, type: outputType, text: outputText }])
    }, 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputStr)
      setInputStr("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setInputStr(commandHistory[nextIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1
        setHistoryIndex(prevIndex)
        setInputStr(commandHistory[prevIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputStr("")
      }
    }
  }

  return (
    <div 
      className="flex flex-col h-full w-full bg-[#0c0c0e] font-mono text-sm overflow-hidden border border-border/50 rounded-lg shadow-2xl relative"
      onClick={handleWindowClick}
    >
      {/* Fake window title bar */}
      <div className="h-10 bg-[#18181b] flex items-center px-4 border-b border-border/50 select-none">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="mx-auto text-xs text-muted-foreground flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          valkey-cli
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {history.map((entry) => (
          <div key={entry.id} className="mb-2 whitespace-pre-wrap">
            {entry.type === "system" && (
              <span className="text-emerald-500/80">{entry.text}</span>
            )}
            {entry.type === "input" && (
              <div>
                <span className="text-muted-foreground mr-2">valkey&gt;</span>
                <span className="text-foreground font-bold">{entry.text}</span>
              </div>
            )}
            {entry.type === "output" && (
              <span className="text-zinc-300">{entry.text}</span>
            )}
            {entry.type === "error" && (
              <span className="text-red-400">{entry.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <div className="p-4 pt-0 flex items-center bg-[#0c0c0e]">
        <span className="text-emerald-500 font-bold mr-2">valkey&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck="false"
          autoComplete="off"
          className="flex-1 bg-transparent text-foreground outline-none border-none focus:ring-0 font-bold"
        />
      </div>
    </div>
  )
}
