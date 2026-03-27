import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FolderOpen, Star, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const { signOut } = useAuth();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Messages', badge: 3 }, // Placeholder badge
    { to: '/admin/realisations', icon: FolderOpen, label: 'Réalisations' },
    { to: '/admin/avis', icon: Star, label: 'Avis' },
    { to: '/admin/stats', icon: BarChart2, label: 'Statistiques' },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-neutral-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100 flex flex-col items-center">
        <img
          src="/src/assets/logo.png"
          alt="Logonova"
          className="h-12 w-auto object-contain mb-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/logo/150/48';
          }}
        />
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Administration
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-white' : 'text-neutral-500'} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-accent-600' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
            EJ
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-neutral-900 truncate">Elias Josué</p>
            <p className="text-xs text-neutral-500 truncate">logonovaagency@gmail.com</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-neutral-600 font-medium hover:bg-red-50 hover:text-red-600 transition-colors group"
        >
          <LogOut size={20} className="text-neutral-400 group-hover:text-red-500 transition-colors" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
