import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import {
  mockRequirementDetail,
  mockClarifyTurns,
  mockSecondClarify,
  mockPRD,
  mockFeasibility,
  mockTaskGraph,
  mockTaskProgress,
} from '../lib/mock-data'
import type {
  RequirementMainStatus,
  ClarifyTurn,
  PRDDocument,
  RiskItem,
  RiskLevel,
  FeasibilityEvaluation,
  TaskProgressItem,
  TaskStatus,
} from '../lib/mock-data'
import RequirementTaskGraph from '../components/RequirementTaskGraph'

// 需求详情页(V0.2.0 P0)
// 实现入口:docs/08 §需求详情页
// 5 视图按流程顺序纵向铺开:多轮澄清 → PRD → 可行性评估 → 任务图 → 执行进度
// 顶部 sticky 锚点导航,点击滚动到对应锚点
// 当前需求-001 主状态 = 执行中,所以底部按钮区不显示"启动执行"或"查看需求级审查包"

const REQUIREMENT_STATUS_COLOR: Record<RequirementMainStatus, string> = {
  待澄清: 'var(--color-status-idle)',
  澄清中: 'var(--color-status-running)',
  'PRD 已定': 'var(--color-status-verify)',
  拆解中: 'var(--color-status-verify)',
  执行中: 'var(--color-status-running)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
}

const RISK_COLOR: Record<RiskLevel, string> = {
  高: 'var(--color-status-danger)',
  中: 'var(--color-status-warn)',
  低: 'var(--color-status-idle)',
}

type AnchorId = 'clarify' | 'prd' | 'feasibility' | 'task-graph' | 'progress'

const ANCHORS: { id: AnchorId; label: string }[] = [
  { id: 'clarify', label: '多轮澄清' },
  { id: 'prd', label: 'PRD' },
  { id: 'feasibility', label: '可行性评估' },
  { id: 'task-graph', label: '任务图' },
  { id: 'progress', label: '执行进度' },
]

export default function RequirementDetail() {
  const { id } = useParams()
  const isMain = id === '001'

  if (!isMain) {
    return <NonMainPlaceholder id={id ?? ''} />
  }

  return (
    <div
      className="flex flex-col"
      style={{
        gap: 'var(--space-5)',
        // 让锚点导航 sticky 时与外层 main padding 对齐
        margin: 'calc(var(--layout-main-padding) * -1)',
        padding: 'var(--layout-main-padding)',
        minHeight: '100%',
      }}
    >
      <DetailHeader />
      <AnchorNav />
      <ClarifyView />
      <PRDView prd={mockPRD} />
      <FeasibilityView feasibility={mockFeasibility} />
      <TaskGraphView />
      <ProgressView items={mockTaskProgress} />
    </div>
  )
}

// ============ 顶部 · 需求基本信息 ============

function DetailHeader() {
  const r = mockRequirementDetail
  return (
    <header className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
      <Link
        to="/"
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回需求工作台
      </Link>
      <div className="flex items-baseline" style={{ gap: 'var(--space-3)' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-3)' }}>
          {r.code}
        </span>
        <h1
          style={{
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--text-xl-lh)',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {r.name}
        </h1>
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: REQUIREMENT_STATUS_COLOR[r.mainStatus],
            fontWeight: 500,
          }}
        >
          {r.mainStatus}
        </span>
      </div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
        }}
      >
        提交人:{r.submittedBy} · 提交于 {r.submittedAt}
      </div>
      <div
        style={{
          marginTop: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
        }}
      >
        <span style={{ color: 'var(--color-text-3)', marginRight: 'var(--space-2)' }}>
          原始需求
        </span>
        {r.rawDescription}
      </div>
    </header>
  )
}

// ============ 锚点导航(sticky)============

