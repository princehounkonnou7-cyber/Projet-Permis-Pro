import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, UserPlus, Search, GraduationCap, Phone, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminEtudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const fetchEtudiants = async () => {
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
          .eq('role', 'etudiant')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEtudiants(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEtudiants = etudiants.filter(e =>
    `${e.nom} ${e.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.telephone?.includes(searchTerm)
  );

  return (
    <AdminLayout activePage="etudiants">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Gestion des Étudiants</h1>
            <p className="text-slate-400 text-sm mt-1">Liste des apprenants inscrits dans votre auto-école</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tableau des Étudiants */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Nom & Prénom</th>
                  <th className="px-6 py-4">Type Formation</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Chargement des étudiants...</td>
                  </tr>
                ) : filteredEtudiants.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Aucun étudiant trouvé.</td>
                  </tr>
                ) : (
                  filteredEtudiants.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                          {e.prenom?.[0]}{e.nom?.[0]}
                        </div>
                        {e.prenom} {e.nom}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          e.type_formation === 'en_ligne' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {e.type_formation === 'en_ligne' ? 'En Ligne' : 'Présentiel'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2 text-slate-400">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {e.telephone || 'Non renseigné'}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(e.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

