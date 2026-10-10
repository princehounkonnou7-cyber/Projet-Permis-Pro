import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { User, Mail, Lock, Phone, ArrowRight, Building } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function JoinStudent() {
  const router = useRouter();
  const { slug } = router.query;

  const [autoEcole, setAutoEcole] = useState(null);
  const [loadingAutoEcole, setLoadingAutoEcole] = useState(true);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer l'auto-école à partir du slug dans l'URL
  useEffect(() => {
    if (!slug) return;

    async function fetchAutoEcole() {
      setLoadingAutoEcole(true);
      const { data, error } = await supabase
        .from('auto_ecoles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setError("Auto-école introuvable ou lien d'invitation invalide.");
      } else {
        setAutoEcole(data);
      }
      setLoadingAutoEcole(false);
    }

    fetchAutoEcole();
  }, [slug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!autoEcole) {
        throw new Error("Impossible d'associer cet élève à une auto-école.");
      }

      // 1. Création de l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Erreur lors de la création du compte.");

            // 2. Création du profil étudiant relié à l'auto-école (sans la colonne email)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            role: 'etudiant',
            auto_ecole_id: autoEcole.id,
          },
        ]);


      if (profileError) throw profileError;

      // 3. Redirection vers l'espace étudiant
      router.push('/etudiant/dashboard');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l inscription.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAutoEcole) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Chargement de l'invitation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Building className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold">{autoEcole ? autoEcole.nom : 'PermisPro'}</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">
          Rejoindre l'Auto-École
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Inscrivez-vous pour accéder à vos cours, plannings et révisions en ligne.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Jean"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+229 01 00 00 00"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Email Étudiant
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="etudiant@email.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Création du compte..." : "S'inscrire comme Élève"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Déjà inscrit ?{' '}
              <Link href="/login" className="text-blue-400 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

