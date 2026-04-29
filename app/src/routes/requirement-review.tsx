import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle, ChevronDown } from 'lucide-react'

import { mockRequirementReview } from '../lib/mock-data'
import type {
  RequirementReviewPackage,
  DeliveryComparison,
  TaskSummaryRow,
  CrossTaskIssue,
  IssueSeverity,
  ReviewSuggestion,
  ReviewRiskSummary,
  RiskLevel,
} from '../lib/mock-data'

// 需求级审查包页(V0.2.0 P0 · 控制台型 · 目标 80+ 分)
// 实现入口:docs/08 §需求级审查包页
// 数据源:docs/06 §需求级审查包(10.1~10.7)
//
// 时刻基准:T5+(15:42)演示快照,主流程需求-001 实际 T0=14:15 仍在执行中
// 顶部演示模式提示带说明这一时刻不一致,产品诚意
//
// 路由分发:
// - /requirements/001/review → 完整审查包(主流程)
// - /requirements/{002,003,004}/review → 占位降级

const SEVERITY_COLOR: Record<IssueSeverity, { bg: string; color: string; border: string }> = {
  严重: { bg: '#fee2e2', color: 'var(--color-status-danger)', border: 'var(--color-status-danger)' },
  警告: { bg: '#fefce8', color: 'var(--color-status-warn)', border: 'var(--color-status-warn)' },
  提示: { bg: '#dbeafe', color: 'var(--color-status-running)', border: 'var(--color-status-running)' },
}

const TASK_STATUS_COLOR: Record<TaskSummaryRow['status'], string> = {
  待处理: 'var(--color-status-idle)',
  执行中: 'var(--color-status-running)',
  验证中: 'var(--color-status-verify)',
  待审查: 'var(--color-status-review)',
  已完成: 'var(--color-status-success)',
  占位: 'var(--color-text-3)',
}

const AGENT_LABEL_COLOR: Record<TaskSummaryRow['agentType'], string> = {
  后端: 'var(--color-status-running)',
  前端: 'var(--color-status-verify)',
  测试: 'var(--color-status-warn)',
}

const RISK_COLOR: Record<RiskLevel, string> = {
  高: 'var(--color-status-danger)',
  中: 'var(--color-status-warn)',
  低: 'var(--color-status-idle)',
}

const DELIVERY_LEVEL_COLOR: Record<DeliveryComparison['level'], string> = {
  已满足: 'var(--color-status-success)',
  部分满足: 'var(--color-status-warn)',
  未满足: 'var(--color-status-danger)',
}

export default function RequirementReview() {
  const { id } = useParams()
  if (id !== '001') {
    return <NonMainPlaceholder id={id ?? ''} />
  }
  return <MainReview pack={mockRequirementReview} id={id} />
}

// ============ 主流程审查包 ============

function MainReview({ pack, id }: { pack: RequirementReviewPackage; id: string }) {
  return (
    <div
      className="flex flex-col"
      style={{
        gap: 'var(--space-4)',
        margin: 'calc(var(--layout-main-padding) * -1)',
        padding: 'var(--layout-main-padding)',
        paddingBottom: 96, // 给 sticky 决策区留位
        minHeight: '100%',
      }}
    >
      <ReviewHeader pack={pack} />
      <DemoModeBanner />
      <RequirementSummaryCard pack={pack} />
      <DeliverySection delivery={pack.delivery} />
      <TaskSummaryTable rows={pack.taskSummary} requirementId={id} />
      <CrossTaskIssuesSection issues={pack.crossTaskIssues} />
      <RiskSummaryStrip risk={pack.riskSummary} />
      <ReviewSuggestionCard suggestion={pack.suggestion} />
      <DecisionBar isHighRisk={pack.isHighRisk} requirementId={id} />
    </div>
  )
}

// ============ 顶部 ============

function ReviewHeader({ pack }: { pack: RequirementReviewPackage }) {
  return (
    <header className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
      <Link
        to={`/requirements/${pack.summary.code.replace('需求-', '')}`}
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回需求详情
      </Link>
      <div className="flex items-baseline" style={{ gap: 'var(--space-3)' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-3)' }}>
          {pack.summary.code}
        </span>
        <h1
          style={{
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--text-xl-lh)',
            fontWeight: 600,
            margin: 0,
          }}
        >
          需求级审查包
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
          待你最终决策
        </span>
      </div>
    </header>
  )
}

