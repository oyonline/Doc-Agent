import { Link } from 'react-router-dom'
import {
  mockRequirementList,
  mockFocusRequirement,
  mockDecisionItems,
} from '../lib/mock-data'
import type {
  RequirementListItem,
  RequirementMainStatus,
  FocusRequirement,
  FocusTaskStatus,
  DecisionItem,
} from '../lib/mock-data'

// 需求工作台(V0.2 主入口)
// 实现入口:docs/08 §需求工作台
// 三区域:左中需求列表 / 右上当前焦点需求 / 右下待你决策事项

const REQUIREMENT_STATUS_COLOR: Record<RequirementMainStatus, string> = {
  待澄清: 'var(--color-status-idle)',
  澄清中: 'var(--color-status-running)',
  'PRD 已定': 'var(--color-status-verify)',
  拆解中: 'var(--color-status-verify)',
  执行中: 'var(--color-status-running)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
}

export default function Home() {
  return (
    <div className="flex" style={{ gap: 'var(--space-6)', alignItems: 'flex-start' }}>
      <RequirementListSection items={mockRequirementList} />
      <aside
        className="flex flex-col flex-shrink-0"
        style={{ width: 480, gap: 'var(--space-4)' }}
      >
        <FocusRequirementCard focus={mockFocusRequirement} />
        <DecisionItemsCard items={mockDecisionItems} />
      </aside>
    </div>
  )
}

// ============ 区域 1 · 需求列表 ============

function RequirementListSection({ items }: { items: RequirementListItem[] }) {
  return (
    <section
      className="flex flex-col flex-1 min-w-0"
      style={{ gap: 'var(--space-3)', maxWidth: 600 }}
    >
      <header
        className="flex items-baseline justify-between"
        style={{ marginBottom: 'var(--space-1)' }}
      >
        <h1
          style={{
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--text-lg-lh)',
            fontWeight: 600,
            margin: 0,
          }}
        >
          我的需求
        </h1>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          按近期更新排序 · 共 {items.length} 个
        </span>
      </header>
      <ul
        className="flex flex-col"
        style={{ gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}
      >
        {items.map((item) => (
          <RequirementListRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}

function RequirementListRow({ item }: { item: RequirementListItem }) {
  return (
    <li>
      <Link
        to={`/requirements/${item.id}`}
        style={{
          display: 'block',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'all 150ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
        }}
      >
        <div className="flex items-center justify-between" style={{ gap: 'var(--space-3)' }}>
          <div
            className="flex items-baseline min-w-0"
            style={{ gap: 'var(--space-2)' }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                lineHeight: 'var(--text-xs-lh)',
                color: 'var(--color-text-3)',
                flexShrink: 0,
              }}
            >
              {item.code}
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
              {item.name}
            </span>
          </div>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
              color: REQUIREMENT_STATUS_COLOR[item.mainStatus],
              flexShrink: 0,
            }}
          >
            {item.mainStatus}
          </span>
        </div>
        <div
          className="flex items-center"
          style={{
            marginTop: 'var(--space-1)',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-3)',
          }}
        >
          <span>提交于 {item.submittedAt}</span>
          <span>·</span>
          <span>{item.stageBrief}</span>
        </div>
      </Link>
    </li>
  )
}

// ============ 区域 2 · 当前焦点需求 ============

function FocusRequirementCard({ focus }: { focus: FocusRequirement }) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-2)',
          letterSpacing: '0.02em',
          marginBottom: 'var(--space-2)',
        }}
      >
        当前焦点需求
      </div>

      <div className="flex items-baseline" style={{ gap: 'var(--space-2)' }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-3)',
          }}
        >
          {focus.code}
        </span>
        <span
          style={{
            fontSize: 'var(--text-md)',
            lineHeight: 'var(--text-md-lh)',
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          {focus.name}
        </span>
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: REQUIREMENT_STATUS_COLOR[focus.mainStatus],
        }}
      >
        {focus.mainStatus}
      </div>

      <CurrentStageIndicator focus={focus} />
      <TaskMiniGraph nodes={focus.taskNodes} />

      <Link
        to={focus.href}
        style={{
          display: 'inline-block',
          marginTop: 'var(--space-4)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
          textDecoration: 'none',
        }}
      >
        进入详情 →
      </Link>
    </section>
  )
}

