import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle, ChevronDown } from 'lucide-react'

import { mockTaskDetails } from '../lib/mock-data'
import type { TaskDetailFull, ValidationItem } from '../lib/mock-data'

// 单任务审查包页(V0.2.0 P1 · 沿用 V0.1.1 + 接入 V0.2 数据)
// 实现入口:docs/08 §单任务审查包页
// V0.2.0 阶段当前没有任务在"待审查"状态,但用户可从需求级审查包任务汇总点击进入,因此 /review/:id 必须可访问
// 加演示 banner 说明"单任务审查包快照"
// 决策按钮:接受结果 / 拒绝并反馈 / 更多操作(重新执行 / 让审查智能体复查)

export default function Review() {
  const { id } = useParams()
  const task = id ? mockTaskDetails[id] : undefined

  if (!task) {
    return <NotFound id={id ?? ''} />
  }
  if (task.isPlaceholder) {
    return <PlaceholderReview task={task} />
  }
  return <ReviewView task={task} />
}

function ReviewView({ task }: { task: TaskDetailFull }) {
  const [activeFile, setActiveFile] = useState<string>(
    task.diffs[0]?.file ?? task.changes[0]?.file ?? '',
  )
  return (
    <div
      className="flex flex-col"
      style={{
        gap: 'var(--space-4)',
        margin: 'calc(var(--layout-main-padding) * -1)',
        padding: 'var(--layout-main-padding)',
        paddingBottom: 96,
        minHeight: '100%',
      }}
    >
      <Header task={task} />
      <DemoBanner taskId={task.id} />
      <SummaryCard task={task} />
      <AcceptanceResultCard task={task} />
      <ChangesCard task={task} activeFile={activeFile} setActiveFile={setActiveFile} />
      <ValidationCard validations={task.validations} />
      <RiskAndSuggestionCard task={task} />
      <DecisionBar task={task} />
    </div>
  )
}

// ============ 顶部 ============

function Header({ task }: { task: TaskDetailFull }) {
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
          任务-{task.id}
        </span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>
          单任务审查包 · {task.shortName}
        </h1>
        <span
          style={{
            fontSize: 'var(--text-sm)',
            padding: '1px 8px',
            background: '#fff7ed',
            color: 'var(--color-status-review)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 500,
          }}
        >
          待审查
        </span>
      </div>
    </header>
  )
}

function DemoBanner({ taskId }: { taskId: string }) {
  return (
    <div
      className="flex items-start"
      style={{
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: '#fefce8',
        border: '1px solid #fde68a',
        borderRadius: 'var(--radius)',
      }}
    >
      <AlertCircle
        size={14}
        style={{ flexShrink: 0, marginTop: 3, color: 'var(--color-status-warn)' }}
      />
      <div style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--text-xs-lh)', color: 'var(--color-text-2)' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-status-warn)' }}>
          演示模式 · 单任务审查包快照
        </span>
        <span style={{ marginLeft: 6 }}>
          假设任务-{taskId} 已完成验证。当前 V0.2.0 主流程时刻(T0=14:15)实际可能未到此状态,本页展示审查包标准形态。
        </span>
      </div>
    </div>
  )
}

// ============ 任务回顾 + 智能体总结 ============

function SummaryCard({ task }: { task: TaskDetailFull }) {
  return (
    <Card>
      <SectionHeading>任务回顾</SectionHeading>
      <p
        style={{
          margin: 'var(--space-2) 0 0 0',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
        }}
      >
        {task.review.summary}
      </p>
      <div
        style={{
          marginTop: 'var(--space-3)',
          padding: 'var(--space-3)',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius)',
          borderLeft: '3px solid var(--color-status-running)',
        }}
      >
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', marginBottom: 4 }}>
          智能体总结
        </div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm-lh)',
            color: 'var(--color-text)',
          }}
        >
          {task.review.agentSummary}
        </div>
      </div>
    </Card>
  )
}

// ============ 验收标准结果 ============

