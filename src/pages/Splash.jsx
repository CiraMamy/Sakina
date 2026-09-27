import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/Onboarding'), 1200)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E8F1F8] via-white to-[#F7F8FC]">
      <div className="text-6xl mb-5">✨</div>
      <h1 className="text-3xl font-bold text-sakina-800">Sakina</h1>
      <p className="mt-2 text-sm text-slate-500">Ton espace de soutien intérieur</p>
    </div>
  )
}
