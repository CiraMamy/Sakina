
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, Users, User, LayoutDashboard } from 'lucide-react';
import { createPageUrl } from './utils';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Accueil', page: 'Accueil', icon: Home },
    { name: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard },
    { name: 'Sakina', page: 'Chat', icon: MessageCircle },
    { name: 'Profil', page: 'Profil', icon: User },
  ];
  
  const hideNavOnPages = ['Splash', 'Onboarding'];
  const showNav = !hideNavOnPages.includes(currentPageName);
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom">
          <div className="max-w-md mx-auto px-4">
            <div className="flex items-center justify-around h-16">
              {navItems.map((item) => {
                const isActive = currentPageName === item.page;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className="flex flex-col items-center justify-center flex-1 transition-all duration-300"
                  >
                    <div className={`p-2 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#7BA9D8]/10' 
                        : 'hover:bg-gray-50'
                    }`}>
                      <Icon 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isActive ? 'text-[#7BA9D8]' : 'text-gray-400'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                      isActive ? 'text-[#7BA9D8]' : 'text-gray-400'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