function DemoModeBanner() {
  return (
    <div
      className="flex items-start"
      style={{
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: '#fefce8',
        border: '1px solid #fde68a',
        borderRadius: 'var(--radius)',
        color: 'var(--color-text-2)',
      }}
    >
      <AlertCircle
        size={14}
        style={{ flexShrink: 0, marginTop: 3, color: 'var(--color-status-warn)' }}
      />
      <div
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--color-status-warn)' }}>
          演示模式 · T5+ 时刻快照(15:42)
        </span>
        <span style={{ marginLeft: 6 }}>
          当前需求-001 实际状态为"执行中",此页展示假设全部任务已完成、需求级审查包已生成时的样子。
        </span>
      </div>
    </div>
  )
}

// ============ 需求回顾 ============

function RequirementSummaryCard({ pack }: { pack: RequirementReviewPackage }) {
  const items = [
    { label: '需求编号', value: pack.summary.code },
    { label: '名称', value: pack.summary.name },
    { label: '提交时间', value: pack.summary.submittedAt, mono: true },
    { label: '完成时间', value: pack.summary.completedAt, mono: true },
    { label: '总耗时', value: pack.summary.duration },
  ]
  return (
    <Card>
      <SectionHeading>需求回顾</SectionHeading>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-2)',
        }}
      >
        {items.map((item) => (
          <div key={item.label}>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-3)',
                marginBottom: 2,
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
                fontWeight: 500,
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

// ============ PRD 对比交付 ============

function DeliverySection({ delivery }: { delivery: DeliveryComparison[] }) {
  return (
    <Card>
      <SectionHeading
        meta={`${delivery.length} 条验收标准 · ${delivery.filter((d) => d.level === '已满足').length} 已满足`}
      >
        PRD 对比交付
      </SectionHeading>
      <div className="flex flex-col" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
        {delivery.map((d, i) => (
          <DeliveryRow key={i} index={i + 1} item={d} />
        ))}
      </div>
    </Card>
  )
}

function DeliveryRow({ index, item }: { index: number; item: DeliveryComparison }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 1fr auto',
        gap: 'var(--space-3)',
        padding: 'var(--space-2) var(--space-3)',
        background: 'var(--color-surface-2)',
        borderRadius: 'var(--radius)',
        alignItems: 'baseline',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          minWidth: 16,
        }}
      >
        {index}
      </span>
      <span
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
        }}
      >
        {item.acceptanceCriterion}
      </span>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-2)',
        }}
      >
        {item.delivery}
      </span>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          padding: '2px 8px',
          background: 'var(--color-surface)',
          color: DELIVERY_LEVEL_COLOR[item.level],
          border: `1px solid ${DELIVERY_LEVEL_COLOR[item.level]}`,
          borderRadius: 'var(--radius-sm)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {item.level}
      </span>
    </div>
  )
}

// ============ 任务汇总(表格)============

