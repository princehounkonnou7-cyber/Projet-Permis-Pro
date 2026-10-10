import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { CreditCard, Edit3 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminFinances() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [updateData, setUpdateData] = useState({ total: 0, paye: 0 });

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
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
          .from('paiements')
          .select('*, profiles(nom, prenom, telephone)')
          .eq('auto_ecole_id', profile.auto_ecole_id);

        if (error) throw error;
        setPaiements(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const statut = Number(updateData.paye) >= Number(updateData.total) ? 'paye' : 'partiel';
      const { error } = await supabase
        .from('paiements')
        .update({
          montant_total: updateData.total,
          montant_paye: updateData.paye,
          statut: statut,
          updated_at: new Date()
        })
        .eq('id', selectedPaiement.id);

      if (error) throw error;
      setSelectedPaiement(null);
      fetchPaiements();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout activePage="finances">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">Gestion Financière</h1>
          <p className="text-slate-400 text-sm mt-1">Suivez les versements et le reste à payer de chaque élève</p>
        </div>

        {/* Modal de modification */}
        {selectedPaiement && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-xl font-bold text-white">Mettre à jour le règlement</h3>
              <p className="text-sm text-slate-400">Élève : {selectedPaiement.profiles?.prenom} {selectedPaiement.profiles?.nom}</p>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Montant Total de la Formation (FCFA)</label>
                  <input
                    type="number"
                    value={updateData.total}
                    onChange={(e) => setUpdateData({ ...updateData, total: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Montant Déjà Encaissé (FCFA)</label>
                  <input
                    type="number"
                    value={updateData.paye}
                    onChange={(e) => setUpdateData({ ...updateData, paye: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaiement(null)}
                    className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl text-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tableau Financier */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Élève</th>
                  <th className="px-6 py-4">Frais Totaux</th>
                  <th className="px-6 py-4">Payé</th>
                  <th className="px-6 py-4">Reste à Payer</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Chargement de la comptabilité...</td>
                  </tr>
                ) : paiements.map((p) => {
                  const reste = Number(p.montant_total) - Number(p.montant_paye);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-medium text-white">
                        {p.profiles?.prenom} {p.profiles?.nom}
                      </td>
                      <td className="px-6 py-4">{Number(p.montant_total).toLocaleString()} FCFA</td>
                      <td className="px-6 py-4 text-emerald-400 font-semibold">{Number(p.montant_paye).toLocaleString()} FCFA</td>
                      <td className="px-6 py-4 text-amber-400 font-semibold">{reste > 0 ? `${reste.toLocaleString()} FCFA` : '0 FCFA'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.statut === 'paye' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {p.statut === 'paye' ? 'Réglé' : 'Partiel / En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPaiement(p);
                            setUpdateData({ total: p.montant_total, paye: p.montant_paye });
                          }}
                          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

