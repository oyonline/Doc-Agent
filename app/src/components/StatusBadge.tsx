import type { TaskStatus } from '../lib/mock-data'

const STATUS_COLOR: Record<TaskStatus, string> = {
  待处理: 'var(--color-status-idle)',
  执行中: 'var(--color-status-running)',
  验证中: 'var(--color-status-verify)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
}

export function getStatusColor(status: TaskStatus) {
  return STATUS_COLOR[status]
}

type Size = 'sm' | 'md'

export default function StatusBadge({
  status,
  size = 'sm',
}: {
  status: TaskStatus
  size?: Size
}) {
  const fontSize = size === 'md' ? 'var(--text-md)' : 'var(--text-sm)'
  const lineHeight = size === 'md' ? 'var(--text-md-lh)' : 'var(--text-sm-lh)'
  const fontWeight = size === 'md' ? 600 : 400
  return (
    <span
      style={{
        fontSize,
        lineHeight,
        fontWeight,
        color: getStatusColor(status),
      }}
    >
      {status}
    </span>
  )
}
