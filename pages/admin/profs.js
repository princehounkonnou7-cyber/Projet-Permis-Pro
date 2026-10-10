import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { UserCheck, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminProfs() {
  const [profs, setProfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfs();
  }, []);

  const fetchProfs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('auto_ecole_id')
        .eq('id', user.id)
        .single();

      if (profile?.auto_ecole_id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('auto_ecole_id', profile.auto_ecole_id)
          .in('role', ['prof', 'admin'])
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfs(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout activePage="profs">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">Professeurs & Moniteurs</h1>
          <p className="text-slate-400 text-sm mt-1">Membres du corps enseignant ayant accès à l'administration</p>
        </div>

        {/* Liste des Professeurs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-400 col-span-full">Chargement des enseignants...</p>
          ) : profs.map((p) => (
            <div key={p.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-lg">
                {p.prenom?.[0]}{p.nom?.[0]}
              </div>
              <div>
                <h3 className="font-bold text-white">{p.prenom} {p.nom}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 font-medium inline-block mt-1 uppercase tracking-wider">
                  {p.role === 'admin' ? 'Administrateur' : 'Moniteur'}
                </span>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                  <Phone className="w-3 h-3 text-slate-500" />
                  {p.telephone || 'Non renseigné'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

