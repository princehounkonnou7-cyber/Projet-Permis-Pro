import Link from 'next/link';
import { Car, GraduationCap, ShieldCheck, Smartphone, Users, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-wide">PermisPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Se connecter
            </Link>
            <Link 
              href="/register-autoecole" 
              className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              Inscrire mon auto-école
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
              Plateforme SaaS Multi-Auto-Écoles
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mt-4 leading-tight">
              Gérez votre auto-école et vos élèves en toute simplicité.
            </h1>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Une PWA moderne pour planifier les cours en ligne et présentiel, suivre la comptabilité des élèves et diffuser les cours sur tous les smartphones.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/register-autoecole" 
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
              >
                Créer un espace Auto-École
              </Link>
              <Link 
                href="/login" 
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition border border-slate-700"
              >
                Espace Connexion
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
            <img 
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80" 
              alt="Conduite Auto École" 
              className="relative rounded-2xl border border-slate-800 object-cover w-full h-[400px] shadow-2xl"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl">
            <div className="bg-blue-600/20 text-blue-400 p-3 rounded-xl w-fit mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Espace Étudiant Dédié</h3>
            <p className="text-slate-400 text-sm">
              Chaque élève accède à son emploi du temps, ses supports de cours et son suivi financier personnel.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl">
            <div className="bg-indigo-600/20 text-indigo-400 p-3 rounded-xl w-fit mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Application PWA Installable</h3>
            <p className="text-slate-400 text-sm">
              S'installe directement sur les téléphones Android et iOS en un clic sans passer par l'App Store.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl">
            <div className="bg-emerald-600/20 text-emerald-400 p-3 rounded-xl w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gestion Financière & Planning</h3>
            <p className="text-slate-400 text-sm">
              Suivi clair des acomptes, restes à payer, plannings des cours théoriques et pratiques.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 text-center py-6 text-slate-500 text-sm">
        © PermisPro - Solution SaaS pour Auto-Écoles
      </footer>
    </div>
  );
}

