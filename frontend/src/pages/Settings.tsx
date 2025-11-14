import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Palette, Save, Upload, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';
import { userApi } from '../api/userApi';

export const Settings = () => {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userApi.getProfile();
        if (response.success) {
          setProfileData({
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            avatar: response.data.avatar || '',
          });
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        // Fallback to user from context
        if (user) {
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: '',
            avatar: user.avatar || '',
          });
        }
      }
    };
    loadProfile();
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        try {
          setLoading(true);
          const response = await userApi.updateProfile({ avatar: base64String });
          
          if (response.success) {
            setProfileData({ ...profileData, avatar: base64String });
            
            // Update user in context
            if (setUser && response.data) {
              const updatedUser = {
                ...user!,
                name: response.data.name || user!.name,
                email: response.data.email || user!.email,
                avatar: base64String,
              };
              setUser(updatedUser);
              localStorage.setItem('fleettrack_user', JSON.stringify(updatedUser));
            }
            
            toast.success('Profile picture updated successfully!');
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to update profile picture');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error('Failed to process image');
      console.error(error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.updateProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      });

      if (response.success) {
        // Update user in context
        if (setUser && response.data) {
          const updatedUser = {
            ...user!,
            name: response.data.name || profileData.name,
            email: response.data.email || profileData.email,
            avatar: response.data.avatar || profileData.avatar || user!.avatar,
          };
          setUser(updatedUser);
          localStorage.setItem('fleettrack_user', JSON.stringify(updatedUser));
        }
        
        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.new.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.changePassword(passwordData.current, passwordData.new);
      
      if (response.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ current: '', new: '', confirm: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = profileData.avatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileData.name || user?.name || 'User')}`;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white mb-1">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="text-purple-600 dark:text-cyan-400" size={20} />
            <h3 className="text-gray-900 dark:text-white text-lg font-semibold">Profile Information</h3>
          </div>
          
          <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Avatar className="w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={displayAvatar} alt={profileData.name || user?.name} />
                <AvatarFallback className="bg-purple-500 text-white text-3xl">
                  {(profileData.name || user?.name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute bottom-0 right-0 bg-purple-600 dark:bg-cyan-400 rounded-full p-2 cursor-pointer hover:bg-purple-700 dark:hover:bg-cyan-500 transition-colors"
                onClick={handleAvatarClick}
              >
                <Camera size={16} className="text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="text-center">
              <h4 className="text-gray-900 dark:text-white mb-1">{profileData.name || user?.name}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.role || 'Admin'}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAvatarClick}
              disabled={loading}
            >
              <Upload className="mr-2" size={16} />
              Change Profile Picture
            </Button>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white"
              >
                <Save className="mr-2" size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-purple-600 dark:text-cyan-400" size={20} />
            <h3 className="text-gray-900 dark:text-white text-lg font-semibold">Change Password</h3>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input
                id="confirm"
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="text-purple-600 dark:text-cyan-400" size={20} />
            <h3 className="text-gray-900 dark:text-white text-lg font-semibold">Appearance Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Theme Mode</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Current theme: {theme === 'light' ? 'Light' : 'Dark'}
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  theme === 'light'
                    ? 'border-purple-600 dark:border-cyan-400'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="bg-white rounded-lg p-4 mb-2">
                  <div className="h-2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-100 rounded"></div>
                </div>
                <p className="text-gray-900 dark:text-white text-center font-medium">Light</p>
              </div>

              <div
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'border-purple-600 dark:border-cyan-400'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="bg-gray-900 rounded-lg p-4 mb-2">
                  <div className="h-2 bg-gray-700 rounded mb-2"></div>
                  <div className="h-2 bg-gray-800 rounded"></div>
                </div>
                <p className="text-gray-900 dark:text-white text-center font-medium">Dark</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
