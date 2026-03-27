import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe, UtensilsCrossed, ShoppingCart, Zap, Wrench, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { fadeInUp, staggerContainer } from '../lib/animations';

export default function ServicesPage() {
  const { t } = useTranslation();

  const services = [
    {
      id: 'vitrine',
      icon: Globe,
      title: t('servicesPage.servicesList.vitrine.title'),
      desc: t('servicesPage.servicesList.vitrine.desc'),
      features: t('servicesPage.servicesList.vitrine.features', { returnObjects: true }) as string[]
    },
    {
      id: 'restaurant',
      icon: UtensilsCrossed,
      title: t('servicesPage.servicesList.restaurant.title'),
      desc: t('servicesPage.servicesList.restaurant.desc'),
      features: t('servicesPage.servicesList.restaurant.features', { returnObjects: true }) as string[]
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: t('servicesPage.servicesList.ecommerce.title'),
      desc: t('servicesPage.servicesList.ecommerce.desc'),
      features: t('servicesPage.servicesList.ecommerce.features', { returnObjects: true }) as string[]
    },
    {
      id: 'webapp',
      icon: Zap,
      title: t('servicesPage.servicesList.webapp.title'),
      desc: t('servicesPage.servicesList.webapp.desc'),
      features: t('servicesPage.servicesList.webapp.features', { returnObjects: true }) as string[]
    },
    {
      id: 'maintenance',
      icon: Wrench,
      title: t('servicesPage.servicesList.maintenance.title'),
      desc: t('servicesPage.servicesList.maintenance.desc'),
      features: t('servicesPage.servicesList.maintenance.features', { returnObjects: true }) as string[]
    },
    {
      id: 'consulting',
      icon: Lightbulb,
      title: t('servicesPage.servicesList.consulting.title'),
      desc: t('servicesPage.servicesList.consulting.desc'),
      features: t('servicesPage.servicesList.consulting.features', { returnObjects: true }) as string[]
    }
  ];

  const processSteps = [
    {
      num: '01',
      title: t('servicesPage.process.step1.title'),
      desc: t('servicesPage.process.step1.desc')
    },
    {
      num: '02',
      title: t('servicesPage.process.step2.title'),
      desc: t('servicesPage.process.step2.desc')
    },
    {
      num: '03',
      title: t('servicesPage.process.step3.title'),
      desc: t('servicesPage.process.step3.desc')
    },
    {
      num: '04',
      title: t('servicesPage.process.step4.title'),
      desc: t('servicesPage.process.step4.desc')
    }
  ];

  return (
    <div className="w-full min-h-screen bg-neutral-50 pb-0">
      {/* Hero Section */}
      <section className="bg-primary-800 pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-primary-200 text-sm mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">{t('servicesPage.breadcrumb.home')}</Link>
            <span>→</span>
            <span className="text-white">{t('servicesPage.breadcrumb.services')}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-white mb-6"
          >
            {t('servicesPage.hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-100 max-w-2xl"
          >
            {t('servicesPage.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Services Cards */}
      <section className="py-20 px-4 md:px-6 bg-neutral-50">
        <div className="container mx-auto -mt-32 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={fadeInUp}>
                <Card className="h-full p-8 border-2 border-transparent hover:border-accent-500 transition-colors duration-300 flex flex-col group">
                  <div className="w-14 h-14 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-title font-bold text-primary-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-neutral-600 mb-8 flex-grow">
                    {service.desc}
                  </p>
                  <ul className="space-y-3">
                    {Array.isArray(service.features) && service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-accent-500 shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 md:px-6 bg-white overflow-hidden">
        <div className="container mx-auto">
          <SectionTitle title={t('servicesPage.process.title')} align="center" />
          
          <div className="mt-16 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-primary-100 -z-10"></div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex overflow-x-auto snap-x snap-mandatory pb-8 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 gap-6"
            >
              {processSteps.map((step, idx) => (
                <motion.div 
                  key={idx} 
                  variants={fadeInUp}
                  className="min-w-[280px] md:min-w-0 snap-center flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-primary-100 flex items-center justify-center text-3xl font-title font-bold text-accent-500 mb-6 group-hover:border-accent-500 transition-colors duration-300 shadow-sm relative z-10">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-primary-800 mb-3">{step.title}</h3>
                  <p className="text-neutral-600">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-800 to-accent-600 text-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-title font-bold text-white mb-6">
            {t('servicesPage.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            {t('servicesPage.cta.subtitle')}
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-primary-800 hover:bg-neutral-100 text-lg h-14 px-10 shadow-xl border-none">
              {t('servicesPage.cta.button')}
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
