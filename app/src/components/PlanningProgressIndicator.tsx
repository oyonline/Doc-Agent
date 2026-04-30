import type { RequirementSubPhase } from '../lib/mock-data'

// 规划中主状态的轻量进度指示组件
// 来源:docs/00 §三层粒度 + docs/08 §页面通用规范
// 视觉:文字横排带连接符 "澄清 ▶ 三产出 ▶ review"
// - 已走过段:text-2
// - 当前段:color-text + 600 字重 + 2px 底部下划线
// - 未达段:text-3 弱化
// - 连接符 ▶:text-3,与文字同字号
// - 整体字号 --text-xs
// 复用:需求详情页顶部 / 任务板需求分组标题(showProgress=true);需求工作台行内紧凑不展示

const PHASES: { key: RequirementSubPhase; label: string }[] = [
  { key: 'clarify', label: '澄清' },
  { key: 'produce', label: '三产出' },
  { key: 'review', label: 'review' },
]

export default function PlanningProgressIndicator({
  current,
}: {
  current: RequirementSubPhase
}) {
  const currentIdx = PHASES.findIndex((p) => p.key === current)

  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 6,
        fontSize: 'var(--text-xs)',
        lineHeight: 'var(--text-xs-lh)',
      }}
    >
      {PHASES.map((phase, i) => {
        const isCurrent = i === currentIdx
        const isPassed = i < currentIdx
        const isFuture = i > currentIdx

        return (
          <span key={phase.key} className="inline-flex items-center" style={{ gap: 6 }}>
            <span
              style={{
                color: isCurrent
                  ? 'var(--color-text)'
                  : isPassed
                    ? 'var(--color-text-2)'
                    : 'var(--color-text-3)',
                fontWeight: isCurrent ? 600 : 400,
                borderBottom: isCurrent ? '2px solid var(--color-text)' : '2px solid transparent',
                paddingBottom: 1,
              }}
            >
              {phase.label}
            </span>
            {i < PHASES.length - 1 && (
              <span
                aria-hidden="true"
                style={{ color: 'var(--color-text-3)' }}
              >
                ▶
              </span>
            )}
            {/* 屏幕阅读器辅助文本(已走过 / 当前 / 未达) */}
            {isFuture && <span className="sr-only">未达</span>}
            {isPassed && <span className="sr-only">已走过</span>}
            {isCurrent && <span className="sr-only">当前阶段</span>}
          </span>
        )
      })}
    </span>
  )
}
