import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { initPushNotifications } from '../../lib/webpush';

export default function AdminSettingsPage() {
  const { user, signOut } = useAuth();
  
  // Password form state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notifications state
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('admin_notifications_enabled') === 'true';
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwords.new.length < 8) {
      setPasswordStatus({ type: 'error', message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordStatus({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;
      
      setPasswordStatus({ type: 'success', message: 'Mot de passe mis à jour avec succès !' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message || 'Une erreur est survenue.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    
    if (newValue) {
      setIsUpdatingNotifications(true);
      const success = await initPushNotifications();
      setIsUpdatingNotifications(false);

      if (success) {
        setNotificationsEnabled(true);
        setNotificationPermission('granted');
        localStorage.setItem('admin_notifications_enabled', 'true');
      } else {
        setNotificationsEnabled(false);
        localStorage.setItem('admin_notifications_enabled', 'false');
        setNotificationPermission(Notification.permission);
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('admin_notifications_enabled', 'false');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl bg-[#1B3F6B]/10 flex items-center justify-center text-[#1B3F6B]">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Paramètres</h1>
          <p className="text-neutral-500 text-sm">Gérez votre compte et vos préférences</p>
        </div>
      </div>

      {/* Section 1: Account Info */}
      <Card className="p-6 border-neutral-100 shadow-sm overflow-hidden relative">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
              <User size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                Mon compte
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2EAA6E]/10 text-[#2EAA6E] text-[10px] font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2EAA6E] animate-pulse" />
                  Connecté
                </span>
              </h2>
              <div className="space-y-1">
                <p className="text-neutral-600 text-sm flex items-center gap-2">
                  <span className="font-semibold">Email :</span> {user?.email}
                </p>
                <p className="text-neutral-600 text-sm flex items-center gap-2">
                  <span className="font-semibold">Rôle :</span> Administrateur
                </p>
                <p className="text-neutral-400 text-xs mt-2">
                  Dernière connexion : {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 2: Security */}
        <Card className="p-6 border-neutral-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Lock size={20} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Sécurité</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 flex-1">
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/10 focus:border-[#1B3F6B] outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/10 focus:border-[#1B3F6B] outline-none transition-all"
                    placeholder="Min. 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/10 focus:border-[#1B3F6B] outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {passwordStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
                    passwordStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {passwordStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {passwordStatus.message}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full h-11 bg-[#1B3F6B] hover:bg-[#1B3F6B]/90 text-white rounded-xl shadow-lg shadow-[#1B3F6B]/10 mt-2"
            >
              {isUpdatingPassword ? <Loader2 className="animate-spin" size={20} /> : 'Mettre à jour le mot de passe'}
            </Button>
          </form>
        </Card>

        {/* Section 3: Notifications */}
        <Card className="p-6 border-neutral-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Bell size={20} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Notifications</h2>
          </div>

          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-700">Notifications Push</p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Recevez une notification à chaque nouveau message reçu.
                </p>
              </div>
              
              <button
                onClick={toggleNotifications}
                disabled={isUpdatingNotifications}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 outline-none ${
                  notificationsEnabled ? 'bg-[#2EAA6E]' : 'bg-neutral-200'
                } ${isUpdatingNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUpdatingNotifications ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={12} />
                  </div>
                ) : (
                  <motion.div
                    animate={{ x: notificationsEnabled ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                )}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notificationsEnabled && notificationPermission === 'granted' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Statut</p>
                  <p className="text-sm font-semibold text-neutral-700">
                    {notificationsEnabled && notificationPermission === 'granted' 
                      ? 'Notifications activées ✅' 
                      : 'Notifications désactivées'}
                  </p>
                </div>
              </div>
              {notificationPermission === 'denied' && (
                <p className="text-[10px] text-red-500 mt-2">
                  Les notifications sont bloquées par votre navigateur. Veuillez les autoriser dans les paramètres du site.
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Section 4: Danger Zone */}
      <Card className="p-6 border-red-100 bg-red-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-900">Zone dangereuse</h2>
            <p className="text-sm text-red-700/70">Actions irréversibles sur votre session</p>
          </div>
        </div>
        
        <Button
          onClick={signOut}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 h-11 px-8 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
        >
          <LogOut size={20} />
          Se déconnecter
        </Button>
      </Card>
    </div>
  );
}
