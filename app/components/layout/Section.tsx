
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  id, 
  className = "", 
  title, 
  subtitle,
  centered = false 
}) => {
  return (
    <section id={id} className={`py-20 md:py-32 px-6 ${className}`}>
      <div className="container mx-auto">
        {(title || subtitle) && (
          <div className={`mb-16 max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
            {subtitle && (
              <span className="text-indigo-600 dark:text-indigo-300 font-semibold uppercase tracking-widest text-sm mb-3 block">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-5xl font-bold font-serif-title leading-tight text-slate-900 dark:text-slate-50">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
