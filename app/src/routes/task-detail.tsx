import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { mockTaskDetails } from '../lib/mock-data'
import type {
  TaskDetailFull,
  TaskDetailContext,
  TaskRunRecord,
  TaskStatus,
  RiskLevel,
} from '../lib/mock-data'

// 任务详情页(V0.2.0 P1 · 沿用 V0.1.1 4 Tab + 接入 V0.2 数据)
// 实现入口:docs/08 §任务详情页
// V0.2.0 阶段 Tab:概览 / 上下文 / 验收标准 / 历史运行
// (V0.2.2 阶段才升级为"决策与上下文",本步严禁出现)
// 顶部按钮:查看运行详情 / 停止 / 重试 / 查看审查包
//
// 时刻基准:T5+ 完成时刻(任务全生命周期视图);任务-7 占位

const TASK_STATUS_COLOR: Record<TaskStatus | '占位', string> = {
  待处理: 'var(--color-status-idle)',
  执行中: 'var(--color-status-running)',
  验证中: 'var(--color-status-verify)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
  占位: 'var(--color-text-3)',
}

const AGENT_LABEL_COLOR: Record<TaskDetailFull['agentType'], string> = {
  后端: 'var(--color-status-running)',
  前端: 'var(--color-status-verify)',
  测试: 'var(--color-status-warn)',
}

const RISK_COLOR: Record<RiskLevel, string> = {
  高: 'var(--color-status-danger)',
  中: 'var(--color-status-warn)',
  低: 'var(--color-status-idle)',
}

type TabKey = 'overview' | 'context' | 'acceptance' | 'runs'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: '概览' },
  { key: 'context', label: '上下文' },
  { key: 'acceptance', label: '验收标准' },
  { key: 'runs', label: '历史运行' },
]

export default function TaskDetail() {
  const { id } = useParams()
  const task = id ? mockTaskDetails[id] : undefined

  if (!task) {
    return <NotFound id={id ?? ''} />
  }

  return <TaskDetailView task={task} />
}

function TaskDetailView({ task }: { task: TaskDetailFull }) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const navigate = useNavigate()
  const isPh = task.isPlaceholder === true

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
      <Header task={task} />
      {isPh && <PlaceholderBanner />}
      <ActionBar task={task} />

      <nav style={{ borderBottom: '1px solid var(--color-border)' }}>
        <ul
          className="flex"
          style={{ gap: 'var(--space-5)', listStyle: 'none', padding: 0, margin: 0 }}
        >
          {TABS.map((t) => {
            const isActive = activeTab === t.key
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    background: 'transparent',
                    border: 0,
                    cursor: 'pointer',
                    padding: '8px 0',
                    fontSize: 'var(--text-sm)',
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-3)',
                    fontWeight: isActive ? 600 : 400,
                    borderBottom: isActive
                      ? '2px solid var(--color-text)'
                      : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  {t.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {activeTab === 'overview' && <OverviewTab task={task} />}
      {activeTab === 'context' && <ContextTab task={task} />}
      {activeTab === 'acceptance' && <AcceptanceTab task={task} />}
      {activeTab === 'runs' && <RunsTab task={task} navigate={navigate} />}
    </div>
  )
}

// ============ 顶部 ============

function Header({ task }: { task: TaskDetailFull }) {
  const isPh = task.isPlaceholder === true
  return (
    <header className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
      <Link
        to="/tasks"
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回任务板
      </Link>
      <div className="flex items-baseline" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-3)' }}>
          任务-{task.id}
        </span>
        <h1
          style={{
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--text-xl-lh)',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {task.fullName}
        </h1>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: AGENT_LABEL_COLOR[task.agentType],
            padding: '1px 6px',
            background: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {task.agentType}
        </span>
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: TASK_STATUS_COLOR[task.status],
            fontWeight: 500,
          }}
        >
          {isPh ? '占位 · 待 V0.2.1 激活' : task.status}
        </span>
      </div>
      {!isPh && (
        <div className="flex items-center" style={{ gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          <span>验证 · <span style={{ fontFamily: 'var(--font-mono)' }}>{task.validation}</span></span>
          {task.riskLevel && (
            <span style={{ color: RISK_COLOR[task.riskLevel] }}>{task.riskLevel}风险</span>
          )}
        </div>
      )}
    </header>
  )
}

function PlaceholderBanner() {
  return (
    <div
      style={{
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-surface-2)',
        border: '1px dashed var(--color-border-strong)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--text-sm-lh)',
        color: 'var(--color-text-2)',
      }}
    >
      此任务为 V0.2.0 阶段占位,V0.2.1 激活后将参与调度。占位形态下不展开运行 / 改动 / 单任务审查包。
    </div>
  )
}

