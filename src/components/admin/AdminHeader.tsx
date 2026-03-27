import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="md:hidden bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 shadow-sm sticky top-0 z-30">
      <img
        src="/src/assets/logo.png"
        alt="Logonova"
        className="h-8 w-auto object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/logo/100/32';
        }}
      />
      <button
        onClick={onMenuClick}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
