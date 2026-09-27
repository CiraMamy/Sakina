import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Moon, Target, Smile } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-sakina-800">Dashboard</h1>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Humeur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">4.2</span>
              <Smile className="text-sakina-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Sommeil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">7.5h</span>
              <Moon className="text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">3/5</span>
              <Target className="text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Stabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">82%</span>
              <Activity className="text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
