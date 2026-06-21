export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto p-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-blue-500">Simple, Transparent Pricing</h1>
      <p className="text-xl text-muted-foreground mb-12">
        Start for free, scale to the enterprise. No hidden fees.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        {/* Free Tier */}
        <div className="flex flex-col p-8 bg-card border border-border rounded-xl shadow-sm opacity-80">
          <h3 className="font-bold text-xl mb-2">Community</h3>
          <div className="text-4xl font-bold mb-4">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          <ul className="text-sm text-muted-foreground space-y-3 mb-8 flex-1">
            <li>✓ Up to 3 Clusters</li>
            <li>✓ Basic Metrics</li>
            <li>✓ Terminal Emulator</li>
          </ul>
          <button className="w-full py-2 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80">Get Started</button>
        </div>

        {/* Pro Tier */}
        <div className="flex flex-col p-8 bg-card border-2 border-primary rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.15)] relative scale-105 z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
          <h3 className="font-bold text-xl mb-2">Professional</h3>
          <div className="text-4xl font-bold mb-4">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          <ul className="text-sm text-muted-foreground space-y-3 mb-8 flex-1">
            <li className="text-foreground">✓ Unlimited Clusters</li>
            <li className="text-foreground">✓ Advanced LUA Debugger</li>
            <li className="text-foreground">✓ Query Profiling</li>
            <li className="text-foreground">✓ Backup & Restore</li>
          </ul>
          <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 shadow-[0_0_15px_rgba(37,99,235,0.3)]">Upgrade to Pro</button>
        </div>

        {/* Enterprise Tier */}
        <div className="flex flex-col p-8 bg-card border border-border rounded-xl shadow-sm">
          <h3 className="font-bold text-xl mb-2">Enterprise</h3>
          <div className="text-4xl font-bold mb-4">Custom</div>
          <ul className="text-sm text-muted-foreground space-y-3 mb-8 flex-1">
            <li>✓ Multi-Datacenter Support</li>
            <li>✓ AI Incident Investigator</li>
            <li>✓ Audit Logging & ACLs</li>
            <li>✓ 24/7 Priority Support</li>
          </ul>
          <button className="w-full py-2 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90">Contact Sales</button>
        </div>
      </div>
    </div>
  )
}
