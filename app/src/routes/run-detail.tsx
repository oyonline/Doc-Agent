import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { mockTaskDetails } from '../lib/mock-data'
import type {
  TaskDetailFull,
  TaskDetailContext,
  ValidationItem,
  FileChange,
  FileDiff,
} from '../lib/mock-data'

// 执行详情页(V0.2.0 P2 · 沿用 V0.1.1 5 Tab + 接入 V0.2 数据)
// 实现入口:docs/08 §执行详情页
// 5 Tab:时间线 / 上下文快照 / 日志 / 改动 / 验证(V0.2.0 不出现"决策与上下文",那是 V0.2.2)
//
// URL 参数:/runs/{taskId}-{runId}(如 /runs/1-1 表示任务-1 的运行-1)

type TabKey = 'timeline' | 'context' | 'logs' | 'changes' | 'validations'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'timeline', label: '时间线' },
  { key: 'context', label: '上下文快照' },
  { key: 'logs', label: '日志' },
  { key: 'changes', label: '改动' },
  { key: 'validations', label: '验证' },
]

export default function RunDetail() {
  const { id } = useParams()
  const parsed = parseRunId(id ?? '')
  if (!parsed) {
    return <NotFound id={id ?? ''} />
  }
  const task = mockTaskDetails[parsed.taskId]
  if (!task) {
    return <NotFound id={id ?? ''} />
  }
  const run = task.runs.find((r) => r.id === parsed.runId)
  if (!run || task.isPlaceholder) {
    return <NoRun task={task} runId={parsed.runId} />
  }
  return <RunView task={task} run={run} />
}

function parseRunId(id: string): { taskId: string; runId: string } | null {
  const m = id.match(/^(\d+)-(\d+)$/)
  if (!m) return null
  return { taskId: m[1], runId: m[2] }
}

function RunView({
  task,
  run,
}: {
  task: TaskDetailFull
  run: { id: string; startedAt: string; endedAt: string | null; result: string; validation: string }
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('timeline')
  const navigate = useNavigate()

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
      <Header task={task} run={run} />
      <ActionBar task={task} navigate={navigate} />

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

      {activeTab === 'timeline' && <TimelineTab events={task.timeline} />}
      {activeTab === 'context' && <ContextSnapshotTab context={task.context} />}
      {activeTab === 'logs' && <LogsTab events={task.timeline} taskId={task.id} />}
      {activeTab === 'changes' && <ChangesTab changes={task.changes} diffs={task.diffs} />}
      {activeTab === 'validations' && <ValidationsTab validations={task.validations} />}
    </div>
  )
}

// ============ 顶部 ============

function Header({
  task,
  run,
}: {
  task: TaskDetailFull
  run: { id: string; startedAt: string; endedAt: string | null; result: string; validation: string }
}) {
  return (
    <header className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
      <Link
        to={`/tasks/${task.id}`}
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回任务详情
      </Link>
      <div className="flex items-baseline" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-3)',
          }}
        >
          任务-{task.id} · 运行-{run.id}
        </span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>
          {task.shortName}
        </h1>
      </div>
      <div
        className="flex items-center"
        style={{
          gap: 'var(--space-4)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
        }}
      >
        <span>
          开始 · <span style={{ fontFamily: 'var(--font-mono)' }}>{run.startedAt}</span>
        </span>
        <span>
          结束 · <span style={{ fontFamily: 'var(--font-mono)' }}>{run.endedAt ?? '—'}</span>
        </span>
        <span>结果 · {run.result}</span>
        <span>
          验证 · <span style={{ fontFamily: 'var(--font-mono)' }}>{run.validation}</span>
        </span>
      </div>
    </header>
  )
}