function AnchorNav() {
  const [active, setActive] = useState<AnchorId>('clarify')

  // 监听滚动,识别当前可视的视图(用于高亮锚点)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 取与视口相交比例最大的一个作为 active
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          setActive(visible.target.id as AnchorId)
        }
      },
      { rootMargin: '-80px 0px -50% 0px', threshold: [0.1, 0.5] },
    )
    ANCHORS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleJump = (id: AnchorId) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        background: 'var(--color-bg)',
        paddingTop: 'var(--space-2)',
        paddingBottom: 'var(--space-2)',
        borderBottom: '1px solid var(--color-border)',
        marginLeft: 'calc(var(--layout-main-padding) * -1)',
        marginRight: 'calc(var(--layout-main-padding) * -1)',
        paddingLeft: 'var(--layout-main-padding)',
        paddingRight: 'var(--layout-main-padding)',
      }}
    >
      <ul
        className="flex"
        style={{
          gap: 'var(--space-5)',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {ANCHORS.map((a, i) => {
          const isActive = active === a.id
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => handleJump(a.id)}
                style={{
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  padding: '4px 0',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--text-sm-lh)',
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-3)',
                  fontWeight: isActive ? 600 : 400,
                  borderBottom: isActive
                    ? '2px solid var(--color-text)'
                    : '2px solid transparent',
                }}
              >
                <span style={{ color: 'var(--color-text-3)', marginRight: 4 }}>{i + 1}</span>
                {a.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ============ 共用 · 视图标题 ============

function ViewSection({
  id,
  title,
  meta,
  children,
}: {
  id: AnchorId
  title: string
  meta?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      style={{ scrollMarginTop: 56, paddingTop: 'var(--space-3)' }}
    >
      <header
        className="flex items-baseline"
        style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}
      >
        <h2
          style={{
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--text-lg-lh)',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {meta && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
            {meta}
          </span>
        )}
      </header>
      {children}
    </section>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ============ 视图 A · 多轮澄清 ============

function ClarifyView() {
  return (
    <ViewSection
      id="clarify"
      title="多轮澄清"
      meta={`3 主轮 + 1 二次澄清(由架构师评估触发)`}
    >
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        {mockClarifyTurns.map((turn) => (
          <ClarifyTurnCard key={turn.index} turn={turn} />
        ))}
        <SecondClarifyCard />
      </div>
    </ViewSection>
  )
}

function ClarifyTurnCard({ turn }: { turn: ClarifyTurn }) {
  return (
    <Card>
      <div
        className="flex items-baseline"
        style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}
      >
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          第 {turn.index} 轮
        </span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{turn.topic}</span>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-3)',
            marginLeft: 'auto',
          }}
        >
          {turn.time}
        </span>
      </div>
      <DialogBlock role="产品智能体" content={turn.question} />
      <DialogBlock role="用户" content={turn.answer} alignRight />
      {turn.productResponse && (
        <DialogBlock role="产品智能体" content={turn.productResponse} />
      )}
    </Card>
  )
}

function SecondClarifyCard() {
  const c = mockSecondClarify
  return (
    <Card style={{ borderColor: 'var(--color-status-warn)' }}>
      <div
        className="flex items-baseline"
        style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            background: '#fefce8',
            color: 'var(--color-status-warn)',
          }}
        >
          二次澄清
        </span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{c.topic}</span>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-3)',
            marginLeft: 'auto',
          }}
        >
          {c.time}
        </span>
      </div>
      <DialogBlock role="产品智能体" content={c.question} />
      <DialogBlock role="用户" content={c.answer} alignRight />
      <div
        style={{
          marginTop: 'var(--space-3)',
          padding: 'var(--space-3)',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
        }}
      >
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', marginBottom: 4 }}>
          PRD 验收标准追加
        </div>
        <span>{c.prdAddition}</span>
      </div>
    </Card>
  )
}

function DialogBlock({
  role,
  content,
  alignRight,
}: {
  role: '产品智能体' | '用户'
  content: string
  alignRight?: boolean
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        gap: 4,
        marginBottom: 'var(--space-3)',
        alignItems: alignRight ? 'flex-end' : 'flex-start',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-xs)',
          color: alignRight ? 'var(--color-status-running)' : 'var(--color-text-2)',
        }}
      >
        {role}
      </span>
      <div
        style={{
          maxWidth: '85%',
          padding: 'var(--space-3)',
          background: alignRight ? 'var(--color-surface-2)' : 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
          whiteSpace: 'pre-line',
        }}
      >
        {content}
      </div>
    </div>
  )
}

// ============ 视图 B · PRD ============

