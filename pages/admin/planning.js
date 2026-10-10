import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPlanning() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    typeCours: 'ligne',
    lieuOuLien: ''
  });

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

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('auto_ecole_id')
        .eq('id', user.id)
        .single();

      const { error } = await supabase.from('planning').insert([
        {
          auto_ecole_id: profile.auto_ecole_id,
          titre: formData.titre,
          description: formData.description,
          date_debut: formData.dateDebut,
          date_fin: formData.dateFin,
          type_cours: formData.typeCours,
          lieu_ou_lien: formData.lieuOuLien
        }
      ]);

      if (error) throw error;
      setShowModal(false);
      fetchPlanning();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout activePage="planning">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Planification & Emploi du Temps</h1>
            <p className="text-slate-400 text-sm mt-1">Programmez les cours théoriques, séances pratiques et examens</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Programmer un cours
          </button>
        </div>

        {/* Modal Création d'Événement */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
              <h3 className="text-xl font-bold text-white">Ajouter un cours ou examen</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Titre de la session</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Séance de Code en direct"
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Date & Heure Début</label>
                    <input
                      type="datetime-local"
                      required
                      onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Date & Heure Fin</label>
                    <input
                      type="datetime-local"
                      required
                      onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Format</label>
                    <select
                      onChange={(e) => setFormData({ ...formData, typeCours: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="ligne">En Ligne</option>
                      <option value="presentiel">Présentiel</option>
                      <option value="examen">Examen Blanc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Lieu / Lien de la salle</label>
                    <input
                      type="text"
                      placeholder="Salle 1 ou Lien Google Meet"
                      onChange={(e) => setFormData({ ...formData, lieuOuLien: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl text-sm shadow-lg shadow-blue-600/30"
                  >
                    {submitting ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste du planning */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-slate-400">Chargement du planning...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-400">Aucun événement programmé.</p>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    evt.type_cours === 'ligne' ? 'bg-purple-600/20 text-purple-400' :
                    evt.type_cours === 'presentiel' ? 'bg-emerald-600/20 text-emerald-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{evt.titre}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(evt.date_debut).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      {evt.lieu_ou_lien && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {evt.lieu_ou_lien}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  evt.type_cours === 'ligne' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  evt.type_cours === 'presentiel' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {evt.type_cours}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

