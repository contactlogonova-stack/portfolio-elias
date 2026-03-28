import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Edit2, Trash2, X, User, Briefcase, Quote, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useAdminAvis } from '../../hooks/useAdminAvis';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import type { Avis } from '../../lib/database.types';

export default function AdminAvisPage() {
  const { avis, loading, addAvis, updateAvis, deleteAvis } = useAdminAvis();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAvis, setEditingAvis] = useState<Avis | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    content: '',
    rating: 5,
    avatar_url: ''
  });

  const handleOpenModal = (item?: Avis) => {
    if (item) {
      setEditingAvis(item);
      setFormData({
        client_name: item.client_name,
        client_role: item.client_role,
        content: item.content,
        rating: item.rating,
        avatar_url: item.avatar_url || ''
      });
    } else {
      setEditingAvis(null);
      setFormData({
        client_name: '',
        client_role: '',
        content: '',
        rating: 5,
        avatar_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAvis(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = editingAvis 
      ? await updateAvis(editingAvis.id, formData)
      : await addAvis(formData);

    if (result.success) {
      handleCloseModal();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      await deleteAvis(id);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'
            } ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#1B3F6B]/10 flex items-center justify-center text-[#1B3F6B]">
            <Star size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Avis clients</h1>
            <p className="text-neutral-500 text-sm">Gérez les témoignages de vos clients</p>
          </div>
        </div>
        
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#2EAA6E] hover:bg-[#2EAA6E]/90 text-white flex items-center gap-2 h-11 px-6 rounded-xl shadow-lg shadow-[#2EAA6E]/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Ajouter un avis
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner size="lg" className="text-[#1B3F6B]" />
          <p className="text-neutral-500 animate-pulse">Chargement des avis...</p>
        </div>
      ) : avis.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-neutral-200 bg-neutral-50/50">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <Quote size={32} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Aucun avis pour le moment</h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            Commencez par ajouter votre premier témoignage client pour le mettre en avant sur votre portfolio.
          </p>
          <Button 
            variant="outline"
            onClick={() => handleOpenModal()}
            className="border-neutral-200 hover:bg-white"
          >
            Ajouter un avis
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {avis.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card className="p-6 h-full flex flex-col bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  {renderStars(item.rating)}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-neutral-700 italic mb-6 flex-grow leading-relaxed">
                  "{item.content.length > 120 ? `${item.content.substring(0, 120)}...` : item.content}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-neutral-50 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200">
                    {item.avatar_url ? (
                      <img src={item.avatar_url} alt={item.client_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-neutral-400" size={24} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-neutral-900 truncate">{item.client_name}</h4>
                    <p className="text-sm text-neutral-500 truncate">{item.client_role}</p>
                  </div>
                  <div className="ml-auto text-[10px] text-neutral-400 font-mono">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
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
                  {editingAvis ? 'Modifier l\'avis' : 'Ajouter un avis'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                      <User size={14} /> Nom du client *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] transition-all outline-none"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                      <Briefcase size={14} /> Rôle / Poste *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.client_role}
                      onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] transition-all outline-none"
                      placeholder="Ex: CEO chez TechCorp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                      <Quote size={14} /> Témoignage *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] transition-all outline-none resize-none"
                      placeholder="Décrivez l'expérience du client..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Note *</label>
                      {renderStars(formData.rating, true)}
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-2">
                        <LinkIcon size={14} /> Avatar URL (optionnel)
                      </label>
                      <input
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1B3F6B]/20 focus:border-[#1B3F6B] transition-all outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
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
                      editingAvis ? 'Mettre à jour' : 'Enregistrer'
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
