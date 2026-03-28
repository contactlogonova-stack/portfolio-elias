import * as React from 'react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Plus, Edit2, Trash2, Lock, X, Upload, Image as ImageIcon, Globe, Github, CheckCircle2 } from 'lucide-react';
import { useAdminRealisations } from '../../hooks/useAdminRealisations';
import type { Realisation } from '../../lib/database.types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { staggerContainer, fadeInUp } from '../../lib/animations';

type FormData = Omit<Realisation, 'id' | 'created_at'>;

const initialFormData: FormData = {
  title: '',
  description: '',
  category: '',
  stack: [],
  live_url: '',
  github_url: '',
  is_confidential: false,
  image_url: null
};

export default function AdminRealisationsPage() {
  const { realisations, loading, addRealisation, updateRealisation, deleteRealisation, refresh } = useAdminRealisations();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [tagInput, setTagInput] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = (realisation?: Realisation) => {
    if (realisation) {
      setEditingId(realisation.id);
      setFormData({
        title: realisation.title,
        description: realisation.description,
        category: realisation.category,
        stack: realisation.stack || [],
        live_url: realisation.live_url || '',
        github_url: realisation.github_url || '',
        is_confidential: realisation.is_confidential,
        image_url: realisation.image_url
      });
      setImagePreview(realisation.image_url);
    } else {
      setEditingId(null);
      setFormData(initialFormData);
      setImagePreview(null);
    }
    setImageFile(null);
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      // Split by comma to allow pasting multiple tags at once
      const newTags = tagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && !formData.stack.includes(tag));
        
      if (newTags.length > 0) {
        setFormData({
          ...formData,
          stack: [...formData.stack, ...newTags]
        });
      }
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      stack: formData.stack.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Include any pending tag input before submitting
      let finalFormData = { ...formData };
      if (tagInput.trim()) {
        const newTags = tagInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag && !formData.stack.includes(tag));
          
        if (newTags.length > 0) {
          finalFormData.stack = [...formData.stack, ...newTags];
        }
      }

      if (editingId) {
        await updateRealisation(editingId, finalFormData, imageFile);
      } else {
        await addRealisation(finalFormData, imageFile);
      }
      await refresh();
      handleCloseModal();
      setTagInput('');
    } catch (error: any) {
      console.error('Error saving realisation:', error);
      alert(`Une erreur est survenue lors de l'enregistrement : ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
      await deleteRealisation(id);
    }
  };

  const parseStack = (stack: any): string[] => {
    if (!stack) return [];
    let parsed: string[] = [];
    
    if (Array.isArray(stack)) {
      parsed = stack;
    } else if (typeof stack === 'string') {
      try {
        const jsonParsed = JSON.parse(stack);
        if (Array.isArray(jsonParsed)) {
          parsed = jsonParsed;
        } else {
          parsed = [stack];
        }
      } catch (e) {
        if (stack.startsWith('{') && stack.endsWith('}')) {
          parsed = stack.slice(1, -1).split(',');
        } else {
          parsed = stack.split(',');
        }
      }
    }
    
    return parsed
      .flatMap(item => typeof item === 'string' ? item.split(',') : String(item))
      .map(s => s.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
  };

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
            <FolderOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-title font-bold text-primary-900">Réalisations</h1>
            <p className="text-neutral-500">Gérez vos projets et créations</p>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white border-none"
        >
          <Plus size={20} />
          Ajouter une réalisation
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : realisations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
            <FolderOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Aucune réalisation</h3>
          <p className="text-neutral-500 mb-6">Vous n'avez pas encore ajouté de projet à votre portfolio.</p>
          <Button variant="outline" onClick={() => handleOpenModal()}>
            Ajouter mon premier projet
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-sm text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Projet</th>
                  <th className="p-4 font-medium">Catégorie</th>
                  <th className="p-4 font-medium">Stack</th>
                  <th className="p-4 font-medium text-center">Statut</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {realisations.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-neutral-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-primary-900">{item.title}</p>
                          <p className="text-xs text-neutral-500 truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="blue">{item.category}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {parseStack(item.stack).slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                        {parseStack(item.stack).length > 3 && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs font-medium">
                            +{parseStack(item.stack).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {item.is_confidential ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 text-orange-500" title="Confidentiel">
                          <Lock size={16} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-500" title="Public">
                          <Globe size={16} />
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {realisations.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-primary-900 truncate">{item.title}</h3>
                      {item.is_confidential && <Lock size={14} className="text-orange-500 shrink-0 mt-1" />}
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <Badge variant="blue" className="text-xs">{item.category}</Badge>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="bg-white border-b border-neutral-100 p-6 flex items-center justify-between z-10 shrink-0">
                <h2 className="text-xl font-bold text-primary-900">
                  {editingId ? 'Modifier la réalisation' : 'Ajouter une réalisation'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <form id="realisation-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">Image miniature</label>
                    <div className="flex items-start gap-6">
                      <div 
                        className="w-32 h-32 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50 relative overflow-hidden group cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Edit2 size={24} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload size={28} className="mb-2 group-hover:text-primary-500 transition-colors" />
                            <span className="text-xs font-medium">Upload image</span>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div className="flex-1 pt-2">
                        <p className="text-sm text-neutral-500 mb-2">
                          Format recommandé : JPG, PNG, WebP. Taille max : 2MB. Ratio 1:1 ou 16:9.
                        </p>
                        {imagePreview && (
                          <button 
                            type="button" 
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                          >
                            Supprimer l'image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">
                        Titre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 focus:bg-white transition-colors outline-none"
                        placeholder="Nom du projet"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 focus:bg-white transition-colors outline-none"
                        placeholder="Ex: Application Web, Site Vitrine..."
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 focus:bg-white transition-colors outline-none resize-none"
                      placeholder="Courte description du projet..."
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">
                      Stack technique
                    </label>
                    <div className="flex flex-col gap-3">
                      <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus-within:bg-white focus-within:border-primary-500 transition-colors flex flex-wrap gap-2 items-center">
                        {formData.stack.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors">
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={formData.stack.length === 0 ? "Tapez une techno" : "Ajouter..."}
                          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className="self-end px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Ajouter la techno
                      </button>
                    </div>
                  </div>

                  {/* URLs & Confidential */}
                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={formData.is_confidential}
                          onChange={(e) => setFormData({...formData, is_confidential: e.target.checked})}
                          className="peer appearance-none w-5 h-5 border-2 border-neutral-300 rounded bg-white checked:bg-accent-500 checked:border-accent-500 transition-colors cursor-pointer"
                        />
                        <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <span className="text-sm font-bold text-neutral-700 group-hover:text-neutral-900 transition-colors flex items-center gap-2">
                        <Lock size={16} className="text-orange-500" />
                        Projet confidentiel (masque le code source)
                      </span>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-neutral-700 flex items-center gap-2">
                          <Globe size={16} /> URL Live (Optionnel)
                        </label>
                        <input
                          type="url"
                          value={formData.live_url || ''}
                          onChange={(e) => setFormData({...formData, live_url: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 focus:bg-white transition-colors outline-none"
                          placeholder="https://..."
                        />
                      </div>

                      {!formData.is_confidential && (
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-neutral-700 flex items-center gap-2">
                            <Github size={16} /> URL GitHub (Optionnel)
                          </label>
                          <input
                            type="url"
                            value={formData.github_url || ''}
                            onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 focus:bg-white transition-colors outline-none"
                            placeholder="https://github.com/..."
                          />
                        </div>
                      )}
                    </div>
                  </div>

                </form>
              </div>

              <div className="bg-neutral-50 border-t border-neutral-200 p-6 flex justify-end gap-3 shrink-0">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  form="realisation-form"
                  variant="primary" 
                  className="min-w-[140px] flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
