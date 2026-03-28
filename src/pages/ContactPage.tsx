import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Github, Linkedin, MessageCircle } from 'lucide-react';
import { useContact, ContactData } from '../hooks/useContact';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { fadeInUp, staggerContainer } from '../lib/animations';

export default function ContactPage() {
  const { t } = useTranslation();
  const { loading, success, error, sendMessage } = useContact();

  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactData>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateField = (name: keyof ContactData, value: string) => {
    let errorMsg = '';
    
    if (!value.trim()) {
      errorMsg = t('contactPage.validation.required');
    } else if (name === 'email' && !validateEmail(value)) {
      errorMsg = t('contactPage.validation.email');
    } else if (name === 'message' && value.trim().length < 20) {
      errorMsg = t('contactPage.validation.minLength');
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactData]) {
      validateField(name as keyof ContactData, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof ContactData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    const isSubjectValid = validateField('subject', formData.subject);
    const isMessageValid = validateField('message', formData.message);

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      await sendMessage(formData);
      if (!error) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 pb-20">
      {/* Hero Section */}
      <section className="bg-primary-800 pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-primary-200 text-sm mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">{t('contactPage.breadcrumb.home')}</Link>
            <span>→</span>
            <span className="text-white">{t('contactPage.breadcrumb.contact')}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-white mb-6"
          >
            {t('contactPage.hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-100 max-w-2xl"
          >
            {t('contactPage.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left Column - Contact Info */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full lg:w-5/12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-title font-bold text-primary-800 mb-4">
                {t('contactPage.info.title')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-600 mb-10 leading-relaxed">
                {t('contactPage.info.desc')}
              </motion.p>

              <div className="space-y-8 mb-10">
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">{t('contactPage.info.email')}</h3>
                    <a href="mailto:logonovaagency@gmail.com" className="text-lg font-medium text-primary-800 hover:text-accent-500 transition-colors">
                      logonovaagency@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">{t('contactPage.info.location')}</h3>
                    <p className="text-lg font-medium text-primary-800">
                      {t('contactPage.info.locationValue')}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">{t('contactPage.info.response')}</h3>
                    <p className="text-lg font-medium text-primary-800">
                      {t('contactPage.info.responseValue')}
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={fadeInUp} className="mb-10">
                <a 
                  href="https://wa.me/22872229856" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                >
                  <MessageCircle size={24} />
                  {t('contactPage.info.whatsapp')}
                </a>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">
                  <Github size={22} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">
                  <Linkedin size={22} />
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full lg:w-7/12"
            >
              <Card className="p-6 md:p-10 shadow-xl border-0">
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800"
                  >
                    <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
                    <p className="font-medium">{t('contactPage.form.success')}</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800"
                  >
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <div className="font-medium">
                      <p>{t('contactPage.form.error')}</p>
                      <p className="text-xs mt-1 opacity-70 font-mono">{error}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-bold text-neutral-700">
                        {t('contactPage.form.name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t('contactPage.form.namePlaceholder')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'} bg-neutral-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-opacity-20`}
                      />
                      {errors.name && <p className="text-red-500 text-xs font-medium mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-neutral-700">
                        {t('contactPage.form.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t('contactPage.form.emailPlaceholder')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'} bg-neutral-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-opacity-20`}
                      />
                      {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-bold text-neutral-700">
                      {t('contactPage.form.subject')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('contactPage.form.subjectPlaceholder')}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'} bg-neutral-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-opacity-20`}
                    />
                    {errors.subject && <p className="text-red-500 text-xs font-medium mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-bold text-neutral-700">
                      {t('contactPage.form.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('contactPage.form.messagePlaceholder')}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'} bg-neutral-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-opacity-20 resize-none`}
                    />
                    {errors.message && <p className="text-red-500 text-xs font-medium mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full h-14 text-lg flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        {t('contactPage.form.sending')}
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        {t('contactPage.form.submit')}
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
