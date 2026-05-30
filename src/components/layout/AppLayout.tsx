import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />

      <main className="relative flex-1 overflow-y-auto">
        <div className="pointer-events-none fixed right-0 top-0 h-96 w-96 rounded-full bg-teal-100/60 blur-3xl" />
        <div className="pointer-events-none fixed bottom-0 left-72 h-96 w-96 rounded-full bg-slate-300/50 blur-3xl" />

        <div className="relative mx-auto min-h-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}