import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NotificationDropdown } from './NotificationDropdown';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-[#0a0b14] border-b border-gray-200 dark:border-white/[0.08] flex items-center justify-between px-6 shadow-sm">
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1f2e] transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="text-gray-700 dark:text-gray-300" size={20} />
          ) : (
            <Sun className="text-gray-300" size={20} />
          )}
        </motion.button>

        <NotificationDropdown />

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/[0.08]">
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-purple-500 dark:bg-[#10d9b4] text-white dark:text-[#0a0b14]">
              {user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-gray-500 dark:text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
