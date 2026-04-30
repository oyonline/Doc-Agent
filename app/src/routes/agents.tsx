import { Link } from 'react-router-dom'

export default function Agents() {
  return <V02Placeholder title="智能体" hint="V0.2 暂未开放,V0.3 启用。智能体角色与状态展示见右侧状态栏。" />
}

export function V02Placeholder({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
      <h1
        style={{
          fontSize: 'var(--text-xl)',
          lineHeight: 'var(--text-xl-lh)',
          fontWeight: 600,
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-lh)',
          color: 'var(--color-text-2)',
          margin: 0,
        }}
      >
        {hint}
      </p>
      <div>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '4px var(--space-3)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text)',
            textDecoration: 'none',
          }}
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}
