import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'

import {
  mockRequirementGroups,
} from '../lib/mock-data'
import type {
  RequirementGroup,
  TaskProgressItem,
  RiskLevel,
} from '../lib/mock-data'
import RequirementStatusBadge, {
  getRequirementStatusColor,
} from '../components/RequirementStatusBadge'

// 任务板(V0.2 重做版)
// 实现入口:docs/08 §任务板
// 从"五列状态看板"扩展为"按需求分组的任务池视图"
// 顶部需求过滤器 + 主区域按需求分组的任务卡
// V0.2.0 阶段:任务-7 占位,需求-002 默认折叠
// 协作模型并行升级后:GroupHeader 接 RequirementStatusBadge(showProgress=true),
// 当前 4 需求中无"规划中"主状态,代码骨架预留
//
// 严禁:
// - 任务图节点不能出现在任务板(那是需求详情页的事)
// - 任务-7 不当作真实任务展示
// - 任务卡不展示伪 token 百分比

const TASK_STATUS_COLOR: Record<TaskProgressItem['status'], string> = {
  待处理: 'var(--color-status-idle)',
  执行中: 'var(--color-status-running)',
  验证中: 'var(--color-status-verify)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
  占位: 'var(--color-text-3)',
}

const AGENT_LABEL_COLOR: Record<TaskProgressItem['agentType'], string> = {
  后端: 'var(--color-status-running)',
  前端: 'var(--color-status-verify)',
  测试: 'var(--color-status-warn)',
}

const RISK_COLOR: Record<RiskLevel, string> = {
  高: 'var(--color-status-danger)',
  中: 'var(--color-status-warn)',
  低: 'var(--color-status-idle)',
}

export default function Tasks() {
  // 每个分组的展开/折叠状态
  const initialExpanded = useMemo(() => {
    const map: Record<string, boolean> = {}
    mockRequirementGroups.forEach((g) => {
      map[g.id] = !g.defaultCollapsed
    })
    return map
  }, [])
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded)

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
      <PageHeader />
      <RequirementFilter
        groups={mockRequirementGroups}
        expanded={expanded}
        onToggle={toggle}
      />
      <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
        {mockRequirementGroups.map((group) => (
          <RequirementGroupBlock
            key={group.id}
            group={group}
            isExpanded={expanded[group.id]}
            onToggle={() => toggle(group.id)}
          />
        ))}
      </div>
    </div>
  )
}

function PageHeader() {
  const total = mockRequirementGroups.length
  const taskTotal = mockRequirementGroups.reduce(
    (n, g) => n + (g.tasks?.length ?? 0),
    0,
  )
  return (
    <header className="flex items-baseline" style={{ gap: 'var(--space-3)' }}>
      <h1
        style={{
          fontSize: 'var(--text-lg)',
          lineHeight: 'var(--text-lg-lh)',
          fontWeight: 600,
          margin: 0,
        }}
      >
        任务板
      </h1>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
        按需求分组 · {total} 个需求 · {taskTotal} 个任务卡
      </span>
    </header>
  )
}

// ============ 顶部需求过滤器 ============
// chip 行,点击切换该分组的展开/折叠
// 同时承担"看哪些需求"和"折叠/展开"两个职责

function RequirementFilter({
  groups,
  expanded,
  onToggle,
}: {
  groups: RequirementGroup[]
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
        padding: 'var(--space-2) var(--space-3)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-2)',
          letterSpacing: '0.02em',
          marginRight: 'var(--space-2)',
        }}
      >
        过滤
      </span>
      {groups.map((g) => {
        const isOn = expanded[g.id]
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onToggle(g.id)}
            style={{
              cursor: 'pointer',
              padding: '4px var(--space-3)',
              background: isOn ? 'var(--color-surface-2)' : 'transparent',
              border: `1px solid ${
                isOn ? 'var(--color-border-strong)' : 'var(--color-border)'
              }`,
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-xs)',
              lineHeight: 'var(--text-xs-lh)',
              color: isOn ? 'var(--color-text)' : 'var(--color-text-3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: getRequirementStatusColor(g.mainStatus),
                display: 'inline-block',
              }}
            />
            {g.code}
          </button>
        )
      })}
    </div>
  )
}

// ============ 需求分组块 ============

function RequirementGroupBlock({
  group,
  isExpanded,
  onToggle,
}: {
  group: RequirementGroup
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <GroupHeader group={group} isExpanded={isExpanded} onToggle={onToggle} />
      {isExpanded && (
        <div
          style={{
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {group.tasks && group.tasks.length > 0 ? (
            <TaskCardGrid tasks={group.tasks} />
          ) : (
            <EmptyHint hint={group.emptyHint ?? '无任务'} />
          )}
        </div>
      )}
    </section>
  )
}

function GroupHeader({
  group,
  isExpanded,
  onToggle,
}: {
  group: RequirementGroup
  isExpanded: boolean
  onToggle: () => void
}) {
  const realDoneOf = group.taskCountReal
  const progress =
    realDoneOf !== undefined
      ? `${group.doneCount ?? 0}/${realDoneOf} 已完成 · ${group.inProgressCount ?? 0} 进行中`
      : null
  return (
    <div
      className="flex items-center"
      style={{
        padding: 'var(--space-3) var(--space-4)',
        gap: 'var(--space-3)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          background: 'transparent',
          border: 0,
          padding: 0,
          color: 'var(--color-text-3)',
          display: 'inline-flex',
          alignItems: 'center',
        }}
        aria-label={isExpanded ? '折叠' : '展开'}
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <Link
        to={`/requirements/${group.id}`}
        className="flex items-baseline min-w-0"
        style={{
          gap: 'var(--space-2)',
          textDecoration: 'none',
          color: 'inherit',
          flex: 1,
        }}
      >
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          {group.code}
        </span>
        <span
          className="truncate"
          style={{
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--text-base-lh)',
            fontWeight: 500,
            color: 'var(--color-text)',
          }}
        >
          {group.name}
        </span>
      </Link>
      <span style={{ flexShrink: 0 }}>
        {/* 任务板需求分组标题:展示完整进度指示(showProgress=true)
            当前 4 需求中无"规划中"主状态,代码骨架预留 */}
        <RequirementStatusBadge
          status={group.mainStatus}
          subPhase={group.subPhase}
          showProgress
          size="sm"
        />
      </span>
      {progress && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-3)',
            flexShrink: 0,
          }}
        >
          {progress}
        </span>
      )}
    </div>
  )
}

