import { mockAgentPhases, mockSafetyRows } from '../lib/mock-data'
import type { AgentRow, AgentPhase, SafetyRow } from '../lib/mock-data'

// 右侧状态栏(V0.2 重做版)
// 数据源:docs/06 §11.6 T0(14:15)状态栏快照
// 视觉规范:沿用 V0.1.1(text-xs + --color-text-2 + letterSpacing 0.02em 作为分组小标题)
// 分组间距:16px(--space-4),按 docs/02 §状态展示规范
// 严格遵守 V0.2.0 阶段:不显示会话信息、不显示伪 token 百分比

export default function RightStatus() {
  return (
    <aside
      className="border-l flex flex-col flex-shrink-0"
      style={{
        width: 'var(--layout-rightstatus-w)',
        borderLeftColor: 'var(--color-border)',
        background: 'var(--color-surface)',
        padding: 'var(--space-5)',
        overflowY: 'auto',
      }}
    >
      <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
        <SafetySection rows={mockSafetyRows} />
        {mockAgentPhases.map((phase) => (
          <PhaseSection key={phase.title} phase={phase} />
        ))}
      </div>

      <div
        className="mt-auto"
        style={{
          paddingTop: 'var(--space-5)',
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--text-xs-lh)',
          color: 'var(--color-text-3)',
        }}
      >
        智能体可以执行任务,接受结果与合入需要你确认。
      </div>
    </aside>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 'var(--text-xs)',
        lineHeight: 'var(--text-xs-lh)',
        color: 'var(--color-text-2)',
        marginBottom: 'var(--space-2)',
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </div>
  )
}

function SafetySection({ rows }: { rows: SafetyRow[] }) {
  return (
    <section>
      <SectionHeading>安全模式</SectionHeading>
      <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between"
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--text-sm-lh)',
            }}
          >
            <span style={{ color: 'var(--color-text-2)' }}>{row.label}</span>
            <span style={{ color: 'var(--color-text)' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PhaseSection({ phase }: { phase: AgentPhase }) {
  return (
    <section>
      <SectionHeading>{phase.title}</SectionHeading>
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        {phase.agents.map((agent) => (
          <AgentItem key={agent.name} agent={agent} />
        ))}
      </div>
    </section>
  )
}

function AgentItem({ agent }: { agent: AgentRow }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
      <div
        className="flex justify-between"
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
        }}
      >
        <span style={{ color: 'var(--color-text-2)' }}>{agent.name}</span>
        <span style={{ color: 'var(--color-text)' }}>{agent.status}</span>
      </div>
      {agent.detail && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-3)',
          }}
        >
          {agent.detail}
        </div>
      )}
    </div>
  )
}