function TaskSummaryTable({
  rows,
  requirementId: _requirementId,
}: {
  rows: TaskSummaryRow[]
  requirementId: string
}) {
  const navigate = useNavigate()
  const doneCount = rows.filter((r) => r.status === '已完成').length
  const realCount = rows.filter((r) => !r.isPlaceholder).length
  return (
    <Card>
      <SectionHeading meta={`${doneCount}/${realCount} 已完成 · 任务-7 占位`}>
        任务汇总
      </SectionHeading>
      <div
        style={{
          marginTop: 'var(--space-3)',
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
              <Th width={64}>任务</Th>
              <Th>名称</Th>
              <Th width={72}>智能体</Th>
              <Th width={88}>状态</Th>
              <Th width={120}>验证</Th>
              <Th width={64}>风险</Th>
              <Th width={56} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isPh = r.isPlaceholder === true
              return (
                <tr
                  key={r.id}
                  style={{
                    borderTop: '1px solid var(--color-border)',
                    cursor: isPh ? 'not-allowed' : 'pointer',
                    opacity: isPh ? 0.6 : 1,
                  }}
                  onClick={() => {
                    if (!isPh) navigate(`/review/${r.id}`)
                  }}
                  onMouseEnter={(e) => {
                    if (!isPh) e.currentTarget.style.background = 'var(--color-surface-2)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isPh) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-3)',
                      }}
                    >
                      任务-{r.id}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                      {r.shortName}
                    </span>
                  </Td>
                  <Td>
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: AGENT_LABEL_COLOR[r.agentType],
                      }}
                    >
                      {r.agentType}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: TASK_STATUS_COLOR[r.status],
                          display: 'inline-block',
                        }}
                      />
                      <span style={{ color: TASK_STATUS_COLOR[r.status] }}>
                        {isPh ? '占位' : r.status}
                      </span>
                    </span>
                  </Td>
                  <Td>
                    <span
                      style={{
                        fontFamily: isPh ? undefined : 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-2)',
                      }}
                    >
                      {r.validation}
                    </span>
                  </Td>
                  <Td>
                    {r.riskLevel ? (
                      <span style={{ color: RISK_COLOR[r.riskLevel], fontSize: 'var(--text-xs)' }}>
                        {r.riskLevel}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-3)' }}>—</span>
                    )}
                  </Td>
                  <Td>
                    <span style={{ color: 'var(--color-text-3)', fontSize: 'var(--text-xs)' }}>
                      {isPh ? '' : '查看 →'}
                    </span>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function Th({ children, width }: { children?: React.ReactNode; width?: number }) {
  return (
    <th
      style={{
        padding: '8px var(--space-3)',
        fontWeight: 400,
        width,
      }}
    >
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '10px var(--space-3)' }}>{children}</td>
}

// ============ 跨任务一致性问题清单 ============

function CrossTaskIssuesSection({ issues }: { issues: CrossTaskIssue[] }) {
  const counts = {
    严重: issues.filter((i) => i.severity === '严重').length,
    警告: issues.filter((i) => i.severity === '警告').length,
    提示: issues.filter((i) => i.severity === '提示').length,
  }
  return (
    <Card>
      <SectionHeading meta={`${counts.严重} 严重 · ${counts.警告} 警告 · ${counts.提示} 提示`}>
        跨任务一致性问题
      </SectionHeading>
      <ul
        className="flex flex-col"
        style={{
          marginTop: 'var(--space-3)',
          gap: 'var(--space-2)',
          listStyle: 'none',
          padding: 0,
        }}
      >
        {issues.map((issue) => (
          <IssueRow key={issue.index} issue={issue} />
        ))}
      </ul>
    </Card>
  )
}