// 当前阶段指示器(单行)
// 替代多状态横排,焦点卡片只承担"瞥一眼就懂"的概览职责
// 完整状态轨迹的展示放到需求详情页
function CurrentStageIndicator({ focus }: { focus: FocusRequirement }) {
  const total = focus.trajectory.length
  const currentIdx = focus.trajectory.findIndex((n) => n.isCurrent) + 1
  return (
    <div
      className="flex items-baseline"
      style={{ marginTop: 'var(--space-3)', gap: 'var(--space-2)' }}
    >
      <span
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-3)',
        }}
      >
        当前阶段
      </span>
      <span
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: REQUIREMENT_STATUS_COLOR[focus.mainStatus],
          fontWeight: 500,
        }}
      >
        {focus.mainStatus}
      </span>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-3)',
        }}
      >
        ({currentIdx}/{total})
      </span>
    </div>
  )
}

const TASK_NODE_STYLE: Record<
  FocusTaskStatus,
  { background: string; border?: string }
> = {
  待处理: { background: 'var(--color-surface-2)', border: '1px solid var(--color-border-strong)' },
  执行中: { background: 'var(--color-status-running)' },
  已完成: { background: 'var(--color-status-success)' },
  占位: {
    background: 'var(--color-surface)',
    border: '1px dashed var(--color-border-strong)',
  },
}

function TaskMiniGraph({ nodes }: { nodes: FocusRequirement['taskNodes'] }) {
  return (
    <div style={{ marginTop: 'var(--space-3)' }}>
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 'var(--space-1)' }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-3)',
          }}
        >
          任务图(7 节点)
        </span>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-3)',
          }}
        >
          1/7 进行
        </span>
      </div>
      <div className="flex items-center" style={{ gap: 6 }}>
        {nodes.map((node) => {
          const s = TASK_NODE_STYLE[node.status]
          return (
            <span
              key={node.id}
              title={`任务-${node.id} · ${node.status}`}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: s.background,
                border: s.border ?? 'none',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

// ============ 区域 3 · 待你决策事项 ============

const DECISION_TYPE_COLOR: Record<DecisionItem['type'], string> = {
  任务待审查: 'var(--color-status-review)',
  需求待审查: 'var(--color-status-review)',
  澄清等待回复: 'var(--color-status-running)',
}

function DecisionItemsCard({ items }: { items: DecisionItem[] }) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
      }}
    >
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 'var(--space-3)' }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-2)',
            letterSpacing: '0.02em',
          }}
        >
          待你决策事项
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          {items.length} 条
        </span>
      </div>

      {items.length === 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm-lh)',
            color: 'var(--color-text-3)',
          }}
        >
          暂无待你决策的事项
        </p>
      ) : (
        <ul
          className="flex flex-col"
          style={{
            gap: 'var(--space-3)',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {items.map((item, i) => (
            <DecisionItemRow key={i} item={item} />
          ))}
        </ul>
      )}
    </section>
  )
}

function DecisionItemRow({ item }: { item: DecisionItem }) {
  return (
    <li>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: DECISION_TYPE_COLOR[item.type],
          marginBottom: 2,
        }}
      >
        {item.type}
      </div>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
          fontWeight: 500,
        }}
      >
        {item.title}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-3)',
        }}
      >
        {item.description}
      </div>
      <Link
        to={item.href}
        style={{
          display: 'inline-block',
          marginTop: 'var(--space-2)',
          padding: '4px var(--space-3)',
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text)',
          textDecoration: 'none',
          transition: 'all 150ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
        }}
      >
        去处理 →
      </Link>
    </li>
  )
}
