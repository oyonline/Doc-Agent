import type { AnomalyTag } from '../lib/mock-data'

const ANOMALY_STYLE: Record<AnomalyTag, { bg: string; color: string }> = {
  已停止: { bg: '#f4f4f5', color: 'var(--color-status-idle)' },
  执行失败: { bg: '#fee2e2', color: 'var(--color-status-danger)' },
  验证未通过: { bg: '#fee2e2', color: 'var(--color-status-danger)' },
  已拒绝: { bg: '#fefce8', color: 'var(--color-status-warn)' },
  卡住: { bg: '#fefce8', color: 'var(--color-status-warn)' },
  需要人工处理: { bg: '#fee2e2', color: 'var(--color-status-danger)' },
}

export default function AnomalyTagPill({ tag }: { tag: AnomalyTag }) {
  const { bg, color } = ANOMALY_STYLE[tag]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 18,
        padding: '0 6px',
        background: bg,
        color,
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-xs)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {tag}
    </span>
  )
}
