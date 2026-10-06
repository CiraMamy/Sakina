import { Activity, Moon, Target, Smile, TrendingUp } from 'lucide-react'

const metrics = [
  { label: 'Humeur', value: '4.2', icon: Smile, tone: 'bg-[#E6DFF5]' },
  { label: 'Sommeil', value: '7.5h', icon: Moon, tone: 'bg-[#A7C7E7]' },
  { label: 'Objectifs', value: '3/5', icon: Target, tone: 'bg-[#F5EFE6]' },
  { label: 'Stabilité', value: '82%', icon: Activity, tone: 'bg-[#C9E8D2]' },
]

export default function Dashboard() {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="sakina-card p-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#5E6E7A]">Progression</p>
        <h1 className="mt-3 text-3xl font-bold text-sakina-700">Dashboard</h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-sakina-700/80">
          <TrendingUp className="h-4 w-4" />
          <span>Ton parcours est plus stable cette semaine.</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {metrics.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="sakina-card p-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
              <Icon className="h-5 w-5 text-sakina-700" />
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#5E6E7A]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-sakina-700">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
