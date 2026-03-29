import Link from 'next/link';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<string, string> = {
  primary: "bg-gray-900 text-white hover:bg-black focus:ring-gray-300",
  secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300",
  ghost: "text-gray-900 hover:bg-gray-100",
};

export default function Button({ children, href, variant = 'primary', className = "" }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <button className={cls}>{children}</button>;
}


