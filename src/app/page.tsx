// src/app/page.tsx
import SkillFlowDashboard from '@/components/SkillFlowDashboard'

export default function Home() {
  return (
    <main>
      <SkillFlowDashboard />
    </main>
  )
}

export const metadata = {
  title: 'SkillFlow Analytics - Torre Talent Insights',
  description: 'Discover talent trends and insights from Torre professional network with real-time analytics and visualizations.',
}