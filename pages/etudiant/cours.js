import { useState, useEffect } from 'react';
import EtudiantLayout from '../../components/EtudiantLayout';
import { BookOpen, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function EtudiantCours() {
  const [coursList, setCoursList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('auto_ecole_id, type_formation')
        .eq('id', user.id)
        .single();

      if (profile?.auto_ecole_id) {
        const { data, error } = await supabase
          .from('cours')
          .select('*')
          .eq('auto_ecole_id', profile.auto_ecole_id)
          .in('visibilite', ['tous', profile.type_formation])
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCoursList(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EtudiantLayout activePage="cours">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Supports de Cours</h1>
          <p className="text-slate-400 text-xs mt-1">Révisez vos fiches et séries pédagogiques</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-slate-400 text-sm">Chargement de vos cours...</p>
          ) : coursList.length === 0 ? (
            <p className="text-slate-400 text-sm">Aucun cours disponible pour l'instant.</p>
          ) : (
            coursList.map((c) => (
              <div key={c.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/20">
                    {c.categorie}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg">{c.titre}</h3>
                <p className="text-slate-400 text-sm">{c.description || 'Pas de résumé renseigné.'}</p>
                {c.contenu_url && (
                  <a
                    href={c.contenu_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 py-2 px-4 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold transition border border-blue-500/30 mt-2"
                  >
                    Ouvrir le support / Vidéo <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </EtudiantLayout>
  );
}

