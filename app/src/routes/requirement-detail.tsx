import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Wrench } from 'lucide-react'

import {
  mockRequirementDetail,
  mockCollabClarifyTurns,
  mockClarifySummary,
  mockClarifyAlignmentMoment,
  mockPRD,
  mockFeasibility,
  mockTaskGraph,
  mockTaskProgress,
} from '../lib/mock-data'
import type {
  CollabClarifyTurn,
  ClarifySummaryRow,
  PRDDocument,
  RiskItem,
  RiskLevel,
  FeasibilityEvaluation,
  TaskProgressItem,
  TaskStatus,
} from '../lib/mock-data'
import RequirementTaskGraph from '../components/RequirementTaskGraph'
import RequirementStatusBadge from '../components/RequirementStatusBadge'

// 需求详情页(V0.2.0 P0,协作模型并行升级)
// 实现入口:docs/08 §需求详情页
// 7 视图(协作模型并行升级后):
//   A · 协同澄清(产品 + 架构师并行,4 轮)
//   A' · 澄清结论摘要 + 闸门 1
//   B · PRD
//   C · 可行性评估(单次评估,无驳回动线)
//   D · 任务图
//   E · 执行进度
//   F · 规划三产出 review + 闸门 2(演示切换器选中后才展示)
//   G · 放弃 / 拆分异常分支(代码骨架,UI 不可达,V0.3 真实异常路径上线时再决定如何暴露)
//
// 锚点导航 ANCHORS 含 6 项(clarify / summary / prd / feasibility / task-graph / progress);
// 视图 F 通过 DemoViewSwitcher 顶部切换,不进 ANCHORS;视图 G 在 UI 不可达
//
// 当前需求-001 主状态 = 执行中,主流程展示视图 A~E(只读)+ 闸门 1 按钮置灰

const RISK_COLOR: Record<RiskLevel, string> = {
  高: 'var(--color-status-danger)',
  中: 'var(--color-status-warn)',
  低: 'var(--color-status-idle)',
}

// 协同澄清气泡角色色映射(决策清单 #4 微调:架构师用 verify 青)
// 决策落地:产品 = running 蓝、架构师 = verify 青、用户 = 右对齐无色条
// 主动添加 · 协作模型升级需要:架构师色条选 verify 青是为了与"规划中"主状态色对齐
// (规划阶段核心 Agent 用规划色),不用 warn 琥珀避免与演示切换器琥珀背景撞色
const ROLE_ACCENT: Record<'产品智能体' | '架构师智能体', string> = {
  产品智能体: 'var(--color-status-running)',
  架构师智能体: 'var(--color-status-verify)',
}

type AnchorId = 'clarify' | 'summary' | 'prd' | 'feasibility' | 'task-graph' | 'progress'

const ANCHORS: { id: AnchorId; label: string }[] = [
  { id: 'clarify', label: '协同澄清' },
  { id: 'summary', label: '澄清结论摘要' },
  { id: 'prd', label: 'PRD' },
  { id: 'feasibility', label: '可行性评估' },
  { id: 'task-graph', label: '任务图' },
  { id: 'progress', label: '执行进度' },
]

// 演示视图切换器:B 简版,仅暴露视图 F(视图 G 不暴露,代码骨架预留)
// 决策清单 #6:浅琥珀色背景 + "演示模式 · 视图切换"标签
type DemoView = 'main' | 'plan-review'

