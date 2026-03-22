import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, LogIn, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function Login() {
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      y: 14,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, { scope: container });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Check if the identifier is an email
      const isEmail = identifier.includes('@');
      
      // If it's not an email, append a dummy domain for Supabase Auth
      const email = isEmail ? identifier.toLowerCase() : `${identifier.toLowerCase()}@campusreport.com`;
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        // Auto-create admin if it's the default admin credentials
        if (identifier.toLowerCase() === 'admin' && password === 'adminpassword123') {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username: 'admin', role: 'staff', isAdmin: true } }
          });
          
          if (signUpError) {
            setError('Invalid credentials. Please try again.');
            setLoading(false);
            return;
          }
        } else {
          setError('Invalid credentials. Please try again.');
          setLoading(false);
          return;
        }
      }

      await refreshUser();
      
      // Get isAdmin from user metadata, or default to true if we just created the admin account
      const isAdmin = data?.user?.user_metadata?.isAdmin || (identifier.toLowerCase() === 'admin');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px-12px-5rem)] p-4">
      <div ref={container} className="glass glass-xl w-full max-w-[440px] p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-tertiary/10 rounded-full blur-[40px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl mx-auto mb-5 bg-gradient-to-br from-[#39b8fd] to-primary-container grid place-items-center shadow-[0_8px_20px_rgba(37,99,235,0.28)]">
              <Building2 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-[1.65rem] font-extrabold text-on-surface tracking-[-0.5px] mb-1">Welcome back</h1>
            <p className="text-[0.9rem] text-on-surface-var">The <em className="font-serif italic text-primary-container">Academic Luminary</em> awaits your insight.</p>
          </div>

          <div className="flex gap-1 p-1 bg-surface-low rounded-full mb-6">
            <button type="button" onClick={() => { setRole('student'); setIdentifier(''); setPassword(''); }} className={`flex-1 py-2 rounded-full text-[0.85rem] font-bold transition-all ${role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-var hover:bg-white/50'}`}>Student</button>
            <button type="button" onClick={() => { setRole('staff'); setIdentifier('admin'); setPassword(''); }} className={`flex-1 py-2 rounded-full text-[0.85rem] font-bold transition-all ${role === 'staff' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-var hover:bg-white/50'}`}>Staff</button>
          </div>

          {error && (
            <div className="bg-red-bg border border-red-bdr text-red-700 p-3 rounded-xl text-[0.84rem] font-medium flex items-start gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="flex justify-between items-center text-[0.78rem] font-bold uppercase tracking-wider text-on-surface-var mb-2">
                {role === 'student' ? 'Email ID / PRN' : 'Staff ID / Email ID'}
              </label>
              <input type="text" required value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder={role === 'student' ? 'Your Email ID or PRN' : 'Your Staff ID or Email ID'} className="w-full bg-white border-2 border-outline-var rounded-xl p-3.5 text-[0.9rem] text-on-surface outline-none focus:border-primary-container focus:shadow-[0_0_0_4px_rgba(37,99,235,0.07)] transition-all" />
              <p className="text-[0.75rem] text-outline mt-1.5">
                {role === 'student' ? 'Use your Email ID or PRN (students)' : 'Use your Staff ID or Email ID (staff)'}
              </p>
            </div>
            <div>
              <label className="flex justify-between items-center text-[0.78rem] font-bold uppercase tracking-wider text-on-surface-var mb-2">
                Password
                <Link to="/forgot-password" className="text-[0.75rem] text-primary-container normal-case tracking-normal hover:underline">Forgot password?</Link>
              </label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border-2 border-outline-var rounded-xl p-3.5 text-[0.9rem] text-on-surface outline-none focus:border-primary-container focus:shadow-[0_0_0_4px_rgba(37,99,235,0.07)] transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary-container p-1">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full h-12 rounded-xl mt-2 flex items-center justify-center gap-2 bg-gradient-to-br from-primary-mid to-primary text-white font-bold shadow-[0_4px_14px_rgba(0,74,198,0.28)] hover:shadow-[0_8px_24px_rgba(0,74,198,0.38)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
              <LogIn className="w-5 h-5" /> {loading ? 'Signing in...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-on-surface-var/10" />
            <span className="text-[0.75rem] text-outline font-semibold">or</span>
            <div className="flex-1 h-px bg-on-surface-var/10" />
          </div>

          <div className="text-center text-[0.875rem] text-on-surface-var">
            New to the portal? <Link to="/register" className="text-primary-container font-bold hover:underline">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