function IssueRow({ issue }: { issue: CrossTaskIssue }) {
  const c = SEVERITY_COLOR[issue.severity]
  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr auto',
        gap: 'var(--space-3)',
        padding: 'var(--space-2) var(--space-3)',
        background: 'var(--color-surface-2)',
        borderLeft: `3px solid ${c.border}`,
        borderRadius: 'var(--radius-sm)',
        alignItems: 'baseline',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
        }}
      >
        #{issue.index}
      </span>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          padding: '1px 6px',
          background: c.bg,
          color: c.color,
          borderRadius: 'var(--radius-sm)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {issue.severity}
      </span>
      <span
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text)',
        }}
      >
        {issue.description}
      </span>
      <span
        className="flex items-center"
        style={{ gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}
      >
        {issue.involvedTaskIds.map((tid) => (
          <Link
            key={tid}
            to={`/review/${tid}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              padding: '1px 6px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-2)',
              textDecoration: 'none',
            }}
          >
            任务-{tid}
          </Link>
        ))}
      </span>
    </li>
  )
}

// ============ 风险评估(strip)============

function RiskSummaryStrip({ risk }: { risk: ReviewRiskSummary }) {
  const stats = [
    { label: '高风险', value: risk.high, color: 'var(--color-status-danger)' },
    { label: '中风险', value: risk.medium, color: 'var(--color-status-warn)' },
    { label: '低风险', value: risk.low, color: 'var(--color-status-idle)' },
    {
      label: '严重跨任务问题',
      value: risk.criticalCrossTaskIssues,
      color: 'var(--color-status-danger)',
    },
  ]
  return (
    <Card>
      <SectionHeading>风险评估</SectionHeading>
      <div
        style={{
          marginTop: 'var(--space-3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-3)',
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius)',
              borderLeft: `3px solid ${s.color}`,
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-3)',
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xl)',
                lineHeight: 'var(--text-xl-lh)',
                fontWeight: 600,
                color: s.value > 0 ? s.color : 'var(--color-text-3)',
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ============ 审查建议 ============

function ReviewSuggestionCard({ suggestion }: { suggestion: ReviewSuggestion }) {
  return (
    <Card>
      <SectionHeading>审查建议</SectionHeading>
      <div
        style={{
          marginTop: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius)',
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-status-success)',
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          推荐方案
        </div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm-lh)',
            color: 'var(--color-text)',
          }}
        >
          {suggestion.recommendation}
        </div>
      </div>
      <div
        className="flex flex-col"
        style={{ gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}
      >
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-3)',
            letterSpacing: '0.02em',
          }}
        >
          替代方案
        </div>
        {suggestion.alternatives.map((a, i) => (
          <div
            key={i}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
              color: 'var(--color-text-2)',
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-2)',
            }}
          >
            <span style={{ flex: 1 }}>{a.text}</span>
            {a.notRecommended && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-status-danger)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                不推荐
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

// ============ 决策选项区(sticky 底部)============

function DecisionBar({ isHighRisk }: { isHighRisk: boolean; requirementId: string }) {
  const handleAccept = () => {
    if (isHighRisk) {
      const ok = window.confirm(
        '当前需求存在 1 项严重跨任务问题(#1),确认接受需求结果?\n建议先选择"部分接受"重做问题任务。',
      )
      if (!ok) return
    }
    window.alert('演示模式 · "接受需求结果"动作触发(实际 V0.2 不写入)')
  }

  const handleReject = () => {
    const reason = window.prompt('请填写拒绝并反馈的原因(必填):')
    if (!reason) return
    window.alert(`演示模式 · "拒绝并反馈"动作触发\n反馈:${reason}`)
  }

  const handlePartial = () => {
    window.alert('演示模式 · "部分接受"进入选择模式(本步未实现选择 UI)')
  }

  const handleReviewAgain = () => {
    window.alert('演示模式 · "让审查智能体复查"已触发')
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
        style={{ gap: 'var(--space-3)', justifyContent: 'space-between' }}
      >
        <SecondaryButton onClick={handleReject}>拒绝并反馈</SecondaryButton>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <MoreActionsDropdown
            items={[
              { label: '部分接受', onClick: handlePartial },
              { label: '让审查智能体复查', onClick: handleReviewAgain },
            ]}
          />
          <PrimaryButton onClick={handleAccept}>
            接受需求结果{isHighRisk && ' (需二次确认)'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function PrimaryButton({
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
        height: 32,
        padding: '0 var(--space-4)',
        background: 'var(--color-primary)',
        color: 'var(--color-primary-text)',
        border: 0,
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-primary-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-primary)'
      }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
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
        height: 32,
        padding: '0 var(--space-4)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-surface-2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-surface)'
      }}
    >
      {children}
    </button>
  )
}

function MoreActionsDropdown({
  items,
}: {
  items: { label: string; onClick: () => void }[]
}) {
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
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          {meta}
        </span>
      )}
    </header>
  )
}

// ============ 非主流程占位 ============

function NonMainPlaceholder({ id }: { id: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
      <Link
        to={`/requirements/${id}`}
        className="inline-flex items-center"
        style={{
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-3)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowLeft size={12} /> 返回需求详情
      </Link>
      <h1
        style={{
          fontSize: 'var(--text-xl)',
          lineHeight: 'var(--text-xl-lh)',
          fontWeight: 600,
          margin: 0,
        }}
      >
        需求-{id} 级审查包
      </h1>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text-3)',
          margin: 0,
        }}
      >
        需求未进入待审查状态(占位)。需求级审查包仅在主流程需求-001 的 T5+ 时刻演示快照中呈现。
      </p>
    </div>
  )
}
