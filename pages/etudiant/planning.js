import { useState, useEffect } from 'react';
import EtudiantLayout from '../../components/EtudiantLayout';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function EtudiantPlanning() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanning();
  }, []);

  const fetchPlanning = async () => {
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
          .from('planning')
          .select('*')
          .eq('auto_ecole_id', profile.auto_ecole_id)
          .order('date_debut', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EtudiantLayout activePage="planning">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mon Emploi du Temps</h1>
          <p className="text-slate-400 text-xs mt-1">Vos dates de cours et examens à venir</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-slate-400 text-sm">Chargement du calendrier...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-400 text-sm">Aucun cours programmé dans l'emploi du temps.</p>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  evt.type_cours === 'ligne' ? 'bg-purple-600/20 text-purple-400' :
                  evt.type_cours === 'presentiel' ? 'bg-emerald-600/20 text-emerald-400' :
                  'bg-red-600/20 text-red-400'
                }`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    {evt.type_cours}
                  </span>
                  <h4 className="font-bold text-white text-base">{evt.titre}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(evt.date_debut).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {evt.lieu_ou_lien && (
                    <p className="text-xs text-blue-400 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {evt.lieu_ou_lien}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </EtudiantLayout>
  );
}