function PRDView({ prd }: { prd: PRDDocument }) {
  return (
    <ViewSection id="prd" title="PRD" meta="二次澄清后第 6 条验收标准追加">
      <Card>
        <PRDBlock title="背景">
          <Paragraph>{prd.background}</Paragraph>
        </PRDBlock>
        <PRDBlock title="目标">
          <BulletList items={prd.goals} />
        </PRDBlock>
        <PRDBlock title="范围 · 包含">
          <BulletList items={prd.scopeIncluded} />
        </PRDBlock>
        <PRDBlock title="范围 · 不包含">
          <BulletList items={prd.scopeExcluded} muted />
        </PRDBlock>
        <PRDBlock title="用户故事">
          <ul
            className="flex flex-col"
            style={{ gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}
          >
            {prd.userStories.map((s, i) => (
              <li
                key={i}
                style={{
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--text-sm-lh)',
                  color: 'var(--color-text)',
                }}
              >
                作为 <strong>{s.role}</strong>,我希望{s.want},以便{s.reason}。
              </li>
            ))}
          </ul>
        </PRDBlock>
        <PRDBlock title="需求级验收标准" last>
          <ol
            className="flex flex-col"
            style={{ gap: 'var(--space-2)', paddingLeft: 'var(--space-5)', margin: 0 }}
          >
            {prd.acceptanceCriteria.map((c, i) => (
              <li
                key={i}
                style={{
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--text-sm-lh)',
                  color: 'var(--color-text)',
                }}
              >
                {c.text}
                {c.addedBySecondClarify && (
                  <span
                    style={{
                      marginLeft: 'var(--space-2)',
                      padding: '1px 6px',
                      fontSize: 'var(--text-xs)',
                      borderRadius: 'var(--radius-sm)',
                      background: '#fefce8',
                      color: 'var(--color-status-warn)',
                    }}
                  >
                    二次澄清追加
                  </span>
                )}
              </li>
            ))}
          </ol>
        </PRDBlock>
      </Card>
    </ViewSection>
  )
}

function PRDBlock({
  title,
  children,
  last,
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div style={{ marginBottom: last ? 0 : 'var(--space-4)' }}>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-2)',
          letterSpacing: '0.02em',
          marginBottom: 'var(--space-2)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--text-sm-lh)',
        color: 'var(--color-text)',
      }}
    >
      {children}
    </p>
  )
}

function BulletList({ items, muted }: { items: string[]; muted?: boolean }) {
  return (
    <ul
      className="flex flex-col"
      style={{
        gap: 4,
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {items.map((s, i) => (
        <li
          key={i}
          className="flex"
          style={{
            gap: 'var(--space-2)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm-lh)',
            color: muted ? 'var(--color-text-2)' : 'var(--color-text)',
          }}
        >
          <span style={{ color: 'var(--color-text-3)', flexShrink: 0 }}>·</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  )
}

// ============ 视图 C · 可行性评估 ============

function FeasibilityView({ feasibility }: { feasibility: FeasibilityEvaluation }) {
  return (
    <ViewSection id="feasibility" title="可行性评估" meta="经历 1 次驳回 + 1 次二次评估,通过">
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        <FeasibilityTimeline />
        <RisksTable risks={feasibility.firstRisks} secondRisks={feasibility.secondRisks} />
        <ImplementationDirectionsCard feasibility={feasibility} />
        <KeyDecisionsCard feasibility={feasibility} />
      </div>
    </ViewSection>
  )
}

function FeasibilityTimeline() {
  const f = mockFeasibility
  const steps = [
    { time: f.firstEvalTime, label: '首次评估', detail: '识别 1 项高风险 R-001' },
    { time: f.rejectedAtTime, label: '已驳回', detail: '触发产品智能体二次澄清', isAnomaly: true },
    {
      time: mockSecondClarify.time,
      label: '二次澄清',
      detail: '用户选择双保险策略',
    },
    {
      time: f.secondEvalTime,
      label: '二次评估',
      detail: 'R-001 降级为中,通过',
      isSuccess: true,
    },
  ]
  return (
    <Card>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-2)',
          letterSpacing: '0.02em',
          marginBottom: 'var(--space-3)',
        }}
      >
        评估时间线
      </div>
      <div className="flex" style={{ gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <div key={i} className="flex items-center" style={{ gap: 'var(--space-2)' }}>
            <div
              style={{
                padding: '4px var(--space-3)',
                background: s.isAnomaly
                  ? '#fee2e2'
                  : s.isSuccess
                    ? '#f0fdf4'
                    : 'var(--color-surface-2)',
                border: `1px solid ${
                  s.isAnomaly
                    ? 'var(--color-status-danger)'
                    : s.isSuccess
                      ? 'var(--color-status-success)'
                      : 'var(--color-border)'
                }`,
                borderRadius: 'var(--radius)',
                fontSize: 'var(--text-xs)',
                lineHeight: 'var(--text-xs-lh)',
                color: s.isAnomaly
                  ? 'var(--color-status-danger)'
                  : s.isSuccess
                    ? 'var(--color-status-success)'
                    : 'var(--color-text)',
              }}
            >
              <span style={{ color: 'var(--color-text-3)', marginRight: 6 }}>{s.time}</span>
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <span style={{ color: 'var(--color-text-3)', fontSize: 'var(--text-sm)' }}>›</span>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 'var(--space-3)',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-2)',
        }}
      >
        最终结论:{f.secondConclusion}
      </div>
    </Card>
  )
}

function RisksTable({
  risks,
  secondRisks,
}: {
  risks: RiskItem[]
  secondRisks: RiskItem[]
}) {
  // 用二次评估后的 R-001 替换首次评估中的 R-001(标注降级)
  const merged = risks.map((r) => {
    const updated = secondRisks.find((s) => s.code === r.code)
    return updated ?? r
  })

  return (
    <Card>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-2)',
          letterSpacing: '0.02em',
          marginBottom: 'var(--space-3)',
        }}
      >
        风险清单(最终 0 高 + 4 中 + 1 低)
      </div>
      <ul
        className="flex flex-col"
        style={{ gap: 'var(--space-3)', listStyle: 'none', padding: 0, margin: 0 }}
      >
        {merged.map((r) => (
          <RiskRow key={r.code} risk={r} />
        ))}
      </ul>
    </Card>
  )
}

