import { useNavigate } from 'react-router-dom'
import type { TaskGraphNode, TaskGraphEdge, TaskStatus } from '../lib/mock-data'

// V0.2.0 任务图 SVG(实线 + 任务-7 占位)
// 节点点击 → /tasks/:id(任务详情页)
// 严禁画虚线契约依赖(V0.2.1 才加入)

const NODE_W = 168
const NODE_H = 64
const LAYER_H = 112
const SVG_W = 720
const COL_X: Record<TaskGraphNode['position'], number> = {
  left: 132,
  center: SVG_W / 2,
  right: SVG_W - 132,
}
const TOP_PADDING = 16
const BOTTOM_PADDING = 16

const STATUS_FILL: Record<TaskStatus | '占位', string> = {
  待处理: 'var(--color-surface)',
  执行中: 'var(--color-surface)',
  验证中: 'var(--color-surface)',
  待审查: 'var(--color-surface)',
  已完成: 'var(--color-surface)',
  占位: 'var(--color-surface)',
}

const STATUS_STROKE: Record<TaskStatus | '占位', string> = {
  待处理: 'var(--color-border-strong)',
  执行中: 'var(--color-status-running)',
  验证中: 'var(--color-status-verify)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
  占位: 'var(--color-border-strong)',
}

const STATUS_DOT: Record<TaskStatus | '占位', string> = {
  待处理: 'var(--color-status-idle)',
  执行中: 'var(--color-status-running)',
  验证中: 'var(--color-status-verify)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
  占位: 'var(--color-text-3)',
}

const AGENT_LABEL_COLOR: Record<TaskGraphNode['agentType'], string> = {
  后端: 'var(--color-status-running)',
  前端: 'var(--color-status-verify)',
  测试: 'var(--color-status-warn)',
}

function nodeCenter(node: TaskGraphNode): { cx: number; cy: number } {
  return {
    cx: COL_X[node.position],
    cy: TOP_PADDING + node.layer * LAYER_H + NODE_H / 2,
  }
}

export default function RequirementTaskGraph({
  nodes,
  edges,
}: {
  nodes: TaskGraphNode[]
  edges: TaskGraphEdge[]
}) {
  const navigate = useNavigate()
  const maxLayer = nodes.reduce((m, n) => Math.max(m, n.layer), 0)
  const svgH = TOP_PADDING + maxLayer * LAYER_H + NODE_H + BOTTOM_PADDING

  const nodeById = new Map(nodes.map((n) => [n.id, n]))

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${svgH}`}
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: 560,
        display: 'block',
      }}
      role="img"
      aria-label="任务依赖图"
    >
      <defs>
        <marker
          id="task-graph-arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--color-border-strong)" />
        </marker>
      </defs>

      {/* 边(实线箭头) */}
      {edges.map((edge, i) => {
        const from = nodeById.get(edge.from)
        const to = nodeById.get(edge.to)
        if (!from || !to) return null
        const a = nodeCenter(from)
        const b = nodeCenter(to)
        // 起点位于 from 节点底部,终点位于 to 节点顶部
        const x1 = a.cx
        const y1 = a.cy + NODE_H / 2
        const x2 = b.cx
        const y2 = b.cy - NODE_H / 2 - 4 // 给 marker 留位
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-border-strong)"
            strokeWidth={1.25}
            markerEnd="url(#task-graph-arrow)"
          />
        )
      })}

      {/* 节点 */}
      {nodes.map((node) => {
        const { cx, cy } = nodeCenter(node)
        const x = cx - NODE_W / 2
        const y = cy - NODE_H / 2
        const isPlaceholder = node.isPlaceholder === true

        return (
          <g
            key={node.id}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/tasks/${node.id}`)}
            opacity={isPlaceholder ? 0.6 : 1}
          >
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              ry={8}
              fill={STATUS_FILL[node.status]}
              stroke={STATUS_STROKE[node.status]}
              strokeWidth={1.25}
              strokeDasharray={isPlaceholder ? '4 3' : undefined}
            />
            {/* 任务编号 + 智能体类型标签(顶部一行)*/}
            <text
              x={x + 12}
              y={y + 18}
              fontSize={11}
              fill="var(--color-text-3)"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              任务-{node.id}
            </text>
            <text
              x={x + NODE_W - 12}
              y={y + 18}
              fontSize={11}
              fill={AGENT_LABEL_COLOR[node.agentType]}
              textAnchor="end"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {node.agentType}
            </text>
            {/* 任务名(中间一行)*/}
            <text
              x={x + 12}
              y={y + 38}
              fontSize={13}
              fill="var(--color-text)"
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
              }}
            >
              {node.shortName}
            </text>
            {/* 状态点 + 状态文字(底部一行)*/}
            <circle
              cx={x + 16}
              cy={y + NODE_H - 14}
              r={4}
              fill={STATUS_DOT[node.status]}
            />
            <text
              x={x + 26}
              y={y + NODE_H - 10}
              fontSize={11}
              fill="var(--color-text-2)"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {isPlaceholder ? '占位 · 待 V0.2.1 激活' : node.status}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
