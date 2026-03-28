import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { 
  FolderOpen, 
  MessageSquare, 
  Star, 
  Mail, 
  ArrowRight, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}</span>;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { 
    realisationsCount, 
    unreadMessagesCount, 
    avisCount, 
    totalMessagesCount, 
    latestRealisations, 
    latestMessages, 
    loading 
  } = useDashboardStats();

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const statsCards = [
    {
      title: 'Total réalisations',
      value: realisationsCount,
      icon: FolderOpen,
      color: 'bg-[#1B3F6B]/10 text-[#1B3F6B]',
      link: '/admin/realisations'
    },
    {
      title: 'Messages non lus',
      value: unreadMessagesCount,
      icon: MessageSquare,
      color: unreadMessagesCount > 0 ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-neutral-500',
      link: '/admin/messages'
    },
    {
      title: 'Total avis',
      value: avisCount,
      icon: Star,
      color: 'bg-[#2EAA6E]/10 text-[#2EAA6E]',
      link: '/admin/avis'
    },
    {
      title: 'Messages reçus',
      value: totalMessagesCount,
      icon: Mail,
      color: 'bg-[#1B3F6B]/10 text-[#1B3F6B]',
      link: '/admin/messages'
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" className="text-[#1B3F6B]" />
        <p className="text-neutral-500 animate-pulse">Initialisation du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tableau de bord</h1>
          <p className="text-neutral-500 text-sm flex items-center gap-2">
            Bonjour Elias 👋 <span className="w-1 h-1 rounded-full bg-neutral-300" /> {today}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-5 md:p-6 border-neutral-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div>
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-neutral-900">
                  <AnimatedNumber value={stat.value} />
                </h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Realisations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/30">
              <h2 className="font-bold text-neutral-900 flex items-center gap-2">
                <FolderOpen size={18} className="text-[#1B3F6B]" />
                Dernières réalisations
              </h2>
              <Link 
                to="/admin/realisations" 
                className="text-xs font-bold text-[#1B3F6B] hover:underline flex items-center gap-1"
              >
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50/50 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-3">Projet</th>
                    <th className="px-6 py-3">Catégorie</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {latestRealisations.map((project) => (
                    <tr key={project.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
                            {project.image_url ? (
                              <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <FolderOpen size={16} />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-neutral-900 text-sm truncate max-w-[150px]">
                            {project.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-400 font-mono">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {latestRealisations.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-neutral-400 italic text-sm">
                        Aucune réalisation pour le moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Latest Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-neutral-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/30">
              <h2 className="font-bold text-neutral-900 flex items-center gap-2">
                <Mail size={18} className="text-[#1B3F6B]" />
                Derniers messages
              </h2>
              <Link 
                to="/admin/messages" 
                className="text-xs font-bold text-[#1B3F6B] hover:underline flex items-center gap-1"
              >
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1">
              {latestMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-neutral-400 italic text-sm">
                  Aucun message reçu
                </div>
              ) : (
                <div className="divide-y divide-neutral-50">
                  {latestMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      onClick={() => navigate('/admin/messages')}
                      className="p-4 hover:bg-neutral-50/50 transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${msg.is_read ? 'bg-neutral-200' : 'bg-red-500 shadow-sm shadow-red-500/50'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className={`text-sm truncate ${msg.is_read ? 'text-neutral-600' : 'font-bold text-neutral-900'}`}>
                            {msg.name}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 truncate group-hover:text-neutral-700 transition-colors">
                          {msg.subject || '(Sans sujet)'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
