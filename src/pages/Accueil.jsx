import { Heart, MessageCircle, TrendingUp, Sparkles, NotebookPen, MoonStar } from 'lucide-react'
import { Link } from 'react-router-dom'

const moodChips = ['Calme', 'Stressé', 'Épuisé', 'Mélancolique']

export default function Accueil() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="premium-hero sakina-card overflow-hidden p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.4),_transparent_35%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-sakina-700/60">Aujourd’hui</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-sakina-700">Comment tu te sens ?</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#E6DFF5,#C9E8D2)] text-2xl shadow-soft">💙</div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {moodChips.map((mood) => (
              <button key={mood} className="sakina-chip">
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link to="/Chat" className="sakina-card p-4 transition-transform hover:-translate-y-0.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E6DFF5]">
            <MessageCircle className="h-5 w-5 text-sakina-700" />
          </div>
          <p className="mt-4 text-lg font-semibold text-sakina-700">Sakina</p>
          <p className="text-xs text-sakina-700/70">Conversation</p>
        </Link>

        <Link to="/Dashboard" className="sakina-card p-4 transition-transform hover:-translate-y-0.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9E8D2]">
            <TrendingUp className="h-5 w-5 text-sakina-700" />
          </div>
          <p className="mt-4 text-lg font-semibold text-sakina-700">Dashboard</p>
          <p className="text-xs text-sakina-700/70">Progression</p>
        </Link>

        <Link to="/Journal" className="sakina-card p-4 transition-transform hover:-translate-y-0.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EFE6]">
            <NotebookPen className="h-5 w-5 text-sakina-700" />
          </div>
          <p className="mt-4 text-lg font-semibold text-sakina-700">Journal</p>
          <p className="text-xs text-sakina-700/70">Écrire</p>
        </Link>

        <Link to="/Ressources" className="sakina-card p-4 transition-transform hover:-translate-y-0.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A7C7E7]">
            <MoonStar className="h-5 w-5 text-sakina-700" />
          </div>
          <p className="mt-4 text-lg font-semibold text-sakina-700">Ressources</p>
          <p className="text-xs text-sakina-700/70">Soutien</p>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-sakina-700">Ressources du moment</h3>

        <div className="mt-4 space-y-3">
          <div className="sakina-card border border-[#E9E0D4] p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <p className="font-semibold text-sakina-700">Micro-pas du jour</p>
            </div>
            <p className="mt-2 text-sm text-sakina-700/70">Prends 3 respirations profondes avant de répondre au prochain message.</p>
          </div>

          <div className="sakina-card border border-[#E9E0D4] p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <p className="font-semibold text-sakina-700">Rappel doux</p>
            </div>
            <p className="mt-2 text-sm text-sakina-700/70">Tu n’as pas besoin d’être parfait pour aller mieux.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
