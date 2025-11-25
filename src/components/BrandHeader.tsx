import React from 'react';

type BrandHeaderProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  badge?: React.ReactNode;
};

export function BrandHeader({
  title,
  subtitle,
  align = 'center',
  badge,
}: BrandHeaderProps) {
  return (
    <header
      className={`brand-header ${align === 'left' ? 'brand-header--left' : ''}`}
    >
      <div className="brand-header__copy">
        {typeof title === 'string' ? (
          <h1>{title}</h1>
        ) : (
          title
        )}
        {subtitle && (
          <p>
            {subtitle}
          </p>
        )}
      </div>

      {badge && <span className="brand-header__badge">{badge}</span>}
    </header>
  );
}

