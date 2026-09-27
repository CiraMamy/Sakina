import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-md mx-auto">
        <div className="text-5xl mb-6 text-center">🌸</div>
        <h1 className="text-3xl font-bold text-sakina-800 text-center">Bienvenue dans Sakina</h1>
        <p className="mt-4 text-slate-600 text-center">
          Un espace pensé pour t’écouter, t’accompagner et t’aider à mieux comprendre ce que tu vis.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl bg-sakina-50 p-4 border border-sakina-100">
            <p className="font-semibold text-sakina-800">🧠 Analyse émotionnelle</p>
            <p className="text-sm text-slate-600 mt-1">Comprendre tes ressentis avec douceur.</p>
          </div>

          <div className="rounded-2xl bg-sakina-50 p-4 border border-sakina-100">
            <p className="font-semibold text-sakina-800">💬 Chat soutenant</p>
            <p className="text-sm text-slate-600 mt-1">Parler librement sans jugement.</p>
          </div>

          <div className="rounded-2xl bg-sakina-50 p-4 border border-sakina-100">
            <p className="font-semibold text-sakina-800">📈 Suivi de progression</p>
            <p className="text-sm text-slate-600 mt-1">Observer tes changements au fil du temps.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/Accueil')}
          className="mt-10 w-full bg-sakina-500 hover:bg-sakina-600 text-white font-semibold py-3 rounded-2xl shadow-soft"
        >
          Commencer
        </button>
      </div>
    </div>
  )
}
