"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, Mic, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const suggestions = [
  "Show keys expiring in next 30m",
  "Analyze memory spike",
  "Suggest eviction policy"
]

const mockResponses = [
  { keywords: ["memory", "spike"], text: "I've analyzed the cluster telemetry. Memory usage is up by 35% over the last hour, primarily due to an influx of `session_cache:*` keys without TTLs. I recommend switching to the `allkeys-lfu` eviction policy to automatically mitigate this." },
  { keywords: ["keys", "expiring"], text: "Scanning the cluster... Currently, there are 14,502 keys set to expire in the next 30 minutes. The vast majority belong to the `temp_session:*` and `oauth_token:*` namespaces." },
  { keywords: ["eviction", "policy"], text: "Your current eviction policy is `volatile-lru`. Since you are experiencing memory pressure with non-expiring keys, you might want to consider `allkeys-lfu` to evict the least frequently used keys regardless of TTL." },
  { keywords: ["slow", "query", "queries"], text: "I noticed 3 slow queries in the last hour. The worst offender is a `KEYS *` command executed from IP 10.4.2.115 which blocked the main thread for 4.2 seconds. Would you like me to block this IP?" },
  { keywords: ["kill", "idle"], text: "I can execute the command to kill all clients idle for over 300 seconds. There are currently 142 clients matching this criteria. Proceed?" },
]

function getMockResponse(input: string) {
  const lowerInput = input.toLowerCase()
  for (const res of mockResponses) {
    if (res.keywords.every(kw => lowerInput.includes(kw))) {
      return res.text
    }
  }
  return "I'm currently running in demo mode, but in a production environment, I would analyze the cluster telemetry and provide a deep diagnostic for that query! Try asking about memory spikes or slow queries."
}

export function CopilotPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Valkey AI Assistant. How can I help you optimize your cluster today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsTyping(true)
    
    // Add empty assistant message placeholder
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    
    const responseText = getMockResponse(userMessage)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Stream text word by word to simulate AI generation
    const words = responseText.split(' ')
    let currentText = ''
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i]
      await new Promise(resolve => setTimeout(resolve, 40 + Math.random() * 60))
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].content = currentText
        return newMessages
      })
    }
    
    setIsTyping(false)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105 z-50 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Bot className="h-6 w-6 text-primary-foreground" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] max-h-[calc(100vh-8rem)] z-50 flex flex-col"
          >
            <Card className="flex flex-col h-full border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-1.5 rounded-md">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Valkey AI Copilot</h3>
                    <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 min-h-0">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-muted text-foreground rounded-bl-sm border border-border/50'
                      }`}>
                        {msg.content}
                        {msg.role === 'assistant' && msg.content === '' && (
                          <span className="flex gap-1 items-center h-5">
                            <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 bg-background border-t border-border">
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s)}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="relative flex items-center">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Copilot..."
                    className="pr-20 bg-muted/50 border-border focus-visible:ring-primary rounded-full h-12"
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="h-9 w-9 bg-primary text-primary-foreground rounded-full shadow-sm" 
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
