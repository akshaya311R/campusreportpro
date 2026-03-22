import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Menu, X, LogOut, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2
    });
  }, { scope: navRef });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav ref={navRef} className={cn(
          "w-full max-w-6xl h-16 pointer-events-auto",
          "glass glass-pill flex items-center justify-between px-3 pr-5 transition-all duration-300",
          scrolled && "bg-white/82 shadow-[0_16px_50px_rgba(37,99,235,0.13)]"
        )}>
          <Link to="/" className="flex items-center gap-2 text-[1.05rem] font-extrabold text-on-surface px-2 py-1 rounded-full hover:opacity-80 transition-opacity group">
          <div className="w-9 h-9 bg-gradient-to-br from-[#39b8fd] to-primary-container rounded-[10px] grid place-items-center shadow-[0_3px_10px_rgba(37,99,235,0.28)] shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="font-serif italic hidden sm:inline">
            <em className="text-primary-container not-italic">Campus</em>Report
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" current={location.pathname}>Home</NavLink>
          {user ? (
            <>
              <NavLink to={user.isAdmin ? "/admin" : "/dashboard"} current={location.pathname}>Dashboard</NavLink>
              {!user.isAdmin && <NavLink to="/create-issue" current={location.pathname}>Report Issue</NavLink>}
            </>
          ) : (
            <NavLink to="/login" current={location.pathname}>Login</NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-surface-low py-1 pr-3 pl-1 rounded-full text-sm font-semibold border border-white/70">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-container rounded-full grid place-items-center text-[0.7rem] font-extrabold text-white">
                  {user.username[0].toUpperCase()}
                </div>
                {user.username}
              </div>
              <button onClick={handleLogout} className="text-sm font-semibold text-on-surface-var px-3 py-1.5 rounded-full hover:text-red hover:bg-red-bg transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/register" className="btn btn-primary btn-sm ml-1 bg-gradient-to-br from-primary-mid to-primary text-white px-4 py-1.5 rounded-full font-bold shadow-[0_4px_14px_rgba(0,74,198,0.28)] hover:-translate-y-0.5 transition-all">
              Get Started
            </Link>
          )}
        </div>

        <button className="md:hidden p-2 rounded-xl bg-white/50 border border-white/80" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0d1a2e]/45 backdrop-blur-sm flex justify-end" onClick={() => setMobileOpen(false)}>
          <div className="w-[280px] h-full bg-[#f8faff]/97 backdrop-blur-xl pt-24 px-5 pb-8 flex flex-col gap-1 border-l border-white/85 shadow-[-20px_0_60px_rgba(37,99,235,0.08)]" onClick={e => e.stopPropagation()}>
            <MobLink to="/" icon={<Building2 className="w-4 h-4" />}>Home</MobLink>
            {user ? (
              <>
                <MobLink to={user.isAdmin ? "/admin" : "/dashboard"} icon={<Building2 className="w-4 h-4" />}>Dashboard</MobLink>
                {!user.isAdmin && <MobLink to="/create-issue" icon={<Edit className="w-4 h-4" />}>Report Issue</MobLink>}
                <div className="h-px bg-outline-var/35 my-2" />
                <button onClick={handleLogout} className="flex items-center gap-2 text-on-surface-var font-semibold text-sm p-3 rounded-xl hover:bg-red-bg hover:text-red transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" /> Sign out ({user.username})
                </button>
              </>
            ) : (
              <>
                <MobLink to="/login" icon={<Building2 className="w-4 h-4" />}>Login</MobLink>
                <MobLink to="/register" icon={<Building2 className="w-4 h-4" />}>Create Account</MobLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, current, children }: { to: string, current: string, children: React.ReactNode }) {
  const isActive = current === to;
  return (
    <Link to={to} className={cn(
      "relative text-[0.855rem] font-semibold px-3.5 py-1.5 rounded-full transition-colors",
      isActive ? "text-primary-container bg-primary-ghost font-bold" : "text-on-surface-var hover:text-primary-container hover:bg-primary-ghost"
    )}>
      {children}
    </Link>
  );
}

function MobLink({ to, icon, children }: { to: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 text-on-surface-var font-semibold text-sm p-3 rounded-xl hover:bg-primary-ghost hover:text-primary-container hover:border-white/60 border border-transparent transition-all">
      {icon}
      {children}
    </Link>
  );
}
