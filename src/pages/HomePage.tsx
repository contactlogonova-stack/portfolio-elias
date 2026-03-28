import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, animate } from 'motion/react';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { Star, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { fadeInUp, staggerContainer } from '../lib/animations';
import type { Stat } from '../lib/database.types';
import { useAvis } from '../hooks/useAvis';

interface Realisation {
  id: string;
  title: string;
  image_url: string;
  category: string;
  stack: string[];
}

const Typewriter = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const texts = t('hero.typewriter', { returnObjects: true }) as string[];

  useEffect(() => {
    if (!Array.isArray(texts)) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [texts]);

  if (!Array.isArray(texts)) return null;

  return (
    <div className="h-12 sm:h-16 overflow-hidden flex items-center justify-center lg:justify-start">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="block text-2xl sm:text-3xl md:text-4xl font-bold text-accent-500"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

interface AnimatedCounterProps {
  value: string;
  label: string;
  icon: any;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, label, icon: Icon }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  const numericValue = parseInt(value);
  const suffix = value.replace(/[0-9]/g, '');
  const isNumeric = !isNaN(numericValue);

  useEffect(() => {
    if (inView && isNumeric) {
      const controls = animate(0, numericValue, {
        duration: 2,
        ease: "easeOut",
        onUpdate(val) {
          setCount(Math.round(val));
        }
      });
      return () => controls.stop();
    }
  }, [inView, numericValue, isNumeric]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-accent-400">
        <Icon size={32} />
      </div>
      <div className="text-4xl font-title font-bold text-white mb-2">
        {isNumeric ? `${count}${suffix}` : value}
      </div>
      <div className="text-primary-200 font-medium">{label}</div>
    </div>
  );
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const { avis, loading: isLoadingAvis } = useAvis();
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    // avis state check
  }, [avis, isLoadingAvis]);

  const [isLoadingRealisations, setIsLoadingRealisations] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        const { data, error } = await supabase
          .from('realisations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        if (error) throw error;
        setRealisations(data || []);
      } catch (err) {
        console.error("Error fetching realisations:", err);
      } finally {
        setIsLoadingRealisations(false);
      }
    };

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .order('order_index', { ascending: true });
        if (error) throw error;
        setStats(data || []);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchRealisations();
    fetchStats();
  }, []);

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
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-white">
        {/* Background shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center lg:text-left"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 border border-accent-100">
                <span className="text-accent-600 font-medium text-sm">{t('hero.badge')}</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-7xl font-title font-bold text-primary-600 mb-4 leading-tight">
                {t('hero.title')}
              </motion.h1>

              <motion.div variants={fadeInUp} className="mb-6">
                <Typewriter />
              </motion.div>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.description')}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/realisations">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                    {t('hero.cta.projects')}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('hero.cta.contact')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 relative w-full max-w-md lg:max-w-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full aspect-square rounded-full bg-gradient-to-tr from-primary-100 to-accent-100 p-4">
                <img
                  src="https://i.postimg.cc/RZ8rJGjV/image-(7)-(1).webp"
                  alt="Elias Josué Kossi"
                  className="w-full h-full object-cover rounded-full shadow-2xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full rounded-full bg-gradient-to-br from-[#1B3F6B] to-[#2EAA6E] flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-7xl sm:text-8xl md:text-9xl font-title">EJK</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-800 py-20">
        <div className="container mx-auto px-4 md:px-6">
          {isLoadingStats ? (
            <div className="flex justify-center">
              <Spinner size="lg" className="text-white" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const IconComponent = (Icons as any)[stat.icon] || Icons.Circle;
                const label = i18n.language === 'fr' 
                  ? stat.label_fr 
                  : i18n.language === 'de' 
                    ? stat.label_de 
                    : stat.label_en;
                
                return (
                  <AnimatedCounter 
                    key={stat.id} 
                    value={stat.value} 
                    label={label} 
                    icon={IconComponent} 
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title={t('projects.title')}
            subtitle={t('projects.subtitle')}
            align="center"
          />

          {isLoadingRealisations ? (
            <Spinner size="lg" className="my-20" />
          ) : realisations.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {realisations.map((project) => (
                <motion.div key={project.id} variants={fadeInUp}>
                  <Card className="h-full flex flex-col group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image_url || `https://picsum.photos/seed/${project.id}/600/400`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${project.id}/600/400`;
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="blue" className="shadow-md">{project.category}</Badge>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-auto pt-4">
                        {(project.stack || []).map((tech, idx) => (
                          <Badge key={idx} variant="gray">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100 mb-12">
              <p className="text-neutral-500 text-lg">{t('projects.empty')}</p>
            </div>
          )}

          <div className="text-center">
            <Link to="/realisations">
              <Button variant="outline" size="lg">
                {t('projects.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {isLoadingAvis ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : avis.length > 0 ? (
        <section className="py-24 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTitle
              title={t('reviews.title')}
              subtitle={t('reviews.subtitle')}
              align="center"
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar"
            >
              {avis.slice(0, 6).map((review) => (
                <motion.div 
                  key={review.id} 
                  variants={fadeInUp}
                  className="min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center"
                >
                  <Card className="p-8 h-full flex flex-col bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-neutral-200 text-neutral-200"}
                        />
                      ))}
                    </div>
                    <p className="text-neutral-700 italic mb-8 flex-grow leading-relaxed">
                      "{review.content}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg uppercase ${getInitialsColor(review.client_name)}`}>
                        {review.client_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900">{review.client_name}</h4>
                        <p className="text-sm text-neutral-500">{review.client_role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-800 to-accent-600 relative overflow-hidden">
        {/* Decorative overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-title font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              {t('cta.subtitle')}
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-neutral-100 hover:text-primary-800 text-lg h-14 px-10 shadow-xl border-none">
                {t('cta.button')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
