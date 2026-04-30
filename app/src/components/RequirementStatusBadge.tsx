import type { RequirementMainStatus, RequirementSubPhase } from '../lib/mock-data'
import PlanningProgressIndicator from './PlanningProgressIndicator'

// 需求级状态徽章(6 主状态色映射 + 进度指示嵌入)
// 来源:docs/03 §需求状态机 + docs/08 §页面通用规范
// 色映射决策(决策清单 #1):
// - 待澄清 = idle  浅灰
// - 规划中 = verify 青(承载原"PRD 已定 / 拆解中"语义)
// - 执行中 = running 蓝
// - 待审查 = review  紫琥珀
// - 已完成 = success 绿
// - 已放弃 = text-3 深灰(中性终态)
//
// showProgress 控制是否在"规划中"主状态后追加 PlanningProgressIndicator:
// - 需求工作台行内紧凑展示 → false
// - 需求详情页顶部 / 任务板需求分组标题 → true
// 其他主状态 showProgress 不生效(只规划中需要表达子阶段)

export const REQUIREMENT_STATUS_COLOR: Record<RequirementMainStatus, string> = {
  待澄清: 'var(--color-status-idle)',
  规划中: 'var(--color-status-verify)',
  执行中: 'var(--color-status-running)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
  已放弃: 'var(--color-text-3)',
}

export function getRequirementStatusColor(status: RequirementMainStatus): string {
  return REQUIREMENT_STATUS_COLOR[status]
}

type Props = {
  status: RequirementMainStatus
  // 仅当 status === '规划中' 且 showProgress === true 时,渲染进度指示
  subPhase?: RequirementSubPhase
  showProgress?: boolean
  // 字号控制:小号用于行内紧凑(text-sm),正常用于需求详情页顶部(text-md)
  size?: 'sm' | 'md'
}

export default function RequirementStatusBadge({
  status,
  subPhase,
  showProgress = false,
  size = 'sm',
}: Props) {
  const color = REQUIREMENT_STATUS_COLOR[status]
  const fontSize = size === 'md' ? 'var(--text-md)' : 'var(--text-sm)'
  const lineHeight = size === 'md' ? 'var(--text-md-lh)' : 'var(--text-sm-lh)'
  const fontWeight = size === 'md' ? 500 : 400

  const shouldRenderProgress =
    status === '规划中' && showProgress && subPhase !== undefined

  return (
    <span
      className="inline-flex items-center"
      style={{ gap: 'var(--space-2)' }}
    >
      <span
        style={{
          fontSize,
          lineHeight,
          fontWeight,
          color,
        }}
      >
        {status}
      </span>
      {shouldRenderProgress && subPhase !== undefined && (
        <PlanningProgressIndicator current={subPhase} />
      )}
    </span>
  )
}
