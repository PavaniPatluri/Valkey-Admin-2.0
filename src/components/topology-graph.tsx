"use client"

import { useCallback } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Server, Database } from 'lucide-react'

const initialNodes: Node[] = [
  {
    id: 'master-1',
    type: 'default',
    data: { label: <NodeLabel title="Master Node 1" role="Master" icon={Server} status="healthy" /> },
    position: { x: 250, y: 100 },
    className: 'bg-card border-border rounded-lg shadow-sm w-48',
  },
  {
    id: 'replica-1',
    type: 'default',
    data: { label: <NodeLabel title="Replica Node 1" role="Replica" icon={Database} status="healthy" /> },
    position: { x: 100, y: 300 },
    className: 'bg-card border-border rounded-lg shadow-sm w-48',
  },
  {
    id: 'replica-2',
    type: 'default',
    data: { label: <NodeLabel title="Replica Node 2" role="Replica" icon={Database} status="healthy" /> },
    position: { x: 400, y: 300 },
    className: 'bg-card border-border rounded-lg shadow-sm w-48',
  },
  {
    id: 'master-2',
    type: 'default',
    data: { label: <NodeLabel title="Master Node 2" role="Master" icon={Server} status="warning" /> },
    position: { x: 750, y: 100 },
    className: 'bg-card border-border rounded-lg shadow-sm w-48 border-warning',
  },
  {
    id: 'replica-3',
    type: 'default',
    data: { label: <NodeLabel title="Replica Node 3" role="Replica" icon={Database} status="healthy" /> },
    position: { x: 750, y: 300 },
    className: 'bg-card border-border rounded-lg shadow-sm w-48',
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'master-1',
    target: 'replica-1',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
  },
  {
    id: 'e1-3',
    source: 'master-1',
    target: 'replica-2',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
  },
  {
    id: 'e4-5',
    source: 'master-2',
    target: 'replica-3',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
  },
]

function NodeLabel({ title, role, icon: Icon, status }: { title: string, role: string, icon: React.ElementType, status: string }) {
  return (
    <div className="flex flex-col p-2 text-foreground">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">{role}</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className={status === 'healthy' ? 'text-emerald-500' : 'text-amber-500'}>
            {status === 'healthy' ? 'Syncing' : 'Lagging'}
          </span>
        </div>
      </div>
    </div>
  )
}

export function TopologyGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="w-full h-full min-h-[600px] border border-border rounded-xl overflow-hidden bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="dark"
        colorMode="dark"
      >
        <Controls className="bg-card border-border fill-foreground" />
        <MiniMap className="bg-card border-border" maskColor="rgba(0,0,0,0.2)" />
        <Background color="#3b82f6" gap={16} size={1} />
      </ReactFlow>
    </div>
  )
}
