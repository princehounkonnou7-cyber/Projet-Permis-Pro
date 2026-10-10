import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, BookOpen, Calendar, CreditCard, LogOut, Car } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function EtudiantLayout({ children, activePage }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Accueil', href: '/etudiant/dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Mes Cours', href: '/etudiant/cours', icon: BookOpen, id: 'cours' },
    { name: 'Planning', href: '/etudiant/planning', icon: Calendar, id: 'planning' },
    { name: 'Finances', href: '/etudiant/finances', icon: CreditCard, id: 'finances' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between pb-20 md:pb-0">
      {/* Top Header */}
      <header className="bg-slate-800/80 border-b border-slate-700/60 sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30">
            <Car className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-wide">PermisPro</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 p-2 rounded-xl text-sm flex items-center gap-1 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex-1">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 border-t border-slate-700/60 backdrop-blur-lg z-50 flex justify-around items-center py-2 px-4 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isActive ? 'text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

