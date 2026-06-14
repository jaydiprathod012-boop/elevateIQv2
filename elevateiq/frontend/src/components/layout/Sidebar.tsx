import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, BrainCircuit, FolderKanban, Map, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/store/auth.context';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard',   href: '/dashboard', icon: LayoutDashboard, color: 'text-purple-400' },
  { label: 'Resume',      href: '/resume',    icon: FileText,         color: 'text-cyan-400'   },
  { label: 'AI Analysis', href: '/analysis',  icon: BrainCircuit,     color: 'text-pink-400'   },
  { label: 'Projects',    href: '/projects',  icon: FolderKanban,     color: 'text-green-400'  },
  { label: 'Roadmap',     href: '/roadmap',   icon: Map,              color: 'text-yellow-400' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-purple-500/20">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 gradient-neon rounded-xl flex items-center justify-center neon-glow-purple">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight gradient-neon-text">ElevateIQ</span>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Build Smarter. Grow Faster.</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-purple-500/15 border border-purple-500/30 text-white neon-border-purple'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent'
              )}>
              <Icon className={cn("w-4 h-4 shrink-0", active ? item.color : '')} />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-purple-500/20">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/60 border border-purple-500/20">
          <div className="w-8 h-8 rounded-full gradient-neon flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-red-400 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-62 border-r border-purple-500/20 bg-card h-screen sticky top-0 w-[240px]">
        <SidebarContent />
      </aside>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-purple-500/30 rounded-lg shadow-lg" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}
      <motion.aside initial={{ x: '-100%' }} animate={{ x: mobileOpen ? 0 : '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 z-50 w-64 h-full bg-card border-r border-purple-500/20 shadow-2xl">
        <SidebarContent />
      </motion.aside>
    </>
  );
}
