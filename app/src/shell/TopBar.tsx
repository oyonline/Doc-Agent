import { Plus } from 'lucide-react'

export default function TopBar() {
  return (
    <header
      className="flex items-center border-b px-4"
      style={{
        height: 'var(--layout-topbar-h)',
        borderBottomColor: 'var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-md)',
          lineHeight: 'var(--text-md-lh)',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}
      >
        智能体工作台
      </div>

      <div className="flex-1 flex justify-center">
        <input
          type="search"
          placeholder="搜索任务、运行、文件..."
          className="outline-none"
          style={{
            width: 320,
            height: 28,
            padding: '0 var(--space-3)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <span
          style={{
            padding: '2px var(--space-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs-lh)',
            color: 'var(--color-text-2)',
            userSelect: 'none',
          }}
        >
          严格模式
        </span>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 transition-all duration-150"
          style={{
            height: 28,
            padding: '0 var(--space-3)',
            background: 'var(--color-primary)',
            color: 'var(--color-primary-text)',
            border: 0,
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-primary-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-primary)'
          }}
        >
          <Plus size={14} />
          创建需求
        </button>

        <div
          className="inline-flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-2)',
          }}
        >
          我
        </div>
      </div>
    </header>
  )
}
