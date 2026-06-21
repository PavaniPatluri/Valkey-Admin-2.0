# Valkey Admin NextGen 🚀

**Valkey Admin 2.0** is a next-generation infrastructure management and observability platform designed for developers and SRE teams. It provides deep, real-time insights into your cluster's health, memory allocation, active nodes, and traffic—all without context switching.

## 📸 Preview

![Valkey Admin Initialization](./public/splash-screen.png)
*(Note: Save the screenshot you just shared as `splash-screen.png` in the `public/` folder to display it here)*

![Valkey Admin Dashboard](./public/dashboard-preview.png)
*(Note: Add a screenshot of the main dashboard to the `public/` folder and name it `dashboard-preview.png` to display it here)*

## ✨ Features

- **Primary Dashboard (Cluster Overview)**: The first page of the application provides a high-level command center for your entire infrastructure. It features real-time trend graphs for Cluster Health, Active Nodes, Memory Usage (GB), CPU Load (%), Cache Hit Ratios, and Active Connections.
- **Beautiful Next-Generation UI**: Fully responsive, glassmorphic design system powered by Tailwind CSS.
- **True 3D Fluid Background**: Stunning, organic WebGL mesh background rendered using ShaderGradient.
- **Real-Time Telemetry Dashboards**: High-performance charts (powered by Recharts) for tracking CPU Load, Cache Hit Ratios, Memory Usage, and Cluster Health.
- **Deep Memory Analysis**: Visualize memory allocation by data type, track top namespaces, and monitor eviction & expiration trends over time.
- **Interactive AI Copilot**: Built-in intelligent assistant to help you analyze cluster telemetry and suggest optimization policies.
- **Dark/Light Mode**: Full theme customization seamlessly integrated.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **3D Graphics**: [ShaderGradient](https://www.shadergradient.co/) & React Three Fiber
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

First, clone the repository:

```bash
git clone https://github.com/PavaniPatluri/Valkey-Admin-2.0.git
cd Valkey-Admin-2.0
```

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 📁 Project Structure

- `src/app/` - Next.js App Router pages (Dashboard, Memory, Topology, etc.)
- `src/components/` - Reusable UI components (Sidebar, TopNav, Cards, Copilot)
- `src/components/ui/` - Base shadcn/ui components
- `src/lib/` - Utilities and global state management (Zustand)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/PavaniPatluri/Valkey-Admin-2.0/issues).
