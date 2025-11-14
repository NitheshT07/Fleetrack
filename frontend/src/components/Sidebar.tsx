import { motion } from 'motion/react';
import { LayoutDashboard, Truck, Receipt, DollarSign, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { icon: Truck, label: 'Vehicles', page: 'vehicles' },
    { icon: Receipt, label: 'Expenses', page: 'expenses' },
    { icon: DollarSign, label: 'Revenue', page: 'revenue' },
    { icon: FileText, label: 'Reports', page: 'reports' },
    { icon: Settings, label: 'Settings', page: 'settings' }
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-70 bg-white dark:bg-[#0f1018] border-r border-gray-200 dark:border-white/[0.08] flex flex-col shadow-lg z-50"
    >
      <div className="p-6 border-b border-gray-200 dark:border-white/[0.08]">
        <h1 className="text-purple-600 dark:text-[#10d9b4]">FleetTrack Pro</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.page;
          
          return (
            <motion.button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 dark:from-[#10d9b4] dark:to-[#0dd9b4] text-white shadow-lg dark:shadow-[0_0_20px_rgba(16,217,180,0.3)]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e1f2e]'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/[0.08]">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-[#ef4464] hover:bg-red-50 dark:hover:bg-[#ef4464]/10 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};