export default function RequirementDetail() {
  const { id } = useParams()
  const isMain = id === '001'
  // 演示切换器状态:默认 main(主流程),用户点击切换器进入 plan-review(视图 F)
  const [demoView, setDemoView] = useState<DemoView>('main')

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
      <DemoViewSwitcher current={demoView} onChange={setDemoView} />
      {demoView === 'plan-review' ? (
        <PlanReviewView />
      ) : (
        <>
          <AnchorNav />
          <CollabClarifyView />
          <ClarifySummaryView />
          <PRDView prd={mockPRD} />
          <FeasibilityView feasibility={mockFeasibility} />
          <TaskGraphView />
          <ProgressView items={mockTaskProgress} />
        </>
      )}
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
        {/* 需求详情页顶部:主状态徽章。规划中状态会展示完整进度指示
            (showProgress=true);其他主状态不展示进度指示。
            当前需求-001 主状态 = 执行中,所以进度指示不可见 */}
        <RequirementStatusBadge
          status={r.mainStatus}
          showProgress
          size="md"
        />
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

// ============ 演示视图切换器(B 简版,仅暴露视图 F)============
// 决策清单 #6:浅琥珀色背景 + "演示模式 · 视图切换"标签 + 2 按钮
// 主流程当前主状态 = 执行中,视图 F(规划三产出 review)实际已过闸门 2,
// 切换器让走查者看到"假设此刻在闸门 2 review 视图"的完整形态

function DemoViewSwitcher({
  current,
  onChange,
}: {
  current: DemoView
  onChange: (next: DemoView) => void
}) {
  return (
    <div
      style={{
        padding: 'var(--space-3) var(--space-4)',
        background: '#fefce8',
        border: '1px solid var(--color-status-warn)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          padding: '2px 8px',
          background: 'var(--color-status-warn)',
          color: 'var(--color-primary-text)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          fontWeight: 500,
        }}
      >
        演示模式 · 视图切换
      </span>
      <DemoSwitchButton
        active={current === 'main'}
        onClick={() => onChange('main')}
      >
        主流程(执行中) {current === 'main' && '✓'}
      </DemoSwitchButton>
      <DemoSwitchButton
        active={current === 'plan-review'}
        onClick={() => onChange('plan-review')}
      >
        视图 F · 规划三产出 review {current === 'plan-review' && '✓'}
      </DemoSwitchButton>
      <span
        style={{
          marginLeft: 'auto',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
        }}
      >
        视图 F 在主流程已过闸门 2(14:15 启动执行),切换查看 review 视图形态
      </span>
    </div>
  )
}

function DemoSwitchButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '4px var(--space-3)',
        background: active ? 'var(--color-surface)' : 'transparent',
        border: `1px solid ${active ? 'var(--color-status-warn)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-xs)',
        lineHeight: 'var(--text-xs-lh)',
        color: active ? 'var(--color-text)' : 'var(--color-text-2)',
        fontWeight: active ? 500 : 400,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
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

// ============ 视图 A · 协同澄清(产品 + 架构师并行,4 轮)============
// 决策清单 #4:4px 左侧色条 + 角色标签
// 第 1-3 轮产品主导(产品提问 → 架构师插话 → 用户回答),第 4 轮架构师主导
// (架构师主导提问 → 产品补位 → 用户回答)

function CollabClarifyView() {
  return (
    <ViewSection
      id="clarify"
      title="协同澄清"
      meta="4 轮 · 产品 + 架构师并行(第 4 轮架构师主导)"
    >
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        {mockCollabClarifyTurns.map((turn) => (
          <CollabClarifyTurnCard key={turn.index} turn={turn} />
        ))}
      </div>
    </ViewSection>
  )
}

function CollabClarifyTurnCard({ turn }: { turn: CollabClarifyTurn }) {
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
        {turn.productLed ? (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-status-running)' }}>
            · 产品主导
          </span>
        ) : (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-status-verify)' }}>
            · 架构师主导
          </span>
        )}
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

      {/* 第 1-3 轮:产品提问 → 架构师插话(可选) → 用户回答 */}
      {turn.productQuestion && (
        <DialogBlock role="产品智能体" content={turn.productQuestion} />
      )}
      {turn.architectInterject && (
        <DialogBlock role="架构师智能体" content={turn.architectInterject} />
      )}

      {/* 第 4 轮:架构师主导提问 → 产品补位(可选) → 用户回答 */}
      {turn.architectMainQuestion && (
        <DialogBlock role="架构师智能体" content={turn.architectMainQuestion} />
      )}
      {turn.productBackup && (
        <DialogBlock role="产品智能体" content={turn.productBackup} />
      )}

      <DialogBlock role="用户" content={turn.userAnswer} alignRight />
    </Card>
  )
}

function DialogBlock({
  role,
  content,
  alignRight,
}: {
  role: '产品智能体' | '架构师智能体' | '用户'
  content: string
  alignRight?: boolean
}) {
  const isAgent = role === '产品智能体' || role === '架构师智能体'
  // 产品 / 架构师 角色色条,用户右对齐无色条
  const accent = isAgent ? ROLE_ACCENT[role] : undefined

  return (
    <div
      className="flex flex-col"
      style={{
        gap: 4,
        marginBottom: 'var(--space-3)',
        alignItems: alignRight ? 'flex-end' : 'flex-start',
      }}
    >
      {/* 角色标签 chip:色点 + 加粗角色名,产品 / 架构师对称勾稽 */}
      <span
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: accent ?? 'var(--color-text-2)',
          fontWeight: isAgent ? 600 : 400,
        }}
      >
        {isAgent && (
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: accent,
              display: 'inline-block',
            }}
          />
        )}
        {role}
      </span>
      <div
        style={{
          maxWidth: '85%',
          padding: 'var(--space-3)',
          background: alignRight ? 'var(--color-surface-2)' : 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          // 4px 左侧色条:产品蓝 / 架构师青 / 用户无色条
          borderLeft: accent ? `4px solid ${accent}` : '1px solid var(--color-border)',
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

// ============ 视图 A' · 澄清结论摘要 + 闸门 1 ============
// 决策清单 #5:5 维度纵向卡片列表
// 卡片下方:产品宣布对齐文案(时刻 A)+ 摘要展示前言(时刻 B)+ 闸门 1 按钮
// 当前需求-001 已过闸门 1(14:10 已冻结),按钮置灰 + 标"已冻结(14:10)"

function ClarifySummaryView() {
  const m = mockClarifyAlignmentMoment
  return (
    <ViewSection
      id="summary"
      title="澄清结论摘要"
      meta={`产品智能体整合 · ${m.alignmentTime}-${m.presentTime}`}
    >
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        {/* 时刻 A:产品宣布对齐(引用样式) */}
        <Quote time={m.alignmentTime} content={m.alignment} />

        {/* 时刻 B 前言:摘要展示前的引导句 */}
        <div
          style={{
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm-lh)',
            color: 'var(--color-text-2)',
            paddingLeft: 2,
          }}
        >
          <span style={{ color: 'var(--color-text-3)', marginRight: 'var(--space-2)' }}>
            {m.presentTime}
          </span>
          {m.presentIntro}
        </div>

        {/* 5 维度纵向卡片列表 */}
        <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
          {mockClarifySummary.map((row) => (
            <SummaryRowCard key={row.dimension} row={row} />
          ))}
        </div>

        {/* 时刻 B 后语:并行模型心智 */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--color-surface-2)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm-lh)',
            color: 'var(--color-text-2)',
          }}
        >
          {m.presentOutro}
        </div>

        {/* 闸门 1 按钮(当前需求-001 已过闸门 1,置灰) */}
        <Gate1Button firedAt={m.gate1FiredAt} />
      </div>
    </ViewSection>
  )
}

function SummaryRowCard({ row }: { row: ClarifySummaryRow }) {
  return (
    <Card>
      <div
        className="flex items-baseline"
        style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}
      >
        <span
          style={{
            fontSize: 'var(--text-md)',
            lineHeight: 'var(--text-md-lh)',
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          {row.dimension}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            padding: '1px 8px',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-3)',
          }}
        >
          {row.source}
        </span>
      </div>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
        }}
      >
        {row.conclusion}
      </div>
    </Card>
  )
}

function Quote({ time, content }: { time: string; content: string }) {
  return (
    <div
      style={{
        padding: 'var(--space-3) var(--space-4)',
        borderLeft: '4px solid var(--color-status-running)',
        background: 'var(--color-bg)',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--text-sm-lh)',
        color: 'var(--color-text)',
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-status-running)',
          fontWeight: 500,
          marginBottom: 4,
        }}
      >
        产品智能体 · {time}
      </div>
      {content}
    </div>
  )
}

function Gate1Button({ firedAt }: { firedAt: string }) {
  // 当前需求-001 已过闸门 1,按钮置灰 + 标"已冻结(14:10)"
  return (
    <div
      className="flex items-center"
      style={{
        gap: 'var(--space-3)',
        marginTop: 'var(--space-2)',
      }}
    >
      <button
        type="button"
        disabled
        style={{
          height: 36,
          padding: '0 var(--space-4)',
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-3)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'inherit',
          cursor: 'not-allowed',
        }}
      >
        冻结需求,开始规划
      </button>
      <span
        style={{
          padding: '2px 8px',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-3)',
        }}
      >
        已冻结({firedAt}) · 闸门 1
      </span>
    </div>
  )
}

// ============ 视图 B · PRD ============

function PRDView({ prd }: { prd: PRDDocument }) {
  return (
    <ViewSection id="prd" title="PRD" meta="第 6 条验收标准源自协同澄清第 4 轮">
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
                {c.fromCollabClarifyRound4 && (
                  <span
                    style={{
                      marginLeft: 'var(--space-2)',
                      padding: '1px 6px',
                      fontSize: 'var(--text-xs)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-surface-2)',
                      color: 'var(--color-status-verify)',
                      border: '1px solid var(--color-status-verify)',
                    }}
                  >
                    源自协同澄清第 4 轮
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

// ============ 视图 C · 可行性评估(协作模型并行升级:单次评估,无驳回动线)============
// 决策清单 #4(可行性评估部分):删除评估时间线,RisksTable 简化为单数组,删除"由高降级"小标签
// R-001 直接为中,缓解策略源自协同澄清第 4 轮(D-1)

function FeasibilityView({ feasibility }: { feasibility: FeasibilityEvaluation }) {
  return (
    <ViewSection
      id="feasibility"
      title="可行性评估"
      meta={`架构师 ${feasibility.evalTime} 产出 · ${feasibility.conclusion}`}
    >
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        <RisksTable risks={feasibility.risks} />
        <ImplementationDirectionsCard feasibility={feasibility} />
        <KeyDecisionsCard feasibility={feasibility} />
      </div>
    </ViewSection>
  )
}

function RisksTable({ risks }: { risks: RiskItem[] }) {
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
        风险清单(0 高 + 4 中 + 1 低)
      </div>
      <ul
        className="flex flex-col"
        style={{ gap: 'var(--space-3)', listStyle: 'none', padding: 0, margin: 0 }}
      >
        {risks.map((r) => (
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

// ============ 视图 F · 规划三产出 review + 闸门 2(演示切换器选中后展示)============
// 决策清单 #6:并列展示 PRD / 可行性评估 / 任务图三段
// 每段右上角"修补"按钮(灰色小图标 + 文字,弱化样式)
// 底部决策区:左侧"重新澄清",右侧"启动执行"
// 所有按钮都是占位实现(window.alert + window.confirm 演示),不动 mock 数据

function PlanReviewView() {
  const handlePatch = (segment: 'PRD' | '可行性评估' | '任务图') => () => {
    const feedback = window.prompt(
      `修补${segment}\n\n请填写反馈(必填):\n该反馈会让对应 Agent 重新工作中,主状态保持"规划中"。`,
    )
    if (!feedback || !feedback.trim()) {
      window.alert('反馈必填,操作取消')
      return
    }
    if (window.confirm(`确认提交"修补${segment}"?\n反馈:${feedback}`)) {
      window.alert(`已提交修补${segment}(演示)`)
    }
  }

  const handleRestartClarify = () => {
    const feedback = window.prompt(
      '重新澄清\n\n请填写反馈(必填):\n所有规划产出将作废,产品 + 架构师重新启动协同澄清第 1 轮。',
    )
    if (!feedback || !feedback.trim()) {
      window.alert('反馈必填,操作取消')
      return
    }
    if (
      window.confirm(
        `确认重新澄清?所有规划产出将作废。\n反馈:${feedback}`,
      )
    ) {
      window.alert('已重新澄清(演示)')
    }
  }

  const handleStartExecution = () => {
    if (window.confirm('确认启动执行?\n主状态将从"规划中"进入"执行中",任务-1 将被分发。')) {
      window.alert('已启动执行(演示)')
    }
  }

  return (
    <section
      className="flex flex-col"
      style={{ gap: 'var(--space-4)', paddingBottom: 96 }}
    >
      <header
        className="flex items-baseline"
        style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}
      >
        <h2
          style={{
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--text-lg-lh)',
            fontWeight: 600,
            margin: 0,
          }}
        >
          规划三产出 review
        </h2>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          闸门 2 · 演示形态(主流程已过此闸门)
        </span>
      </header>

      <PlanSegment title="PRD" onPatch={handlePatch('PRD')}>
        <PRDView prd={mockPRD} />
      </PlanSegment>

      <PlanSegment title="可行性评估" onPatch={handlePatch('可行性评估')}>
        <FeasibilityView feasibility={mockFeasibility} />
      </PlanSegment>

      <PlanSegment title="任务图" onPatch={handlePatch('任务图')}>
        <TaskGraphView />
      </PlanSegment>

      {/* 底部决策区:重新澄清 / 启动执行 */}
      <div
        style={{
          marginTop: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <button
          type="button"
          onClick={handleRestartClarify}
          style={{
            height: 36,
            padding: '0 var(--space-4)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          重新澄清
        </button>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          反馈必填 · 二次确认
        </span>
        <span style={{ marginLeft: 'auto' }} />
        <button
          type="button"
          onClick={handleStartExecution}
          style={{
            height: 36,
            padding: '0 var(--space-5)',
            background: 'var(--color-primary)',
            border: 0,
            color: 'var(--color-primary-text)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'inherit',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          启动执行
        </button>
      </div>
    </section>
  )
}

// 规划阶段产出"段"包装:右上角放修补按钮(弱化样式,Wrench 图标 + 文字)
function PlanSegment({
  title,
  onPatch,
  children,
}: {
  title: string
  onPatch: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={onPatch}
        title={`修补${title}`}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '4px var(--space-3)',
          background: 'transparent',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          fontFamily: 'inherit',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
          e.currentTarget.style.color = 'var(--color-text-2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.color = 'var(--color-text-3)'
        }}
      >
        <Wrench size={11} />
        修补{title}
      </button>
      {children}
    </div>
  )
}

// ============ 视图 G · 放弃 / 拆分异常分支(代码骨架,UI 不可达)============
// 决策清单 #6:V0.2.0 阶段不在切换器中暴露;V0.3 真实异常路径上线时再决定如何暴露
// 触发条件:协同澄清 ≥ 6 轮未对齐,系统自动施加"放弃/拆分"异常标签
// 用户三选项:继续尝试澄清(无二次确认无反馈)/ 放弃(必填反馈 + 二次确认)/ 拆分(必填反馈 + 二次确认)
// 主动添加 · 协作模型升级需要:本组件保留备用,UI 入口需用户在 V0.3 拍板后接入
// 用 export 让 TS 不报"declared but never read"(组件骨架预留,但不在本文件主组件中使用)
export function AbandonOrSplitView() {
  const handleContinue = () => {
    window.alert('继续尝试澄清(演示):异常标签"放弃/拆分"已移除,澄清继续。')
  }
  const handleAbandon = () => {
    const feedback = window.prompt('放弃\n\n请填写反馈(必填):')
    if (!feedback || !feedback.trim()) return
    if (window.confirm(`确认放弃此需求?\n反馈:${feedback}`)) {
      window.alert('已放弃(演示):主状态推入终态"已放弃(放弃)"。')
    }
  }
  const handleSplit = () => {
    const feedback = window.prompt('拆分\n\n请填写反馈(必填):')
    if (!feedback || !feedback.trim()) return
    if (window.confirm(`确认拆分此需求?\n反馈:${feedback}`)) {
      window.alert('已拆分(演示):主状态推入终态"已放弃(拆分)" + 新建若干"待澄清"子需求。')
    }
  }

  return (
    <section
      className="flex flex-col"
      style={{
        gap: 'var(--space-3)',
        padding: 'var(--space-5)',
        background: '#fee2e2',
        border: '1px solid var(--color-status-danger)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--text-lg)',
          lineHeight: 'var(--text-lg-lh)',
          fontWeight: 600,
          margin: 0,
          color: 'var(--color-status-danger)',
        }}
      >
        协同澄清 ≥ 6 轮未对齐
      </h2>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
          margin: 0,
        }}
      >
        系统自动施加"放弃/拆分"提示。请在以下三个选项中决策:
      </p>
      <div className="flex" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button type="button" onClick={handleContinue}>
          继续尝试澄清
        </button>
        <button type="button" onClick={handleAbandon}>
          放弃
        </button>
        <button type="button" onClick={handleSplit}>
          拆分
        </button>
      </div>
    </section>
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
        非主流程需求(占位)。完整 7 子视图仅在主流程需求-001 实现。
      </p>
    </div>
  )
}
