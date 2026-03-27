import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, X, Lock } from 'lucide-react';
import { useRealisations } from '../hooks/useRealisations';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { fadeInUp, staggerContainer } from '../lib/animations';
import type { Realisation } from '../lib/database.types';

export default function RealisationsPage() {
  const { t } = useTranslation();
  const { realisations, loading, error } = useRealisations();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Realisation | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(realisations.map(r => r.category)))];

  // Filter realisations
  const filteredRealisations = activeCategory === 'all' 
    ? realisations 
    : realisations.filter(r => r.category === activeCategory);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <div className="w-full min-h-screen bg-neutral-50 pb-20">
      {/* Hero Section */}
      <section className="bg-primary-800 pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-primary-200 text-sm mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">{t('realisationsPage.breadcrumb.home')}</Link>
            <span>→</span>
            <span className="text-white">{t('realisationsPage.breadcrumb.realisations')}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-white mb-6"
          >
            {t('realisationsPage.hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-100 max-w-2xl"
          >
            {t('realisationsPage.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-12 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'bg-white text-primary-600 border border-primary-200 hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                {category === 'all' ? t('realisationsPage.filters.all') : category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            Une erreur est survenue lors du chargement des réalisations.
          </div>
        ) : filteredRealisations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 text-lg">{t('realisationsPage.empty')}</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredRealisations.map((project) => (
              <motion.div key={project.id} variants={fadeInUp}>
                <Card className="h-full flex flex-col group overflow-hidden">
                  <div className="relative h-56 overflow-hidden bg-neutral-100">
                    <img
                      src={project.image_url || `https://picsum.photos/seed/${project.id}/600/400`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${project.id}/600/400`;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="green" className="shadow-md">{project.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-neutral-600 mb-6 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto mb-6">
                      {(project.tech_stack || []).slice(0, 3).map((tech, idx) => (
                        <Badge key={idx} variant="gray">{tech}</Badge>
                      ))}
                      {(project.tech_stack || []).length > 3 && (
                        <Badge variant="gray">+{project.tech_stack.length - 3}</Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedProject(project)}
                    >
                      {t('realisationsPage.card.viewProject')}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-900/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-neutral-600 hover:text-primary-600 hover:bg-white transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
              
              <div className="w-full h-64 sm:h-80 md:h-96 bg-neutral-100 relative shrink-0">
                <img
                  src={selectedProject.image_url || `https://picsum.photos/seed/${selectedProject.id}/1200/800`}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedProject.id}/1200/800`;
                  }}
                />
              </div>
              
              <div className="p-6 md:p-10 flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="green">{selectedProject.category}</Badge>
                  {selectedProject.is_confidential && (
                    <Badge variant="gray" className="flex items-center gap-1">
                      <Lock size={12} />
                      {t('realisationsPage.modal.confidential')}
                    </Badge>
                  )}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-title font-bold text-primary-800 mb-6">
                  {selectedProject.title}
                </h2>
                
                <div className="prose prose-neutral max-w-none mb-8">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.tech_stack || []).map((tech, idx) => (
                      <Badge key={idx} variant="blue" className="px-3 py-1.5 text-sm">{tech}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-100">
                  {selectedProject.live_url && (
                    <a 
                      href={selectedProject.live_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                        <ExternalLink size={18} />
                        {t('realisationsPage.modal.liveUrl')}
                      </Button>
                    </a>
                  )}
                  
                  {!selectedProject.is_confidential && selectedProject.github_url && (
                    <a 
                      href={selectedProject.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Github size={18} />
                        {t('realisationsPage.modal.githubUrl')}
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
