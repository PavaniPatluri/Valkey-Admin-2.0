"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, Mic, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef } from 'react'

const suggestions = [
  "Show keys expiring in next 30m",
  "Analyze memory spike",
  "Suggest eviction policy"
]

export function CopilotPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { messages, append, isLoading } = useChat({
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Hello! I am your Valkey AI Assistant. How can I help you optimize your cluster today?' }
    ]
  })

  const displayMessages = messages.length > 0 ? messages : [
    { id: '1', role: 'assistant', content: 'Hello! I am your Valkey AI Assistant. How can I help you optimize your cluster today?' }
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSuggestionClick = (suggestion: string) => {
    append({ role: 'user', content: suggestion })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    append({ role: 'user', content: inputValue })
    setInputValue('')
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

              <ScrollArea className="flex-1 p-4 min-h-0" ref={scrollRef}>
                <div className="space-y-4">
                  {displayMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-muted text-foreground rounded-bl-sm border border-border/50'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && displayMessages[displayMessages.length - 1]?.role === 'user' && (
                     <div className="flex justify-start">
                       <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-muted text-foreground rounded-bl-sm border border-border/50">
                         <span className="flex gap-1 items-center h-5">
                           <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                           <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                           <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                         </span>
                       </div>
                     </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 bg-background border-t border-border">
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleFormSubmit} className="relative flex items-center">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Copilot..."
                    className="pr-20 bg-muted/50 border-border focus-visible:ring-primary rounded-full h-12"
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="h-9 w-9 bg-primary text-primary-foreground rounded-full shadow-sm" 
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
