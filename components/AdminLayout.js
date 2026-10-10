import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  LogOut, 
  Car 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLayout({ children, activePage }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const menuItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Étudiants', href: '/admin/etudiants', icon: Users, id: 'etudiants' },
    { name: 'Professeurs / Moniteurs', href: '/admin/profs', icon: UserCheck, id: 'profs' },
    { name: 'Cours & Supports', href: '/admin/cours', icon: BookOpen, id: 'cours' },
    { name: 'Emploi du temps', href: '/admin/planning', icon: Calendar, id: 'planning' },
    { name: 'Finances & Paiements', href: '/admin/finances', icon: CreditCard, id: 'finances' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-800/60 border-r border-slate-700/60 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-slate-700/60 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">PermisPro</h1>
              <span className="text-xs text-blue-400 font-medium">Espace Admin / Prof</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

