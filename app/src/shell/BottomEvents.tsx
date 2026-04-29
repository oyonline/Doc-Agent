import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { mockRecentEvents, mockLatestEvent } from '../lib/mock-data'

export default function BottomEvents() {
  const [expanded, setExpanded] = useState(false)

  return (
    <footer
      className="border-t flex flex-col transition-all duration-150"
      style={{
        height: expanded
          ? 'var(--layout-bottomevents-expanded-h)'
          : 'var(--layout-bottomevents-collapsed-h)',
        borderTopColor: 'var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center w-full transition-all duration-150"
        style={{
          height: 'var(--layout-bottomevents-collapsed-h)',
          padding: '0 var(--space-4)',
          gap: 'var(--space-3)',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-3)',
            letterSpacing: '0.02em',
          }}
        >
          事件流
        </span>
        {!expanded && (
          <span
            className="flex items-center gap-2 truncate"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-2)' }}
          >
            <span style={{ color: 'var(--color-text-3)' }}>{mockLatestEvent.time}</span>
            <span>{mockLatestEvent.text}</span>
          </span>
        )}
        <span className="ml-auto inline-flex" style={{ color: 'var(--color-text-3)' }}>
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </span>
      </button>

      {expanded && (
        <div
          className="flex-1 overflow-auto"
          style={{
            padding: '0 var(--space-4) var(--space-3)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <ul className="flex flex-col" style={{ gap: 'var(--space-2)', paddingTop: 'var(--space-3)' }}>
            {mockRecentEvents.map((e, i) => (
              <li
                key={i}
                className="flex gap-3"
                style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--text-sm-lh)' }}
              >
                <span style={{ color: 'var(--color-text-3)', minWidth: 44 }}>{e.time}</span>
                <span style={{ color: 'var(--color-text-2)' }}>{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </footer>
  )
}
