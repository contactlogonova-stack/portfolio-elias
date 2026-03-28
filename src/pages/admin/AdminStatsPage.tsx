import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Hash, 
  Type, 
  Image as ImageIcon, 
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import type { Stat } from '../../lib/database.types';

// Helper to render Lucide icon by name
const IconRenderer = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <AlertCircle size={size} className="text-red-400" />;
  return <IconComponent size={size} className={className} />;
};

export default function AdminStatsPage() {
  const { stats, loading, addStat, updateStat, deleteStat } = useAdminStats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    value: '',
    label_fr: '',
    icon: 'Star',
    order_index: 0
  });

  // Ouvre le modal pour ajouter ou modifier
  const openEditModal = (stat?: Stat) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        value: stat.value,
        label_fr: stat.label_fr,
        icon: stat.icon,
        order_index: stat.order_index
      });
    } else {
      setEditingStat(null);
      setFormData({
        value: '',
        label_fr: '',
        icon: 'Star',
        order_index: stats.length
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStat(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // On duplique le label FR pour EN et DE comme demandé précédemment
    const data = {
      ...formData,
      label_en: formData.label_fr,
      label_de: formData.label_fr
    };

    const result = editingStat 
      ? await updateStat(editingStat.id, data as any)
      : await addStat(data as any);

    if (result.success) {
      handleCloseModal();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette statistique ?')) {
      await deleteStat(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#1B3F6B]/10 flex items-center justify-center text-[#1B3F6B]">
            <BarChart2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Statistiques du portfolio</h1>
            <p className="text-neutral-500 text-sm">Gérez les chiffres affichés sur votre page d'accueil</p>
          </div>
        </div>
        
        <Button 
          onClick={() => openEditModal()}
          className="bg-[#2EAA6E] hover:bg-[#2EAA6E]/90 text-white flex items-center gap-2 h-11 px-6 rounded-xl shadow-lg shadow-[#2EAA6E]/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Ajouter une stat
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner size="lg" className="text-[#1B3F6B]" />
          <p className="text-neutral-500 animate-pulse">Chargement des statistiques...</p>
        </div>
      ) : stats.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-neutral-200 bg-neutral-50/50">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <BarChart2 size={32} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Aucune statistique configurée</h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            Ajoutez des chiffres clés (projets terminés, années d'expérience, etc.) pour valoriser votre profil.
          </p>
          <Button 
            variant="outline"
            onClick={() => openEditModal()}
            className="border-neutral-200 hover:bg-white"
          >
            Ajouter une stat
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              layout
            >
              <Card className="p-6 bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                {/* Boutons d'action */}
                <div className="absolute top-3 right-3 flex gap-1 z-10">
                  <button 
                    type="button"
                    onClick={() => openEditModal(stat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 bg-blue-50/50 rounded-lg transition-colors shadow-sm"
                    title="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDelete(stat.id)}
                    className="p-2 text-red-600 hover:bg-red-50 bg-red-50/50 rounded-lg transition-colors shadow-sm"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#1B3F6B]/5 flex items-center justify-center text-[#1B3F6B]">
                    <IconRenderer name={stat.icon} size={24} />
                  </div>
                  <div className="text-3xl font-black text-[#1B3F6B] tracking-tight">
                    {stat.value}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-300 uppercase w-6">FR</span>
                    <span className="text-sm font-semibold text-neutral-700">{stat.label_fr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-300 uppercase w-6">EN</span>
                    <span className="text-sm text-neutral-500">{stat.label_en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-300 uppercase w-6">DE</span>
                    <span className="text-sm text-neutral-500">{stat.label_de}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <Layers size={10} /> Ordre : {stat.order_index}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-300">
                    ID: {stat.id.substring(0, 8)}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h2 className="text-xl font-bold text-neutral-900">
                  {editingStat ? 'Modifier la statistique' : 'Ajouter une statistique'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                      <Hash size={14} /> Valeur *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] outline-none transition-all"
                      placeholder="Ex: 5+, 12, 100%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                      <Layers size={14} /> Ordre *
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                      <Type size={14} /> Label *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.label_fr}
                      onChange={(e) => setFormData({ ...formData, label_fr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] outline-none transition-all"
                      placeholder="Ex: Projets terminés"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1 italic">
                      Le label sera automatiquement dupliqué pour les versions EN et DE.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                    <ImageIcon size={14} /> Icône Lucide *
                  </label>
                  <div className="flex gap-3">
                    <input
                      required
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] outline-none transition-all"
                      placeholder="Ex: Briefcase, Users, Star, Code"
                    />
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-[#1B3F6B] border border-neutral-200">
                      <IconRenderer name={formData.icon} />
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 italic">
                    Utilisez les noms de <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="underline">Lucide Icons</a> (ex: Rocket, Trophy)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1 h-12 rounded-xl border-neutral-200"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 rounded-xl bg-[#1B3F6B] hover:bg-[#1B3F6B]/90 text-white shadow-lg shadow-[#1B3F6B]/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      editingStat ? 'Mettre à jour' : 'Enregistrer'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
