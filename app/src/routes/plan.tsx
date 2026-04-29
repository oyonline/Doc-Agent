// /plan 路由 V0.2 不再使用
// V0.1.1 的"6 步线性计划"心智在 V0.2 由"任务图"取代(见 docs/00 §V0.2 核心心智)
// 路由暂保留为占位,避免历史链接 404;后续可视情况移除
export default function Plan() {
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
        计划
      </h1>
      <p
        style={{
          marginTop: 'var(--space-2)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text-3)',
        }}
      >
        V0.2 已用任务图取代 6 步线性计划,本路由暂保留为占位。
      </p>
    </div>
  )
}
