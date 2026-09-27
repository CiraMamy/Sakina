export default function Profil() {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-sakina-800">Profil</h1>
      <div className="mt-5 rounded-3xl bg-white border border-slate-200 p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sakina-100 flex items-center justify-center text-2xl">👩‍💻</div>
          <div>
            <p className="font-bold text-sakina-800">Utilisateur</p>
            <p className="text-sm text-slate-500">Membre actif</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between"><span>Objectif principal</span><span className="font-medium text-slate-800">Mieux dormir</span></div>
          <div className="flex justify-between"><span>Jours de suivi</span><span className="font-medium text-slate-800">24</span></div>
          <div className="flex justify-between"><span>Streak</span><span className="font-medium text-slate-800">5 jours</span></div>
        </div>
      </div>
    </div>
  )
}