function EmptyHint({ hint }: { hint: string }) {
  return (
    <div
      style={{
        padding: 'var(--space-3)',
        background: 'var(--color-surface-2)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--text-sm-lh)',
        color: 'var(--color-text-2)',
      }}
    >
      {hint}
    </div>
  )
}

// ============ 任务卡网格 ============

function TaskCardGrid({ tasks }: { tasks: TaskProgressItem[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'var(--space-3)',
      }}
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

function TaskCard({ task }: { task: TaskProgressItem }) {
  const isPlaceholder = task.isPlaceholder === true
  const isActive = task.status === '执行中'
  const isReview = task.status === '待审查'

  // 占位任务卡:不可点击(docs/08 §任务板)
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isPlaceholder ? (
      <div
        style={{
          display: 'block',
          background: 'var(--color-surface)',
          border: '1px dashed var(--color-border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          opacity: 0.6,
          cursor: 'not-allowed',
        }}
      >
        {children}
      </div>
    ) : (
      <Link
        to={`/tasks/${task.id}`}
        style={{
          display: 'block',
          background: 'var(--color-surface)',
          border: `1px solid ${
            isActive ? 'var(--color-status-running)' : 'var(--color-border)'
          }`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'all 150ms',
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.borderColor = 'var(--color-border-strong)'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.borderColor = 'var(--color-border)'
        }}
      >
        {children}
      </Link>
    )

  return (
    <Wrapper>
      {/* 第一行:编号 + 智能体类型 + 风险 */}
      <div className="flex items-baseline" style={{ gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          任务-{task.id}
        </span>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: AGENT_LABEL_COLOR[task.agentType],
            marginLeft: 'auto',
          }}
        >
          {task.agentType}
        </span>
        {task.riskLevel && !isPlaceholder && (
          <span style={{ fontSize: 'var(--text-xs)', color: RISK_COLOR[task.riskLevel] }}>
            {task.riskLevel}风险
          </span>
        )}
      </div>

      {/* 任务名 */}
      <div
        className="truncate"
        style={{
          marginTop: 2,
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--text-base-lh)',
          fontWeight: 500,
          color: 'var(--color-text)',
        }}
      >
        {task.shortName}
      </div>

      {/* 第三行:状态 + 异常标签 + 验证 */}
      <div
        className="flex items-center"
        style={{ marginTop: 'var(--space-2)', gap: 'var(--space-2)', flexWrap: 'wrap' }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: TASK_STATUS_COLOR[task.status],
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
              color: TASK_STATUS_COLOR[task.status],
            }}
          >
            {isPlaceholder ? '占位 · 待 V0.2.1 激活' : task.status}
          </span>
        </span>

        {task.anomalies?.map((a) => (
          <AnomalyChip key={a} label={a} />
        ))}

        {task.validation && !isPlaceholder && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-3)',
              marginLeft: 'auto',
            }}
          >
            验证 · {task.validation}
          </span>
        )}
      </div>

      {/* 待审查任务额外显示"查看审查包"链接 */}
      {isReview && (
        <Link
          to={`/review/${task.id}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'inline-block',
            marginTop: 'var(--space-2)',
            padding: '2px var(--space-2)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text)',
            textDecoration: 'none',
          }}
        >
          查看审查包 →
        </Link>
      )}
    </Wrapper>
  )
}

const ANOMALY_BG: Record<string, { bg: string; color: string }> = {
  已停止: { bg: '#f4f4f5', color: 'var(--color-status-idle)' },
  执行失败: { bg: '#fee2e2', color: 'var(--color-status-danger)' },
  验证未通过: { bg: '#fee2e2', color: 'var(--color-status-danger)' },
  已拒绝: { bg: '#fefce8', color: 'var(--color-status-warn)' },
  卡住: { bg: '#fefce8', color: 'var(--color-status-warn)' },
  需要人工处理: { bg: '#fee2e2', color: 'var(--color-status-danger)' },
}

function AnomalyChip({ label }: { label: string }) {
  const style = ANOMALY_BG[label] ?? {
    bg: 'var(--color-surface-2)',
    color: 'var(--color-text-2)',
  }
  return (
    <span
      style={{
        padding: '1px 6px',
        background: style.bg,
        color: style.color,
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-xs)',
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  )
}
