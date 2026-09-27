import { Heart, MessageCircle, TrendingUp, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Accueil() {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="rounded-3xl bg-gradient-to-br from-sakina-100 to-white p-5 shadow-soft border border-sakina-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Aujourd’hui</p>
            <h2 className="text-2xl font-bold text-sakina-800">Comment tu te sens ?</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">💙</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link to="/Chat" className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
          <MessageCircle className="w-6 h-6 text-sakina-500" />
          <p className="mt-3 font-semibold text-sakina-800">Sakina</p>
          <p className="text-xs text-slate-500">Conversation</p>
        </Link>

        <Link to="/Dashboard" className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
          <TrendingUp className="w-6 h-6 text-sakina-500" />
          <p className="mt-3 font-semibold text-sakina-800">Dashboard</p>
          <p className="text-xs text-slate-500">Progression</p>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-sakina-800">Ressources du moment</h3>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-white p-4 border border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <p className="font-semibold text-slate-700">Micro-pas du jour</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">Prends 3 respirations profondes avant de répondre au prochain message.</p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <p className="font-semibold text-slate-700">Rappel doux</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">Tu n’as pas besoin d’être parfait pour aller mieux.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
