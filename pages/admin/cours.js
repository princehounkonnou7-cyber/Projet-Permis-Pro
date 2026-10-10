import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { BookOpen, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminCours() {
  const [cours, setCours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'Code de la route',
    contenuUrl: '',
    visibilite: 'tous'
  });

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
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
          .from('cours')
          .select('*')
          .eq('auto_ecole_id', profile.auto_ecole_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCours(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCours = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('auto_ecole_id')
        .eq('id', user.id)
        .single();

      const { error } = await supabase.from('cours').insert([
        {
          auto_ecole_id: profile.auto_ecole_id,
          titre: formData.titre,
          description: formData.description,
          categorie: formData.categorie,
          contenu_url: formData.contenuUrl,
          visibilite: formData.visibilite
        }
      ]);

      if (error) throw error;
      setShowModal(false);
      setFormData({ titre: '', description: '', categorie: 'Code de la route', contenuUrl: '', visibilite: 'tous' });
      fetchCours();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout activePage="cours">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Cours & Supports Pédagogiques</h1>
            <p className="text-slate-400 text-sm mt-1">Publiez les contenus de révision pour vos élèves</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un cours
          </button>
        </div>

        {/* Modal d'ajout de cours */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
              <h3 className="text-xl font-bold text-white">Nouveau Cours</h3>
              <form onSubmit={handleAddCours} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Titre du cours</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Les panneaux de signalisation"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Description / Résumé</label>
                  <textarea
                    rows="3"
                    placeholder="Synthèse du cours..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Catégorie</label>
                    <input
                      type="text"
                      placeholder="Code de la route, Conduite..."
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Visibilité</label>
                    <select
                      value={formData.visibilite}
                      onChange={(e) => setFormData({ ...formData, visibilite: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="tous">Tous les élèves</option>
                      <option value="en_ligne">Élèves En Ligne seulement</option>
                      <option value="presentiel">Élèves Présentiel seulement</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Lien du document ou vidéo (URL)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... ou https://youtube.com/..."
                    value={formData.contenuUrl}
                    onChange={(e) => setFormData({ ...formData, contenuUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
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
                    {submitting ? 'Publication...' : 'Publier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cartes de cours */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-400 col-span-full">Chargement des cours...</p>
          ) : cours.length === 0 ? (
            <p className="text-slate-400 col-span-full">Aucun cours disponible pour le moment.</p>
          ) : (
            cours.map((c) => (
              <div key={c.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/20">
                      {c.categorie}
                    </span>
                    <span className="text-xs text-slate-400 uppercase">
                      {c.visibilite === 'tous' ? 'Tous' : c.visibilite}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{c.titre}</h3>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-4">{c.description || 'Pas de description.'}</p>
                </div>
                {c.contenu_url && (
                  <a
                    href={c.contenu_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Accéder au support <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