function ActionBar({ task, navigate }: { task: TaskDetailFull; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="flex" style={{ gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <ActionButton onClick={() => navigate(`/tasks/${task.id}`)}>返回任务详情</ActionButton>
      <ActionButton onClick={() => navigate(`/review/${task.id}`)}>查看审查包</ActionButton>
    </div>
  )
}

function ActionButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 28,
        padding: '0 var(--space-3)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

// ============ Tab 1 · 时间线 ============

function TimelineTab({ events }: { events: { time: string; text: string }[] }) {
  if (events.length === 0) {
    return (
      <Card>
        <Empty>本运行无时间线记录</Empty>
      </Card>
    )
  }
  return (
    <Card>
      <ul
        className="flex flex-col"
        style={{
          gap: 'var(--space-2)',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {events.map((e, i) => (
          <li
            key={i}
            className="flex"
            style={{
              gap: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-3)',
                minWidth: 56,
                flexShrink: 0,
              }}
            >
              {e.time}
            </span>
            <span style={{ color: 'var(--color-text)' }}>{e.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ============ Tab 2 · 上下文快照 ============

function ContextSnapshotTab({ context }: { context: TaskDetailContext }) {
  const items = [
    { label: '角色', value: context.role },
    { label: '任务', value: context.task, full: true },
    { label: '项目规则', value: context.projectRules, full: true },
    { label: '工作区', value: context.workspace, mono: true },
    { label: '需要运行的验证', value: context.validations, full: true },
    { label: '上一次反馈', value: context.lastFeedback },
    { label: '安全模式', value: context.safetyMode },
  ]
  return (
    <Card>
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
    </Card>
  )
}

// ============ Tab 3 · 日志 ============
// V0.2.0 阶段没有详细日志数据,基于 timeline 渲染成 terminal 风格作为"事件级日志"
// 后续真实实现时再接入 stdout/stderr/structured log

function LogsTab({
  events,
  taskId,
}: {
  events: { time: string; text: string }[]
  taskId: string
}) {
  if (events.length === 0) {
    return (
      <Card>
        <Empty>本运行无日志</Empty>
      </Card>
    )
  }
  return (
    <Card>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          marginBottom: 'var(--space-2)',
        }}
      >
        V0.2.0 阶段日志基于事件流渲染(尚未接入 stdout / stderr / structured log)
      </div>
      <pre
        style={{
          margin: 0,
          padding: 'var(--space-3)',
          background: '#0b1020',
          borderRadius: 'var(--radius)',
          color: '#cbd5e1',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          lineHeight: 1.7,
          overflow: 'auto',
          maxHeight: 480,
          whiteSpace: 'pre',
        }}
      >
        {events.map((e, i) => (
          <span key={i} style={{ display: 'block' }}>
            <span style={{ color: '#94a3b8' }}>[{e.time}] </span>
            <span style={{ color: '#93c5fd' }}>task-{taskId} </span>
            <span style={{ color: '#cbd5e1' }}>{e.text}</span>
          </span>
        ))}
      </pre>
    </Card>
  )
}

// ============ Tab 4 · 改动(文件清单 + 同页 diff)============

function ChangesTab({ changes, diffs }: { changes: FileChange[]; diffs: FileDiff[] }) {
  const [activeFile, setActiveFile] = useState<string>(diffs[0]?.file ?? changes[0]?.file ?? '')
  const activeDiff = diffs.find((d) => d.file === activeFile)
  if (changes.length === 0) {
    return (
      <Card>
        <Empty>本运行无改动</Empty>
      </Card>
    )
  }
  return (
    <Card>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 300px) 1fr',
          gap: 'var(--space-3)',
        }}
      >
        <ul
          className="flex flex-col"
          style={{
            gap: 4,
            listStyle: 'none',
            padding: 0,
            margin: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          {changes.map((c) => {
            const isActive = c.file === activeFile
            const hasDiff = diffs.some((d) => d.file === c.file)
            return (
              <li key={c.file}>
                <button
                  type="button"
                  onClick={() => hasDiff && setActiveFile(c.file)}
                  disabled={!hasDiff}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: 'var(--space-2) var(--space-3)',
                    background: isActive ? 'var(--color-surface-2)' : 'transparent',
                    border: 0,
                    borderLeft: `2px solid ${isActive ? 'var(--color-text)' : 'transparent'}`,
                    cursor: hasDiff ? 'pointer' : 'default',
                    textAlign: 'left',
                    opacity: hasDiff ? 1 : 0.6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.file}
                  </div>
                  <div
                    className="flex items-center"
                    style={{
                      gap: 6,
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-3)',
                      marginTop: 2,
                    }}
                  >
                    <span>{c.type}</span>
                    {c.addedLines !== undefined && (
                      <span style={{ color: 'var(--color-status-success)', fontFamily: 'var(--font-mono)' }}>
                        +{c.addedLines}
                      </span>
                    )}
                    {c.removedLines !== undefined && c.removedLines > 0 && (
                      <span style={{ color: 'var(--color-status-danger)', fontFamily: 'var(--font-mono)' }}>
                        −{c.removedLines}
                      </span>
                    )}
                    {c.noteApprox && <span style={{ color: 'var(--color-text-3)' }}>(估算)</span>}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
        <div
          style={{
            background: '#0b1020',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-3)',
            overflow: 'auto',
            minHeight: 200,
            maxHeight: 480,
          }}
        >
          {activeDiff ? (
            <pre
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                lineHeight: 1.6,
                color: '#cbd5e1',
                whiteSpace: 'pre',
              }}
            >
              {activeDiff.diff.split('\n').map((line, i) => {
                let color = '#cbd5e1'
                if (line.startsWith('+')) color = '#86efac'
                else if (line.startsWith('-')) color = '#fca5a5'
                else if (line.startsWith('@')) color = '#93c5fd'
                return (
                  <span key={i} style={{ color, display: 'block' }}>
                    {line || ' '}
                  </span>
                )
              })}
            </pre>
          ) : (
            <span style={{ color: '#94a3b8', fontSize: 'var(--text-xs)' }}>
              该文件 diff 未展开
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

// ============ Tab 5 · 验证 ============

function ValidationsTab({ validations }: { validations: ValidationItem[] }) {
  if (validations.length === 0) {
    return (
      <Card>
        <Empty>本运行无验证记录</Empty>
      </Card>
    )
  }
  const passed = validations.filter((v) => v.result === '通过').length
  return (
    <Card>
      <div
        className="flex items-baseline"
        style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}
      >
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0 }}>验证结果</h2>
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-3)' }}>
          {passed} / {validations.length} 通过
        </span>
      </div>
      <ul
        className="flex flex-col"
        style={{ gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}
      >
        {validations.map((v, i) => {
          const color =
            v.result === '通过'
              ? 'var(--color-status-success)'
              : v.result === '未通过'
                ? 'var(--color-status-danger)'
                : 'var(--color-text-3)'
          return (
            <li
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 200px 1fr',
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-sm)',
                alignItems: 'baseline',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: color,
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color, fontWeight: 500 }}>
                  {v.result}
                </span>
              </span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                {v.name}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-2)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {v.detail}
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
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

function Empty({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  )
}

function NoRun({ task, runId }: { task: TaskDetailFull; runId: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
      <Link
        to={`/tasks/${task.id}`}
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回任务详情
      </Link>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>
        任务-{task.id} · 运行-{runId} 不存在
      </h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-3)', margin: 0 }}>
        该任务尚未启动或运行编号不正确(任务-7 在 V0.2.0 阶段为占位)。
      </p>
    </div>
  )
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
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>
        运行 {id} 不存在
      </h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-3)', margin: 0 }}>
        URL 格式应为 /runs/{'{taskId}-{runId}'}(如 /runs/1-1)。
      </p>
    </div>
  )
}