function AcceptanceResultCard({ task }: { task: TaskDetailFull }) {
  return (
    <Card>
      <SectionHeading meta={task.review.acceptanceResult}>验收标准结果</SectionHeading>
      <ol
        className="flex flex-col"
        style={{
          gap: 'var(--space-2)',
          paddingLeft: 'var(--space-5)',
          margin: 'var(--space-3) 0 0 0',
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
            <span
              style={{
                color: 'var(--color-status-success)',
                marginRight: 'var(--space-2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ✓
            </span>
            {c}
          </li>
        ))}
      </ol>
    </Card>
  )
}

// ============ 修改文件清单 + 同页 diff 预览 ============

function ChangesCard({
  task,
  activeFile,
  setActiveFile,
}: {
  task: TaskDetailFull
  activeFile: string
  setActiveFile: (f: string) => void
}) {
  const activeDiff = task.diffs.find((d) => d.file === activeFile)
  return (
    <Card>
      <SectionHeading meta={`${task.changes.length} 个文件`}>修改文件清单</SectionHeading>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 280px) 1fr',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-3)',
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
          {task.changes.map((c) => {
            const isActive = c.file === activeFile
            const hasDiff = task.diffs.some((d) => d.file === c.file)
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
              未选择文件或该文件 diff 未展开
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

// ============ 验证结果 ============

function ValidationCard({ validations }: { validations: ValidationItem[] }) {
  const passed = validations.filter((v) => v.result === '通过').length
  return (
    <Card>
      <SectionHeading meta={`${passed} / ${validations.length} 通过`}>验证结果</SectionHeading>
      <ul
        className="flex flex-col"
        style={{
          gap: 'var(--space-2)',
          listStyle: 'none',
          padding: 0,
          margin: 'var(--space-3) 0 0 0',
        }}
      >
        {validations.map((v, i) => (
          <ValidationRow key={i} validation={v} />
        ))}
      </ul>
    </Card>
  )
}

function ValidationRow({ validation }: { validation: ValidationItem }) {
  const color =
    validation.result === '通过'
      ? 'var(--color-status-success)'
      : validation.result === '未通过'
        ? 'var(--color-status-danger)'
        : 'var(--color-text-3)'
  return (
    <li
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
          {validation.result}
        </span>
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
        {validation.name}
      </span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>
        {validation.detail}
      </span>
    </li>
  )
}

// ============ 风险 + 审查建议 ============

function RiskAndSuggestionCard({ task }: { task: TaskDetailFull }) {
  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-status-warn)',
              fontWeight: 600,
              marginBottom: 'var(--space-2)',
              letterSpacing: '0.02em',
            }}
          >
            风险提示
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
              color: 'var(--color-text)',
            }}
          >
            {task.review.risks}
          </p>
        </div>
        <div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-status-success)',
              fontWeight: 600,
              marginBottom: 'var(--space-2)',
              letterSpacing: '0.02em',
            }}
          >
            审查建议
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
              color: 'var(--color-text)',
            }}
          >
            {task.review.suggestion}
          </p>
        </div>
      </div>
    </Card>
  )
}

// ============ 决策选项区(sticky 底部)============

function DecisionBar({ task }: { task: TaskDetailFull }) {
  const navigate = useNavigate()
  const isHighRisk = task.riskLevel === '高'

  const handleAccept = () => {
    if (isHighRisk) {
      const ok = window.confirm(`任务-${task.id} 风险等级为高,确认接受结果?`)
      if (!ok) return
    }
    window.alert(`演示模式 · 接受任务-${task.id} 结果(进入下游调度)`)
  }
  const handleReject = () => {
    const reason = window.prompt('请填写拒绝并反馈的原因(必填):')
    if (!reason) return
    window.alert(`演示模式 · 拒绝任务-${task.id} 并反馈\n反馈:${reason}`)
  }
  const handleRetry = () => {
    const ok = window.confirm(`确认重新执行任务-${task.id}?(新建一次运行)`)
    if (!ok) return
    window.alert(`演示模式 · 任务-${task.id} 重新执行`)
  }
  const handleReviewAgain = () => {
    window.alert('演示模式 · 让审查智能体复查')
  }
  const handleViewRun = () => {
    const latest = task.runs[0]?.id
    if (latest) navigate(`/runs/${task.id}-${latest}`)
  }

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        marginLeft: 'calc(var(--layout-main-padding) * -1)',
        marginRight: 'calc(var(--layout-main-padding) * -1)',
        marginBottom: 'calc(var(--layout-main-padding) * -1)',
        padding: 'var(--space-3) var(--layout-main-padding)',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
        zIndex: 5,
      }}
    >
      <div
        className="flex items-center"
        style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}
      >
        <SecondaryButton onClick={handleReject}>拒绝并反馈</SecondaryButton>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <TertiaryButton onClick={handleViewRun}>查看运行</TertiaryButton>
          <MoreActionsDropdown
            items={[
              { label: '重新执行', onClick: handleRetry },
              { label: '让审查智能体复查', onClick: handleReviewAgain },
            ]}
          />
          <PrimaryButton onClick={handleAccept}>
            接受结果{isHighRisk && ' (高风险二次确认)'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 32,
        padding: '0 var(--space-4)',
        background: 'var(--color-primary)',
        color: 'var(--color-primary-text)',
        border: 0,
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 32,
        padding: '0 var(--space-4)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function TertiaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 32,
        padding: '0 var(--space-3)',
        background: 'transparent',
        color: 'var(--color-text-2)',
        border: 0,
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function MoreActionsDropdown({ items }: { items: { label: string; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center"
        style={{
          gap: 4,
          height: 32,
          padding: '0 var(--space-3)',
          background: 'var(--color-surface)',
          color: 'var(--color-text-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
        }}
      >
        更多操作
        <ChevronDown size={12} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 4px)',
            right: 0,
            minWidth: 180,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            padding: 'var(--space-1) 0',
            zIndex: 10,
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setOpen(false)
                item.onClick()
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '6px var(--space-3)',
                background: 'transparent',
                border: 0,
                textAlign: 'left',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
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

function SectionHeading({
  children,
  meta,
}: {
  children: React.ReactNode
  meta?: string
}) {
  return (
    <header className="flex items-baseline" style={{ gap: 'var(--space-3)' }}>
      <h2
        style={{
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--text-base-lh)',
          fontWeight: 600,
          margin: 0,
        }}
      >
        {children}
      </h2>
      {meta && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)' }}>
          {meta}
        </span>
      )}
    </header>
  )
}

function PlaceholderReview({ task }: { task: TaskDetailFull }) {
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
        任务-{task.id} 单任务审查包
      </h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-3)', margin: 0 }}>
        任务-{task.id} 在 V0.2.0 阶段为占位,审查包尚未生成。V0.2.1 激活后将完整呈现。
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
        任务-{id} 审查包不存在
      </h1>
    </div>
  )
}
