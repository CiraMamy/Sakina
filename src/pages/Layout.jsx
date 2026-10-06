import { Link } from 'react-router-dom'
import { Home, MessageCircle, LayoutDashboard, User } from 'lucide-react'
import { createPageUrl } from '../utils'

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: 'Accueil', page: 'Accueil', icon: Home },
    { name: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard },
    { name: 'Sakina', page: 'Chat', icon: MessageCircle },
    { name: 'Profil', page: 'Profil', icon: User },
  ]

  const hideNavOnPages = ['Splash', 'Onboarding']
  const showNav = !hideNavOnPages.includes(currentPageName)

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F2]">
      <main className="flex-1 pb-24">{children}</main>

      {showNav && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/50 bg-white/75 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur-xl shadow-[0_-12px_30px_rgba(36,49,58,0.08)]">
          <div className="mx-auto max-w-md px-2">
            <div className="flex h-[76px] items-center justify-around rounded-t-[28px] py-2">
              {navItems.map((item) => {
                const isActive = currentPageName === item.page
                const Icon = item.icon

                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className="flex flex-1 flex-col items-center justify-center"
                  >
                    <div className={`rounded-[18px] p-2.5 transition-all ${isActive ? 'bg-[linear-gradient(135deg,#E6DFF5,#C9E8D2)] shadow-soft' : 'bg-transparent hover:bg-[#F5EFE6]'}`}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-[#24313A]' : 'text-[#7A8190]'}`} />
                    </div>
                    <span className={`mt-1 text-[10px] font-semibold ${isActive ? 'text-[#24313A]' : 'text-[#7A8190]'}`}>
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
