// 任务详情页占位
// V0.2.0 P1 页面,沿用 V0.1.1 4 Tab 结构(概览 / 上下文 / 验收标准 / 历史运行),后续步骤接入 V0.2 任务样例数据
// 实现入口:docs/08 §任务详情页
// V0.1.1 完整实现保留在 git 历史(commit d81ae1e 之前的 task-detail.tsx)
export default function TaskDetail() {
  return (
    <div>
      <h1
        style={{
          fontSize: 'var(--text-xl)',
          lineHeight: 'var(--text-xl-lh)',
          fontWeight: 600,
          margin: 0,
        }}
      >
        任务详情页
      </h1>
      <p
        style={{
          marginTop: 'var(--space-2)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text-3)',
        }}
      >
        沿用 V0.1.1 4 Tab 结构占位 · 下一步接入 V0.2 任务-1~7 样例数据。
      </p>
    </div>
  )
}
