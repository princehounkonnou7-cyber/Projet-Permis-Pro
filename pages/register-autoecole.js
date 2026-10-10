import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Building, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function RegisterAutoEcole() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomAutoEcole: '',
    nomAdmin: '',
    prenomAdmin: '',
    email: '',
    password: '',
    telephone: '',
    adresse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Création du compte utilisateur Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Génération du slug unique pour le lien d'invitation
      const slug = formData.nomAutoEcole
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

      // 2. Création de l'auto-école dans la table auto_ecoles
      const { data: ecoleData, error: ecoleError } = await supabase
        .from('auto_ecoles')
        .insert([
          {
            nom: formData.nomAutoEcole,
            slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
            telephone: formData.telephone,
            adresse: formData.adresse,
          }
        ])
        .select()
        .single();

      if (ecoleError) throw ecoleError;

      // 3. Enregistrement du profil Administrateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            auto_ecole_id: ecoleData.id,
            nom: formData.nomAdmin,
            prenom: formData.prenomAdmin,
            role: 'admin',
            telephone: formData.telephone,
          }
        ]);

      if (profileError) throw profileError;

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-xl w-full bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold">Inscrire une Auto-École</h2>
          <p className="text-slate-400 text-sm mt-2">Créez votre espace de gestion et commencez à inviter vos élèves</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Nom de l'Auto-École</label>
              <div className="relative">
                <Building className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Auto-École Excellence"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, nomAutoEcole: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Téléphone Structure</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="+229 01 00 00 00"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Nom de l'Admin</label>
              <input
                type="text"
                required
                placeholder="Dupont"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, nomAdmin: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Prénom de l'Admin</label>
              <input
                type="text"
                required
                placeholder="Jean"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, prenomAdmin: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Administrateur</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="admin@autoecole.com"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Création de l'espace en cours..." : (
              <>
                Créer l'Espace Auto-École
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

