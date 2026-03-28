import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Globe, Briefcase, Code, Database, Wrench, BookOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { fadeInUp, staggerContainer } from '../lib/animations';

export default function AboutPage() {
  const { t } = useTranslation();

  const skills = [
    {
      category: t('aboutPage.skills.frontend'),
      icon: Code,
      items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion']
    },
    {
      category: t('aboutPage.skills.backend'),
      icon: Database,
      items: ['Node.js', 'Supabase', 'PostgreSQL']
    },
    {
      category: t('aboutPage.skills.tools'),
      icon: Wrench,
      items: ['Git', 'GitHub', 'Netlify', 'Figma', 'VS Code']
    },
    {
      category: t('aboutPage.skills.learning'),
      icon: BookOpen,
      items: ['Next.js', 'React Native', 'PHP/Laravel']
    }
  ];

  const timeline = [
    {
      year: t('aboutPage.timeline.step1.year'),
      desc: t('aboutPage.timeline.step1.desc')
    },
    {
      year: t('aboutPage.timeline.step2.year'),
      desc: t('aboutPage.timeline.step2.desc')
    },
    {
      year: t('aboutPage.timeline.step3.year'),
      desc: t('aboutPage.timeline.step3.desc')
    },
    {
      year: t('aboutPage.timeline.step4.year'),
      desc: t('aboutPage.timeline.step4.desc')
    }
  ];

  return (
    <div className="w-full min-h-screen bg-neutral-50 pb-0">
      {/* Hero Section */}
      <section className="bg-primary-800 pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-primary-200 text-sm mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">{t('aboutPage.breadcrumb.home')}</Link>
            <span>→</span>
            <span className="text-white">{t('aboutPage.breadcrumb.about')}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-white mb-6"
          >
            {t('aboutPage.hero.title')}
          </motion.h1>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="w-full lg:w-1/3 relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-primary-100">
                <img 
                  src="https://i.postimg.cc/RZ8rJGjV/image-(7)-(1).webp" 
                  alt="APEDO Elias Josué Kossi" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-[#1B3F6B] to-[#2EAA6E] flex items-center justify-center">
                  <span className="text-white font-bold text-8xl font-title">EJK</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-accent-500 rounded-2xl z-0 hidden md:block"></div>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full lg:w-2/3"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-title font-bold text-primary-800 mb-2">
                APEDO Elias Josué Kossi
              </motion.h2>
              <motion.h3 variants={fadeInUp} className="text-xl text-accent-600 font-medium mb-6">
                {t('aboutPage.presentation.title')}
              </motion.h3>
              <motion.p variants={fadeInUp} className="text-neutral-600 text-lg leading-relaxed mb-8">
                {t('aboutPage.presentation.paragraph')}
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <MapPin size={20} />
                  </div>
                  <span className="font-medium">{t('aboutPage.presentation.info.location')}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <Calendar size={20} />
                  </div>
                  <span className="font-medium">{t('aboutPage.presentation.info.age')}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <Globe size={20} />
                  </div>
                  <span className="font-medium">{t('aboutPage.presentation.info.availability')}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <Briefcase size={20} />
                  </div>
                  <span className="font-medium">{t('aboutPage.presentation.info.founder')}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 md:px-6 bg-neutral-50">
        <div className="container mx-auto">
          <SectionTitle title={t('aboutPage.skills.title')} align="center" />
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            {skills.map((skillGroup, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600">
                      <skillGroup.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-primary-800">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item, i) => (
                      <Badge key={i} variant={idx === 3 ? "gray" : "blue"} className="flex items-center gap-1.5 py-1.5">
                        <CheckCircle2 size={14} className={idx === 3 ? "text-neutral-400" : "text-accent-500"} />
                        {item}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <SectionTitle title={t('aboutPage.timeline.title')} align="center" />
          
          <div className="mt-16 relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-100 transform md:-translate-x-1/2"></div>
            
            <div className="space-y-12">
              {timeline.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-accent-500 border-4 border-white shadow-sm transform -translate-x-1/2 mt-1.5 md:mt-0 z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                    <div className="bg-neutral-50 p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-bold text-sm mb-3">
                        {step.year}
                      </span>
                      <p className="text-neutral-700 font-medium text-lg">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-800 to-accent-600 text-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-title font-bold text-white mb-10">
            {t('aboutPage.cta.title')}
          </h2>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-primary-800 hover:bg-neutral-100 text-lg h-14 px-10 shadow-xl border-none">
              {t('aboutPage.cta.button')}
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
