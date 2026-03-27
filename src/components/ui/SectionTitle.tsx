import { motion } from 'framer-motion';
import { fadeInUp } from '../../lib/animations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  lineColor?: 'primary' | 'accent';
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = 'left',
  lineColor = 'primary',
  className
}: SectionTitleProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "mb-12",
        align === 'center' ? "text-center flex flex-col items-center" : "text-left",
        className
      )}
    >
      {subtitle && (
        <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-2 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-title font-bold text-neutral-900 mb-4">
        {title}
      </h2>
      <div
        className={cn(
          "h-1.5 w-20 rounded-full",
          lineColor === 'primary' ? "bg-primary-600" : "bg-accent-500"
        )}
      />
    </motion.div>
  );
}
