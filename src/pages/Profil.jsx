export default function Profil() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="sakina-card p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E6DFF5] text-2xl shadow-soft">👩‍💻</div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#5E6E7A]">Profil</p>
            <p className="mt-1 text-2xl font-bold text-sakina-700">Utilisateur</p>
            <p className="text-sm text-[#5E6E7A]">Membre actif</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-[#5E6E7A]">
          <div className="flex items-center justify-between rounded-2xl bg-[#F7F5F2] px-3 py-2.5">
            <span>Objectif principal</span>
            <span className="font-semibold text-sakina-700">Mieux dormir</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#F7F5F2] px-3 py-2.5">
            <span>Jours de suivi</span>
            <span className="font-semibold text-sakina-700">24</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#F7F5F2] px-3 py-2.5">
            <span>Streak</span>
            <span className="font-semibold text-sakina-700">5 jours</span>
          </div>
        </div>
      </div>
    </div>
  )
}
