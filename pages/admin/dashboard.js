import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, BookOpen, CreditCard, Copy, Check, Calendar, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ etudiants: 0, cours: 0, revenus: 0 });
  const [autoEcole, setAutoEcole] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupération du profil admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('auto_ecole_id')
        .eq('id', user.id)
        .single();

      if (profile?.auto_ecole_id) {
        // Infos de l'auto-école
        const { data: ecole } = await supabase
          .from('auto_ecoles')
          .select('*')
          .eq('id', profile.auto_ecole_id)
          .single();
        setAutoEcole(ecole);

        // Compter les étudiants
        const { count: etudiantsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('auto_ecole_id', profile.auto_ecole_id)
          .eq('role', 'etudiant');

        // Compter les cours
        const { count: coursCount } = await supabase
          .from('cours')
          .select('*', { count: 'exact', head: true })
          .eq('auto_ecole_id', profile.auto_ecole_id);

        // Somme des paiements
        const { data: paiements } = await supabase
          .from('paiements')
          .select('montant_paye')
          .eq('auto_ecole_id', profile.auto_ecole_id);

        const totalRevenus = paiements ? paiements.reduce((acc, p) => acc + Number(p.montant_paye || 0), 0) : 0;

        setStats({
          etudiants: etudiantsCount || 0,
          cours: coursCount || 0,
          revenus: totalRevenus
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (!autoEcole) return;
    const link = `${window.location.origin}/join/${autoEcole.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout activePage="dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold">{autoEcole?.nom || 'Tableau de bord Admin'}</h1>
          <p className="text-slate-400 text-sm mt-1">Aperçu global de l'activité de votre auto-école</p>
        </div>

        {/* Banner Lien d'Invitation */}
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-400 tracking-wider">Inscriptions Étudiants</span>
            <h3 className="text-lg font-bold mt-1">Lien d'invitation officiel</h3>
            <p className="text-slate-400 text-sm">Partagez ce lien à vos nouveaux élèves pour qu'ils s'inscrivent automatiquement dans votre auto-école.</p>
          </div>
          <button
            onClick={copyInviteLink}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Lien copié !' : "Copier le lien d'invitation"}
          </button>
        </div>

        {/* Cartes Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Total Élèves</span>
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">{loading ? '...' : stats.etudiants}</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Cours Publiés</span>
              <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">{loading ? '...' : stats.cours}</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Recettes Encaissées</span>
              <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">{loading ? '...' : `${stats.revenus.toLocaleString()} FCFA`}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

