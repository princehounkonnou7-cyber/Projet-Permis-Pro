import { useState, useEffect } from 'react';
import EtudiantLayout from '../../components/EtudiantLayout';
import { GraduationCap, BookOpen, Calendar, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function EtudiantDashboard() {
  const [profile, setProfile] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [finances, setFinances] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEtudiantData();
  }, []);

  const fetchEtudiantData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Infos Profil Étudiant
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, auto_ecoles(nom)')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      if (profileData?.auto_ecole_id) {
        // Prochain cours ou examen
        const { data: planningData } = await supabase
          .from('planning')
          .select('*')
          .eq('auto_ecole_id', profileData.auto_ecole_id)
          .gte('date_debut', new Date().toISOString())
          .order('date_debut', { ascending: true })
          .limit(1)
          .single();

        setNextClass(planningData);

        // Situation financière
        const { data: paiementData } = await supabase
          .from('paiements')
          .select('*')
          .eq('etudiant_id', user.id)
          .single();

        setFinances(paiementData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resteAPayer = finances ? Number(finances.montant_total) - Number(finances.montant_paye) : 0;

  return (
    <EtudiantLayout activePage="dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              {profile?.auto_ecoles?.nom || 'Mon Auto-École'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Bonjour, {profile?.prenom || 'Élève'} 👋
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Formation : <span className="font-semibold">{profile?.type_formation === 'en_ligne' ? '100% En Ligne' : 'En Présentiel'}</span>
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Prochain Cours Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Prochaine Session
            </h3>
            <Link href="/etudiant/planning" className="text-xs text-blue-400 font-medium hover:underline">
              Voir tout
            </Link>
          </div>
          {nextClass ? (
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {nextClass.type_cours}
              </span>
              <h4 className="font-bold text-white text-lg mt-2">{nextClass.titre}</h4>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(nextClass.date_debut).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
              {nextClass.lieu_ou_lien && (
                <p className="text-xs text-blue-400 font-medium mt-2">
                  📍 {nextClass.lieu_ou_lien}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Aucun cours programmé pour le moment.</p>
          )}
        </div>

        {/* Financial Summary */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Statut de Règlement
            </h3>
            <Link href="/etudiant/finances" className="text-xs text-blue-400 font-medium hover:underline">
              Détails
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/40">
              <span className="text-xs text-slate-400 block">Déjà Payé</span>
              <span className="text-lg font-bold text-emerald-400 mt-1 block">
                {finances ? `${Number(finances.montant_paye).toLocaleString()} FCFA` : '0 FCFA'}
              </span>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/40">
              <span className="text-xs text-slate-400 block">Reste à Payer</span>
              <span className="text-lg font-bold text-amber-400 mt-1 block">
                {resteAPayer > 0 ? `${resteAPayer.toLocaleString()} FCFA` : '0 FCFA'}
              </span>
            </div>
          </div>
        </div>

        {/* Fast Action */}
        <Link
          href="/etudiant/cours"
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-between font-semibold transition"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <span>Accéder aux cours de révision</span>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </EtudiantLayout>
  );
}

