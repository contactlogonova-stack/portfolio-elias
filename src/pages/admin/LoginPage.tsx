import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { scaleIn, fadeInUp } from '../../lib/animations';
import logo from '@/assets/logo.png';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/admin/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(t('loginPage.error'));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="h-[60px] w-auto object-contain mb-6"
          />
          <h1 className="text-2xl font-title font-bold text-primary-800 mb-2">
            {t('loginPage.title')}
          </h1>
          <p className="text-neutral-500">
            {t('loginPage.subtitle')}
          </p>
        </div>

        {error && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="font-medium text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-neutral-700">
              {t('loginPage.email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-opacity-20"
                placeholder="admin@example.com"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-neutral-700">
              {t('loginPage.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-opacity-20"
                placeholder="••••••••"
                required
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-primary-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-lg flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="text-white" />
                {t('loginPage.loading')}
              </>
            ) : (
              t('loginPage.submit')
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
