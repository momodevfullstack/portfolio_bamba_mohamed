type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeader({ eyebrow, title, subtitle, align = 'center', className = "" }: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-3 ${alignment} ${className}`}>
      {eyebrow && (
        <span className="inline-flex h-6 items-center rounded-full border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}


