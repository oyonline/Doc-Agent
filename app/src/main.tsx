import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './tokens/tokens.css'
import './index.css'

import App from './App.tsx'
import Home from './routes/home'
import Plan from './routes/plan'
import Tasks from './routes/tasks'
import TaskDetail from './routes/task-detail'
import RunDetail from './routes/run-detail'
import Review from './routes/review'
import RequirementDetail from './routes/requirement-detail'
import RequirementReview from './routes/requirement-review'
import Workflows from './routes/workflows'
import Agents from './routes/agents'
import Settings from './routes/settings'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/requirements/:id', element: <RequirementDetail /> },
      { path: '/requirements/:id/review', element: <RequirementReview /> },
      { path: '/plan', element: <Plan /> },
      { path: '/tasks', element: <Tasks /> },
      { path: '/tasks/:id', element: <TaskDetail /> },
      { path: '/runs/:id', element: <RunDetail /> },
      { path: '/review/:id', element: <Review /> },
      { path: '/workflows', element: <Workflows /> },
      { path: '/agents', element: <Agents /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
