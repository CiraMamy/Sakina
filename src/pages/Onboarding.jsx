import { ArrowRight, HeartHandshake, MoonStar, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const pillars = [
  {
    icon: HeartHandshake,
    title: 'Écoute bienveillante',
    description: 'Un espace pensé pour accueillir ce que tu ressens, sans jugement.',
    color: 'bg-[#E6DFF5]',
  },
  {
    icon: Sparkles,
    title: 'Clarté émotionnelle',
    description: 'Mieux comprendre tes pensées, tes cycles et tes habitudes.',
    color: 'bg-[#A7C7E7]',
  },
  {
    icon: MoonStar,
    title: 'Progression douce',
    description: 'Suivre tes changements au fil du temps, avec douceur.',
    color: 'bg-[#C9E8D2]',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,199,231,0.18),_transparent_35%),linear-gradient(180deg,#F7F5F2_0%,#F3F8FC_100%)] px-5 py-8">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#E6DFF5] shadow-soft text-4xl">🌿</div>

        <h1 className="mt-8 text-center text-4xl font-bold text-sakina-700">
          Bienvenue dans <span className="sakina-serif">Sakina</span>
        </h1>

        <p className="mt-4 text-center text-sm leading-6 text-[#5E6E7A]">
          Un espace pensé pour t’écouter, t’accompagner et t’aider à mieux comprendre ce que tu vis.
        </p>

        <div className="mt-8 space-y-4">
          {pillars.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="sakina-card p-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-5 w-5 text-sakina-700" />
                </div>
                <div>
                  <p className="text-base font-semibold text-sakina-700">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#5E6E7A]">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] bg-[#24313A] p-4 text-white shadow-soft">
          <p className="text-sm leading-6 text-white/80">
            Sakina ne remplace pas un professionnel de santé, mais peut t’aider à mieux respirer, mieux comprendre et mieux agir.
          </p>
        </div>

        <button
          onClick={() => navigate('/Accueil')}
          className="sakina-button sakina-button-primary mt-8 w-full"
        >
          <span>Commencer</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
