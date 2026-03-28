import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../lib/animations';

export default function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/realisations', label: t('nav.realisations', { defaultValue: t('nav.projects') }) },
    { path: '/a-propos', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-primary-500 text-white pt-16 pb-8">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="container mx-auto px-4 md:px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          {/* Colonne 1 - Identité */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center md:items-start">
            <Link to="/" className="mb-6 inline-block">
              <img 
                src="https://i.postimg.cc/qqLVtrdx/logo-(1).png" 
                alt="Logonova" 
                className="h-12 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </Link>
            <h3 className="text-xl font-bold mb-2">Elias Josué Kossi</h3>
            <p className="text-primary-200 font-medium mb-4">{t('footer.title')}</p>
            <p className="text-primary-100/80 text-sm leading-relaxed max-w-xs">
              {t('footer.catchphrase')}
            </p>
          </motion.div>

          {/* Colonne 2 - Navigation */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-title font-semibold mb-6 text-white uppercase tracking-wider">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-primary-100/80 hover:text-accent-500 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Colonne 3 - Contact */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-title font-semibold mb-6 text-white uppercase tracking-wider">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-primary-100/80">
                <Mail size={18} className="text-accent-500" />
                <a href="mailto:logonovaagency@gmail.com" className="hover:text-accent-500 transition-colors">
                  logonovaagency@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-primary-100/80">
                <MapPin size={18} className="text-accent-500" />
                <span>Lomé, Togo</span>
              </li>
            </ul>
            
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white hover:bg-accent-500 hover:-translate-y-1 transition-all duration-300">
                <Github size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white hover:bg-accent-500 hover:-translate-y-1 transition-all duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white hover:bg-accent-500 hover:-translate-y-1 transition-all duration-300">
                <MessageCircle size={20} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Barre du bas */}
        <motion.div 
          variants={fadeInUp}
          className="pt-8 border-t border-primary-400/30 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-200"
        >
          <p>{t('footer.copyright')}</p>
          <p>
            {t('footer.poweredBy')}{' '}
            <a 
              href="https://logonova.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white font-medium hover:text-accent-500 transition-colors"
            >
              Logonova Agency
            </a>
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