function RiskRow({ risk }: { risk: RiskItem }) {
  return (
    <li
      style={{
        padding: 'var(--space-3)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
      }}
    >
      <div className="flex items-baseline" style={{ gap: 'var(--space-2)', marginBottom: 4 }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-3)',
          }}
        >
          {risk.code}
        </span>
        <span
          style={{
            padding: '1px 8px',
            fontSize: 'var(--text-xs)',
            borderRadius: 'var(--radius-sm)',
            background:
              risk.level === '高'
                ? '#fee2e2'
                : risk.level === '中'
                  ? '#fefce8'
                  : 'var(--color-surface-2)',
            color: RISK_COLOR[risk.level],
          }}
        >
          {risk.level}
        </span>
        {risk.degradedFromHigh && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-status-success)',
            }}
          >
            ← 由高降级
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
          marginBottom: 4,
        }}
      >
        {risk.description}
      </div>
      <RiskDetailRow label="影响范围" value={risk.scope} />
      <RiskDetailRow label="缓解建议" value={risk.mitigation} />
    </li>
  )
}

function RiskDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex" style={{ gap: 'var(--space-2)', marginTop: 2 }}>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          flexShrink: 0,
          minWidth: 56,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-2)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function ImplementationDirectionsCard({
  feasibility,
}: {
  feasibility: FeasibilityEvaluation
}) {
  const colorByArea = {
    后端: 'var(--color-status-running)',
    前端: 'var(--color-status-verify)',
    测试: 'var(--color-status-warn)',
  } as const
  return (
    <Card>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-2)',
          letterSpacing: '0.02em',
          marginBottom: 'var(--space-3)',
        }}
      >
        实现方向建议
      </div>
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        {feasibility.implementationDirections.map((d, i) => (
          <div key={i}>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: colorByArea[d.area],
                marginBottom: 4,
              }}
            >
              {d.area}
            </div>
            <div
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--text-sm-lh)',
                color: 'var(--color-text)',
              }}
            >
              {d.content}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function KeyDecisionsCard({
  feasibility,
}: {
  feasibility: FeasibilityEvaluation
}) {
  return (
    <Card>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-2)',
          letterSpacing: '0.02em',
          marginBottom: 'var(--space-3)',
        }}
      >
        关键技术决策(架构师层面)
      </div>
      <ol
        className="flex flex-col"
        style={{
          gap: 'var(--space-3)',
          paddingLeft: 'var(--space-5)',
          margin: 0,
        }}
      >
        {feasibility.keyDecisions.map((d, i) => (
          <li
            key={i}
            style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--text-sm-lh)' }}
          >
            <div style={{ color: 'var(--color-text)' }}>{d.description}</div>
            <div
              style={{
                marginTop: 2,
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-3)',
              }}
            >
              理由:{d.reason}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}

// ============ 视图 D · 任务图 ============

