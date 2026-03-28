import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Spinner } from './ui/Spinner';

export default function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <img
          src="https://i.postimg.cc/qqLVtrdx/logo-(1).png"
          alt="Logonova"
          className="h-[80px] w-auto object-contain mb-8"
          referrerPolicy="no-referrer"
        />
        <Spinner size="lg" className="text-primary-600 mb-4" />
        <p className="text-neutral-500 font-medium tracking-wide">
          {t('common.loading', { defaultValue: 'Chargement...' })}
        </p>
      </motion.div>
    </div>
  );
}
