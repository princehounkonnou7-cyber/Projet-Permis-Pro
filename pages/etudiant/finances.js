import { useState, useEffect } from 'react';
import EtudiantLayout from '../../components/EtudiantLayout';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function EtudiantFinances() {
  const [finances, setFinances] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('paiements')
        .select('*')
        .eq('etudiant_id', user.id)
        .single();

      if (error) throw error;
      setFinances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = finances ? Number(finances.montant_total) : 0;
  const paye = finances ? Number(finances.montant_paye) : 0;
  const reste = total - paye;

  return (
    <EtudiantLayout activePage="finances">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mon Suivi Financier</h1>
          <p className="text-slate-400 text-xs mt-1">Transparence complète sur vos règlements de formation</p>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Chargement de votre compte...</p>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl text-center space-y-2">
              <span className="text-xs uppercase font-semibold text-slate-400">Statut du Compte</span>
              <div className="flex items-center justify-center gap-2">
                {finances?.statut === 'paye' ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-xl font-bold text-emerald-400">Formation Intégralement Réglée</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                    <span className="text-xl font-bold text-amber-400">Paiement Partiel / Solde en cours</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 block">Coût Total Formation</span>
                <span className="text-xl font-bold text-white mt-1 block">{total.toLocaleString()} FCFA</span>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 block">Montant Payé</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">{paye.toLocaleString()} FCFA</span>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 block">Reste à Réglé</span>
                <span className="text-xl font-bold text-amber-400 mt-1 block">{reste > 0 ? `${reste.toLocaleString()} FCFA` : '0 FCFA'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </EtudiantLayout>
  );
}