function TaskGraphView() {
  return (
    <ViewSection
      id="task-graph"
      title="任务图"
      meta="V0.2.0 实线 · 7 节点(任务-7 占位,待 V0.2.1 激活)"
    >
      <Card>
        <RequirementTaskGraph
          nodes={mockTaskGraph.nodes}
          edges={mockTaskGraph.edges}
        />
        <div
          className="flex items-center"
          style={{
            marginTop: 'var(--space-3)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--color-border)',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <LegendDot color="var(--color-status-running)" label="执行中" />
          <LegendDot color="var(--color-status-success)" label="已完成" />
          <LegendDot color="var(--color-status-idle)" label="待处理" />
          <LegendDot color="var(--color-text-3)" label="占位 · 待 V0.2.1 激活" dashed />
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-3)',
            }}
          >
            点击节点可进入任务详情
          </span>
        </div>
      </Card>
    </ViewSection>
  )
}

function LegendDot({
  color,
  label,
  dashed,
}: {
  color: string
  label: string
  dashed?: boolean
}) {
  return (
    <span className="inline-flex items-center" style={{ gap: 6 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: dashed ? 'transparent' : color,
          border: dashed ? `1px dashed var(--color-border-strong)` : 'none',
          display: 'inline-block',
        }}
      />
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>
        {label}
      </span>
    </span>
  )
}

// ============ 视图 E · 执行进度 ============

const TASK_STATUS_COLOR: Record<TaskStatus | '占位', string> = {
  待处理: 'var(--color-status-idle)',
  执行中: 'var(--color-status-running)',
  验证中: 'var(--color-status-verify)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
  占位: 'var(--color-text-3)',
}

const AGENT_LABEL: Record<TaskProgressItem['agentType'], string> = {
  后端: 'var(--color-status-running)',
  前端: 'var(--color-status-verify)',
  测试: 'var(--color-status-warn)',
}

function ProgressView({ items }: { items: TaskProgressItem[] }) {
  const activeCount = items.filter((i) => i.status === '执行中').length
  const doneCount = items.filter((i) => i.status === '已完成').length
  const total = items.filter((i) => !i.isPlaceholder).length
  return (
    <ViewSection
      id="progress"
      title="执行进度"
      meta={`${activeCount}/${total} 进行中 · ${doneCount}/${total} 已完成`}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {items.map((item) => (
          <ProgressCard key={item.id} item={item} />
        ))}
      </div>
    </ViewSection>
  )
}

function ProgressCard({ item }: { item: TaskProgressItem }) {
  const isActive = item.status === '执行中'
  const isPlaceholder = item.isPlaceholder === true
  return (
    <Link
      to={`/tasks/${item.id}`}
      style={{
        display: 'block',
        background: 'var(--color-surface)',
        border: `1px solid ${
          isActive ? 'var(--color-status-running)' : 'var(--color-border)'
        }`,
        borderStyle: isPlaceholder ? 'dashed' : 'solid',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        textDecoration: 'none',
        color: 'inherit',
        opacity: isPlaceholder ? 0.6 : 1,
        transition: 'all 150ms',
      }}
      onMouseEnter={(e) => {
        if (!isActive && !isPlaceholder)
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
      }}
      onMouseLeave={(e) => {
        if (!isActive && !isPlaceholder)
          e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
    >
      <div className="flex items-baseline" style={{ gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          任务-{item.id}
        </span>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: AGENT_LABEL[item.agentType],
            marginLeft: 'auto',
          }}
        >
          {item.agentType}
        </span>
      </div>
      <div
        className="truncate"
        style={{
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--text-base-lh)',
          fontWeight: 500,
          color: 'var(--color-text)',
          marginTop: 2,
        }}
      >
        {item.shortName}
      </div>
      <div
        className="flex items-baseline"
        style={{ gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: TASK_STATUS_COLOR[item.status],
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color: TASK_STATUS_COLOR[item.status],
            }}
          >
            {isPlaceholder ? '占位 · 待 V0.2.1 激活' : item.status}
          </span>
        </span>
        {item.validation && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
            验证 · {item.validation}
          </span>
        )}
        {item.riskLevel && !isPlaceholder && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: RISK_COLOR[item.riskLevel],
              marginLeft: 'auto',
            }}
          >
            {item.riskLevel}风险
          </span>
        )}
      </div>
    </Link>
  )
}

// ============ 非主流程需求(002/003/004)的占位 ============

function NonMainPlaceholder({ id }: { id: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
      <Link
        to="/"
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回需求工作台
      </Link>
      <h1
        style={{
          fontSize: 'var(--text-xl)',
          lineHeight: 'var(--text-xl-lh)',
          fontWeight: 600,
          margin: 0,
        }}
      >
        需求-{id} 详情
      </h1>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text-3)',
          margin: 0,
        }}
      >
        非主流程需求(占位)。完整 5 子视图仅在主流程需求-001 实现。
      </p>
    </div>
  )
}
