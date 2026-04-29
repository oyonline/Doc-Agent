import { NavLink } from 'react-router-dom'
import { Home, ClipboardList, Workflow, Bot, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const items: NavItem[] = [
  { to: '/', label: '首页', icon: Home, end: true },
  { to: '/tasks', label: '任务', icon: ClipboardList },
  { to: '/workflows', label: '工作流', icon: Workflow },
  { to: '/agents', label: '智能体', icon: Bot },
  { to: '/settings', label: '设置', icon: Settings },
]

export default function SideNav() {
  return (
    <nav
      className="border-r flex-shrink-0"
      style={{
        width: 'var(--layout-sidenav-w)',
        borderRightColor: 'var(--color-border)',
        background: 'var(--color-surface)',
        paddingTop: 'var(--space-4)',
      }}
    >
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex items-center gap-2 transition-all duration-150"
          style={({ isActive }) => ({
            height: 36,
            paddingLeft: 'var(--space-3)',
            paddingRight: 'var(--space-3)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm-lh)',
            color: isActive ? 'var(--color-text)' : 'var(--color-text-2)',
            background: isActive ? 'var(--color-surface-2)' : 'transparent',
            textDecoration: 'none',
          })}
        >
          <Icon size={16} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
