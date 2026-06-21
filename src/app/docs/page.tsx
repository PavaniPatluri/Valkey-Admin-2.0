export default function DocsPage() {
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-12">
      <h1 className="text-4xl font-bold tracking-tight mb-6">Documentation</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Learn how to install, configure, and secure your Valkey Admin NextGen instance.
      </p>
      
      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3 border-b border-border pb-2">Quick Start</h2>
          <p className="mb-4">To deploy Valkey Admin via Docker, simply run the following command:</p>
          <pre className="bg-[#0c0c0e] p-4 rounded-md font-mono text-sm border border-border/50 text-emerald-400">
            {`docker run -d \\
  --name valkey-admin \\
  -p 3000:3000 \\
  -e VALKEY_URL=redis://localhost:6379 \\
  ghcr.io/valkey-admin-nextgen:latest`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3 border-b border-border pb-2">Environment Variables</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><code className="bg-muted px-1 rounded text-foreground">VALKEY_URL</code>: The connection string to your Valkey or Redis instance.</li>
            <li><code className="bg-muted px-1 rounded text-foreground">ADMIN_PASSWORD</code>: The master password to access this dashboard.</li>
            <li><code className="bg-muted px-1 rounded text-foreground">OPENAI_API_KEY</code>: Required to enable the AI Copilot and Incident Investigator.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
