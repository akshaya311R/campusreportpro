import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff, Unlock, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setSuccess(false);
    setLoading(true);
    
    try {
      const email = `${username.toLowerCase()}@campusreport.com`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
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
              <Key className="text-white w-6 h-6" />
            </div>
            <h1 className="text-[1.65rem] font-extrabold text-on-surface tracking-[-0.5px] mb-1">Reset password</h1>
            <p className="text-[0.9rem] text-on-surface-var">Enter your username to receive a reset link.</p>
          </div>

          {error && (
            <div className="bg-red-bg border border-red-bdr text-red-700 p-3 rounded-xl text-[0.84rem] font-medium flex items-start gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-bg border border-green-bdr text-green-700 p-3 rounded-xl text-[0.84rem] font-medium flex items-start gap-2 mb-4">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> Password reset instructions have been sent to your registered email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[0.78rem] font-bold uppercase tracking-wider text-on-surface-var mb-2">Username</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Your username" className="w-full bg-white border-2 border-outline-var rounded-xl p-3.5 text-[0.9rem] text-on-surface outline-none focus:border-primary-container focus:shadow-[0_0_0_4px_rgba(37,99,235,0.07)] transition-all" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full h-12 rounded-xl mt-2 flex items-center justify-center gap-2 bg-gradient-to-br from-primary-mid to-primary text-white font-bold shadow-[0_4px_14px_rgba(0,74,198,0.28)] hover:shadow-[0_8px_24px_rgba(0,74,198,0.38)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
              <Unlock className="w-5 h-5" /> {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-on-surface-var/10" />
            <span className="text-[0.75rem] text-outline font-semibold">or</span>
            <div className="flex-1 h-px bg-on-surface-var/10" />
          </div>

          <div className="text-center text-[0.875rem] text-on-surface-var">
            <Link to="/login" className="text-primary-container font-bold hover:underline">Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
