import { Outlet } from 'react-router-dom'
import TopBar from './shell/TopBar'
import SideNav from './shell/SideNav'
import RightStatus from './shell/RightStatus'
import BottomEvents from './shell/BottomEvents'

export default function App() {
  return (
    <div className="grid h-screen" style={{ gridTemplateRows: '48px 1fr auto' }}>
      <TopBar />
      <div className="flex min-h-0">
        <SideNav />
        <main
          className="flex-1 overflow-auto min-w-0"
          style={{
            padding: 'var(--layout-main-padding)',
            background: 'var(--color-bg)',
          }}
        >
          <Outlet />
        </main>
        <RightStatus />
      </div>
      <BottomEvents />
    </div>
  )
}