function ActionBar({ task }: { task: TaskDetailFull }) {
  const navigate = useNavigate()
  const isPh = task.isPlaceholder === true
  const latestRunId = task.runs[0]?.id

  const onAction = (label: string) => {
    window.alert(`演示模式 · "${label}" 动作触发(V0.2 不实际执行)`)
  }

  return (
    <div className="flex" style={{ gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <ActionButton
        disabled={isPh || !latestRunId}
        onClick={() => navigate(`/runs/${task.id}-${latestRunId}`)}
      >
        查看运行详情
      </ActionButton>
      <ActionButton disabled={isPh} onClick={() => onAction('停止')}>
        停止
      </ActionButton>
      <ActionButton disabled={isPh} onClick={() => onAction('重试')}>
        重试
      </ActionButton>
      <ActionButton
        disabled={isPh}
        onClick={() => navigate(`/review/${task.id}`)}
      >
        查看审查包
      </ActionButton>
    </div>
  )
}

function ActionButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 28,
        padding: '0 var(--space-3)',
        background: 'var(--color-surface)',
        color: disabled ? 'var(--color-text-3)' : 'var(--color-text)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}

// ============ Tab 1 · 概览 ============

function OverviewTab({ task }: { task: TaskDetailFull }) {
  const items = [
    { label: '目标', value: task.overview.goal, full: true },
    { label: '依赖', value: task.overview.dependencies },
    { label: '智能体', value: `${task.agentType}智能体` },
    { label: '工作区', value: task.overview.workspace, mono: true },
  ]
  return (
    <Card>
      <FieldGrid items={items} />
    </Card>
  )
}

// ============ Tab 2 · 上下文(V0.2.0 形态,非"决策与上下文")============

function ContextTab({ task }: { task: TaskDetailFull }) {
  const c: TaskDetailContext = task.context
  const items = [
    { label: '角色', value: c.role },
    { label: '任务', value: c.task, full: true },
    { label: '验收标准', value: '见验收标准 Tab' },
    { label: '项目规则', value: c.projectRules, full: true },
    { label: '工作区', value: c.workspace, mono: true },
    { label: '需要运行的验证', value: c.validations, full: true },
    { label: '上一次反馈', value: c.lastFeedback },
    { label: '安全模式', value: c.safetyMode },
  ]
  return (
    <Card>
      <FieldGrid items={items} />
    </Card>
  )
}

// ============ Tab 3 · 验收标准 ============

function AcceptanceTab({ task }: { task: TaskDetailFull }) {
  return (
    <Card>
      <ol
        className="flex flex-col"
        style={{
          gap: 'var(--space-3)',
          paddingLeft: 'var(--space-5)',
          margin: 0,
        }}
      >
        {task.acceptanceCriteria.map((c, i) => (
          <li
            key={i}
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
              color: 'var(--color-text)',
            }}
          >
            {c}
          </li>
        ))}
      </ol>
    </Card>
  )
}

// ============ Tab 4 · 历史运行 ============

function RunsTab({
  task,
  navigate,
}: {
  task: TaskDetailFull
  navigate: ReturnType<typeof useNavigate>
}) {
  if (task.runs.length === 0) {
    return (
      <Card>
        <div
          style={{
            padding: 'var(--space-3)',
            background: 'var(--color-surface-2)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-2)',
          }}
        >
          暂无运行记录(任务未启动)
        </div>
      </Card>
    )
  }
  return (
    <Card>
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--text-sm)',
          }}
        >
          <thead>
            <tr
              style={{
                background: 'var(--color-surface-2)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-2)',
                letterSpacing: '0.02em',
                textAlign: 'left',
              }}
            >
              <Th width={80}>运行</Th>
              <Th width={80}>开始</Th>
              <Th width={80}>结束</Th>
              <Th width={100}>结果</Th>
              <Th width={120}>验证</Th>
              <Th>触发</Th>
              <Th width={56} />
            </tr>
          </thead>
          <tbody>
            {task.runs.map((run) => (
              <RunRow
                key={run.id}
                taskId={task.id}
                run={run}
                onClick={() => navigate(`/runs/${task.id}-${run.id}`)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function RunRow({
  taskId: _taskId,
  run,
  onClick,
}: {
  taskId: string
  run: TaskRunRecord
  onClick: () => void
}) {
  return (
    <tr
      style={{
        borderTop: '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-surface-2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <Td>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>
          运行-{run.id}
        </span>
      </Td>
      <Td>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{run.startedAt}</span>
      </Td>
      <Td>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
          {run.endedAt ?? '—'}
        </span>
      </Td>
      <Td>
        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{run.result}</span>
      </Td>
      <Td>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>
          {run.validation}
        </span>
      </Td>
      <Td>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>{run.trigger ?? '—'}</span>
      </Td>
      <Td>
        <span style={{ color: 'var(--color-text-3)', fontSize: 'var(--text-xs)' }}>查看 →</span>
      </Td>
    </tr>
  )
}

// ============ 共用 ============

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
      }}
    >
      {children}
    </section>
  )
}

function FieldGrid({
  items,
}: {
  items: { label: string; value: string; full?: boolean; mono?: boolean }[]
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-4)',
      }}
    >
      {items.map((item) => (
        <div key={item.label} style={{ gridColumn: item.full ? '1 / -1' : 'auto' }}>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-3)',
              marginBottom: 4,
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
              color: 'var(--color-text)',
              fontFamily: item.mono ? 'var(--font-mono)' : undefined,
              whiteSpace: 'pre-wrap',
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}

function Th({ children, width }: { children?: React.ReactNode; width?: number }) {
  return (
    <th style={{ padding: '8px var(--space-3)', fontWeight: 400, width }}>
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '10px var(--space-3)' }}>{children}</td>
}

function NotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
      <Link
        to="/tasks"
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回任务板
      </Link>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>任务-{id} 不存在</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-3)', margin: 0 }}>
        请从任务板进入有效的任务编号。
      </p>
    </div>
  )
}
