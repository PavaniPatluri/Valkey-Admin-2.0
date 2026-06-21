export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto p-12 text-center">
      <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">About Valkey Admin</h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Valkey Admin NextGen was built to solve the complexities of modern, large-scale memory store administration. 
        Traditional CLIs are incredibly powerful but lack the visual observability required by modern SREs to quickly diagnose hot-keys, memory leaks, and replication lag.
      </p>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        This project was entirely designed and developed as a beautiful, dark-mode, 
        highly-interactive single-page application spanning 16 comprehensive modules—from AI Copilot integration to raw Terminal emulation.
      </p>
      
      <div className="flex gap-4">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="px-6 py-2 bg-[#121215] border border-border rounded-md hover:bg-muted transition-colors font-medium text-sm">
          View on GitHub
        </a>
        <a href="https://valkey.io" target="_blank" rel="noreferrer" className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          Visit Valkey.io
        </a>
      </div>
    </div>
  )
}
