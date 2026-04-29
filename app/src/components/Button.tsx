import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children?: ReactNode
}

export default function Button({
  variant = 'primary',
  disabled,
  style,
  children,
  ...rest
}: Props) {
  const isPrimary = variant === 'primary'
  const baseBg = isPrimary ? 'var(--color-primary)' : 'var(--color-surface)'
  const hoverBg = isPrimary ? 'var(--color-primary-hover)' : 'var(--color-surface-2)'

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = hoverBg
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = baseBg
      }}
      style={{
        height: 36,
        padding: '0 var(--space-4)',
        background: baseBg,
        color: isPrimary ? 'var(--color-primary-text)' : 'var(--color-text)',
        border: isPrimary ? 'none' : '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-sm)',
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 150ms',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
