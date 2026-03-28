import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, X, Lock, Star } from 'lucide-react';
import { useRealisations } from '../hooks/useRealisations';
import { useAvis } from '../hooks/useAvis';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { fadeInUp, staggerContainer } from '../lib/animations';
import type { Realisation } from '../lib/database.types';

export default function RealisationsPage() {
  const { t } = useTranslation();
  const { realisations, loading, error } = useRealisations();
  const { avis, loading: loadingAvis } = useAvis();

  useEffect(() => {
    console.log('RealisationsPage avis state:', { avis, loadingAvis });
  }, [avis, loadingAvis]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Realisation | null>(null);

  useEffect(() => {
    if (selectedProject) {
      console.log('Selected Realisation:', selectedProject);
    }
  }, [selectedProject]);

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
    
    // Flatten and split by comma in case we have ["React, Node"]
    return parsed
      .flatMap(item => typeof item === 'string' ? item.split(',') : String(item))
      .map(s => s.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-orange-100 text-orange-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

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
                      {parseStack(project.stack).slice(0, 3).map((tech, idx) => (
                        <Badge key={idx} variant="gray">{tech}</Badge>
                      ))}
                      {parseStack(project.stack).length > 3 && (
                        <Badge variant="gray">+{parseStack(project.stack).length - 3}</Badge>
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

      {/* Avis Section */}
      {loadingAvis ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : avis.length > 0 ? (
        <section className="mt-24 pt-24 border-t border-neutral-200">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-title font-bold text-primary-900 mb-4">
                {t('realisationsPage.reviews.title', 'Ce que disent mes clients')}
              </h2>
              <div className="w-20 h-1.5 bg-accent-500 mx-auto rounded-full" />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {avis.map((review) => (
                <motion.div key={review.id} variants={fadeInUp}>
                  <Card className="p-8 bg-white border-l-4 border-l-[#2EAA6E] shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-inner ${getInitialsColor(review.client_name)}`}>
                        {review.client_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-900 text-lg">{review.client_name}</h4>
                        <p className="text-sm text-neutral-500 font-medium">{review.client_role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-neutral-200 text-neutral-200"}
                        />
                      ))}
                    </div>
                    <p className="text-neutral-700 leading-relaxed italic">
                      "{review.content}"
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[600px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto flex flex-col z-10"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-full h-[220px] relative shrink-0">
                <img
                  src={selectedProject.image_url || `https://picsum.photos/seed/${selectedProject.id}/600/400`}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedProject.id}/600/400`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/30">
                    {selectedProject.category}
                  </span>
                  {selectedProject.is_confidential && (
                    <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md text-white text-sm font-medium rounded-full border border-red-400/50 flex items-center gap-1">
                      <Lock size={12} />
                      {t('realisationsPage.modal.confidential')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6 sm:p-8 flex-grow">
                <h2 className="text-2xl sm:text-3xl font-title font-bold text-[#1B3F6B] mb-4">
                  {selectedProject.title}
                </h2>
                
                <div className="prose prose-neutral max-w-none mb-8">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[#1B3F6B] mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseStack(selectedProject.stack).map((tech: string, idx: number) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-[#EEF2FF] text-[#1B3F6B] text-sm font-medium rounded-full border border-[#1B3F6B]/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {(selectedProject.live_url || (selectedProject.github_url && !selectedProject.is_confidential)) && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                    {selectedProject.live_url && (
                      <a 
                        href={selectedProject.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <button className="w-full flex items-center justify-center gap-2 bg-[#1B3F6B] hover:bg-[#1B3F6B]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                          <ExternalLink size={18} />
                          {t('realisationsPage.modal.liveUrl')}
                        </button>
                      </a>
                    )}
                    
                    {selectedProject.github_url && !selectedProject.is_confidential && (
                      <a 
                        href={selectedProject.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <button className="w-full flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#24292e]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                          <Github size={18} />
                          {t('realisationsPage.modal.githubUrl')}
                        </button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
