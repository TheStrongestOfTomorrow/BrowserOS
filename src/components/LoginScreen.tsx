import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, ShieldCheck, AlertCircle, Github, UserCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { signInAsGuest, signInWithGithub } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Supabase requires email, so we use a dummy domain
    const email = `${username.toLowerCase()}@browseros.local`;

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username }
          }
        });

        if (signUpError) throw signUpError;
        
        // Create profile
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, username, avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}` }]);
          
          if (profileError) console.error('Profile creation error:', profileError);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/60 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md p-8 glass rounded-3xl border border-white/20 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">browserOS</h1>
          <p className="text-white/50 text-sm mt-1">
            {isRegistering ? 'Create your digital identity' : 'Welcome back, explorer'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5 ml-1">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 transition-all"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
                {isRegistering ? 'Sign Up' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-4 bg-[#1a1a1a] text-[10px] uppercase font-bold text-white/20 tracking-widest">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={signInWithGithub}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 text-xs font-bold transition-all"
            >
              <Github size={16} />
              GitHub
            </button>
            <button 
              onClick={signInAsGuest}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 text-xs font-bold transition-all"
            >
              <UserCircle size={16} />
              Guest
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-white/40 hover:text-white text-xs transition-colors"
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
