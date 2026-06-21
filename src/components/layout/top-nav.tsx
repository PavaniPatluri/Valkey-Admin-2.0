"use client"

import { Search, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function TopNav() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        <div className="w-full max-w-sm relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search commands, keys, nodes..."
            className="w-full bg-muted/50 pl-9 pr-12 h-9 rounded-full border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-transparent transition-all"
          />
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal flex justify-between items-center">
              <span className="font-semibold">Notifications</span>
              <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary">Mark all read</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium">Auto-scaling triggered</span>
                </div>
                <span className="text-xs text-muted-foreground">Added 2 read replicas to Cluster-A</span>
                <span className="text-[10px] text-muted-foreground mt-1">2 mins ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium">Memory Warning</span>
                </div>
                <span className="text-xs text-muted-foreground">Node-03 is approaching 85% memory capacity</span>
                <span className="text-[10px] text-muted-foreground mt-1">15 mins ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">System Update</span>
                </div>
                <span className="text-xs text-muted-foreground">Valkey engine successfully upgraded to v8.0.1</span>
                <span className="text-[10px] text-muted-foreground mt-1">1 hour ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full justify-center text-primary text-sm cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full ring-offset-background">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src="/avatars/01.png" alt="@admin" />
              <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Super Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@valkey.io
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/billing")}>Billing</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => router.push("/")}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
