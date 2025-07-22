'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaTachometerAlt, FaThList, FaTrophy, FaCamera, FaBook, FaLayerGroup, FaSearch, FaUser, FaCog, FaSignOutAlt, FaTools, FaUsers, FaUpload } from 'react-icons/fa';
import { logout } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

const navSections = [
  {
    title: 'General',
    links: [
      { label: 'Dashboard', href: '/dashboard', icon: <FaTachometerAlt /> },
      { label: 'My Collection', href: '/collection', icon: <FaThList /> },
      { label: 'Achievements', href: '/achievements', icon: <FaTrophy /> },
      { label: 'Scan New Card', href: '/scan', icon: <FaCamera /> },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Explore', href: '/explore', icon: <FaSearch /> },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Profile', href: '/profile', icon: <FaUser /> },
      { label: 'Settings', href: '/settings', icon: <FaCog /> },
      { label: 'Logout', href: '/logout', icon: <FaSignOutAlt /> },
    ],
  },
  // Uncomment for admin section
  // {
  //   title: 'Admin Only',
  //   links: [
  //     { label: 'Admin Panel', href: '/admin', icon: <FaTools /> },
  //     { label: 'Manage Cards', href: '/admin/cards', icon: <FaBook /> },
  //     { label: 'Manage Users', href: '/admin/users', icon: <FaUsers /> },
  //     { label: 'Upload Card Image', href: '/admin/upload', icon: <FaUpload /> },
  //   ],
  // },
];

// Add adminOnly prop to Sidebar
interface SidebarProps {
  adminOnly?: boolean;
}

const adminSection = {
  title: 'Admin Only',
  links: [
    { label: 'Admin Panel', href: '/admin', icon: <FaTools /> },
    { label: 'Upload Card Image', href: '/admin/upload', icon: <FaUpload /> },
  ],
};

export default function Sidebar({ adminOnly }: SidebarProps) {
  const [open, setOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if logout fails
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      >
        {open ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>
      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-screen w-64 bg-purple-100/80 backdrop-blur-md text-gray-900 shadow-2xl z-40 flex flex-col p-4 lg:static lg:h-auto lg:w-64 lg:z-auto lg:shadow-2xl lg:translate-x-0 lg:opacity-100"
          >
            <div className="mb-8 flex justify-center">
              <img src="/images/logo2.png" alt="App Logo" className="w-30 h-30 object-contain" />
            </div>
            <nav className="flex-1 space-y-8">
              {(adminOnly ? [adminSection] : navSections.concat([adminSection])).map((section) => (
                <div key={section.title}>
                  <div className="text-xs font-semibold text-purple-400 uppercase mb-2 tracking-widest">
                    {section.title}
                  </div>
                  <ul className="space-y-1">
                    {section.links
                      .filter((link) => link.label !== 'Logout')
                      .map((link) => (
                        <motion.li
                          key={link.href}
                          whileHover={{ scale: 1.05, x: 8, backgroundColor: 'rgba(168,85,247,0.08)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="rounded-md"
                        >
                          <Link
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-purple-200/40 hover:text-purple-700 transition font-medium"
                          >
                            <span className="text-lg">{link.icon}</span>
                            <span>{link.label}</span>
                          </Link>
                        </motion.li>
                      ))}
                  </ul>
                </div>
              ))}
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <FaSignOutAlt /> Logout
                </>
              )}
            </button>
            </nav>
            <div className="mt-8 text-xs text-purple-300 text-center opacity-70 select-none">
              &copy; {new Date().getFullYear()} ScanCollect
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
} 