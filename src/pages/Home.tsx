import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Edit, BarChart, Verified, Lock, AlertTriangle, Camera, Lightbulb, Search, CheckCircle2, UserPlus } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero entrance animation
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.from('.hero-eyebrow', { opacity: 0, y: 20, scale: 0.95, duration: 0.8 })
      .from('.hero-text-line', { yPercent: 100, rotate: 2, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.6")
      .from('.hero-sub', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
      .from('.hero-cta', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
      .from('.hero-trust', { opacity: 0, duration: 0.8 }, "-=0.4");

    // Section Titles Reveal
    gsap.utils.toArray('.animated-title').forEach((el: any) => {
      const lines = el.querySelectorAll('.title-line');
      gsap.from(lines, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        yPercent: 100,
        rotate: 2,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out'
      });
    });

    // Subtle background pulse
    gsap.to('.hero-bg-gradient', {
      scale: 1.05,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Scroll reveal animations
    gsap.utils.toArray('.sr').forEach((el: any) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 28 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out'
        }
      );
    });
    
    // Staggered feature cards
    gsap.fromTo('.feature-card', 
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      }
    );

    // Staggered steps
    gsap.fromTo('.step-item', 
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: '.steps-grid',
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(1.2)'
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className="w-full">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-64px-12px-2rem)] flex items-center justify-center text-center px-6 pt-16 pb-20 overflow-hidden -mt-9">
        <div className="hero-bg-gradient absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(37,99,235,0.10)_0%,transparent_55%),radial-gradient(ellipse_50%_40%_at_85%_80%,rgba(14,165,233,0.07)_0%,transparent_50%),radial-gradient(ellipse_40%_35%_at_10%_70%,rgba(99,46,205,0.06)_0%,transparent_50%)] origin-center" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_20%,transparent_80%)]" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="hero-eyebrow inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-[0.7rem] font-extrabold text-primary-container uppercase tracking-widest mb-7 shadow-[0_4px_16px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-green-600" />
            </span>
            Live Campus Reporting System
          </div>
          
          <h1 className="font-serif text-[clamp(3rem,7.5vw,5rem)] font-bold italic leading-[1.05] tracking-[-2px] text-on-surface mb-6">
            <span className="block overflow-hidden pb-1"><span className="hero-text-line block origin-left">Make Your Campus</span></span>
            <span className="block overflow-hidden pb-2"><span className="hero-text-line block origin-left bg-gradient-to-br from-[#1a5cd8] via-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">Truly Better</span></span>
          </h1>
          
          <p className="hero-sub text-[1.15rem] text-on-surface-var leading-[1.78] max-w-xl mx-auto mb-10">
            Report issues, track resolutions, and hold the administration accountable. Your voice shapes the campus experience for everyone.
          </p>
          
          <div className="hero-cta flex gap-4 flex-wrap justify-center mb-14">
            <Link to="/register" className="btn btn-primary btn-xl flex items-center gap-2 bg-gradient-to-br from-primary-mid to-primary text-white px-9 h-[52px] rounded-xl font-bold shadow-[0_4px_14px_rgba(0,74,198,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_8px_24px_rgba(0,74,198,0.38)] hover:-translate-y-[1.5px] transition-all">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/dashboard" className="btn btn-ghost btn-xl glass glass-sm flex items-center gap-2 px-9 h-[52px] font-bold text-on-surface-var hover:text-on-surface hover:bg-white/90 transition-all border border-white/85">
              View Dashboard
            </Link>
          </div>
          
          <div className="hero-trust flex flex-wrap justify-center gap-x-7 gap-y-2 opacity-75">
            {['Anonymous Reporting', 'Real-Time Tracking', 'Photo Evidence', 'Admin Accountability'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-on-surface-var">
                <CheckCircle className="w-4 h-4 text-green-600" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="sr px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-[1.75rem] overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.02),0_16px_48px_rgba(37,99,235,0.09),inset_0_1px_0_rgba(255,255,255,0.9)]">
          {[
            { n: '1200', s: '+', l: 'Reports Filed' },
            { n: '94', s: '%', l: 'Resolution Rate' },
            { n: '48', s: 'h', l: 'Avg Response Time' },
            { n: '6', s: '', l: 'Departments Served' }
          ].map((s, i) => (
            <div key={i} className="glass p-8 text-center relative border-r border-white/60 last:border-0 hover:bg-white/80 transition-colors">
              <div className="text-[2.4rem] font-extrabold text-on-surface tracking-[-2px] leading-none mb-1 tabular-nums">
                <span className="text-primary-container">{s.n}</span>{s.s}
              </div>
              <div className="text-[0.8rem] font-semibold text-outline uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pt-16 pb-8 px-6 max-w-6xl mx-auto">
        <div className="sr text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-extrabold text-primary-container uppercase tracking-widest bg-primary-ghost px-3.5 py-1.5 rounded-full mb-4 border border-primary-container/10">
            <Verified className="w-3.5 h-3.5" /> Everything you need
          </div>
          <h2 className="animated-title font-serif italic text-[clamp(1.9rem,4vw,2.75rem)] font-bold text-on-surface tracking-[-1px] leading-[1.12] mb-3">
            <span className="block overflow-hidden pb-1"><span className="title-line block origin-left">A complete platform for</span></span>
            <span className="block overflow-hidden pb-1"><span className="title-line block origin-left">campus issue management</span></span>
          </h2>
          <p className="text-base text-on-surface-var max-w-lg mx-auto leading-relaxed">
            From quick submission to admin resolution — every step is designed to be effortless and transparent.
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { c: 'border-primary-container', bg: 'bg-primary-container/10', text: 'text-primary-container', icon: Edit, tag: 'Report', title: 'Submit in 60 seconds', desc: 'Snap a photo, tag the location, and describe the issue. Routing to the right department happens automatically.' },
            { c: 'border-amber-600', bg: 'bg-amber-600/10', text: 'text-amber-600', icon: BarChart, tag: 'Track', title: 'Live status updates', desc: 'Stay informed as your report moves from Pending to Resolved. Real-time transparency at every step.' },
            { c: 'border-green-600', bg: 'bg-green-600/10', text: 'text-green-600', icon: CheckCircle2, tag: 'Resolve', title: 'Real accountability', desc: 'Hold departments accountable with transparent resolution timelines and public metrics.' },
            { c: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-500', icon: Lock, tag: 'Privacy', title: 'Confidential reporting', desc: 'Mark sensitive reports as confidential. Only administrators can view them — your identity stays protected.' },
            { c: 'border-red-600', bg: 'bg-red-600/10', text: 'text-red-600', icon: AlertTriangle, tag: 'Priority', title: 'Urgency levels', desc: 'Flag issues as Low, Medium, or Urgent. Critical safety concerns get immediate attention they deserve.' },
            { c: 'border-sky-600', bg: 'bg-sky-600/10', text: 'text-sky-600', icon: Camera, tag: 'Evidence', title: 'Photo proof upload', desc: 'Attach photographic evidence to your reports. A single photo speeds up resolution by hours.' }
          ].map((f, i) => (
            <div key={i} className={`feature-card glass glass-lg p-8 relative overflow-hidden border-l-4 ${f.c} hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-300 group`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className={`w-12 h-12 rounded-2xl grid place-items-center mb-5 ${f.bg} ${f.text} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                <f.icon className="w-6 h-6" />
              </div>
              <span className={`text-[0.7rem] font-extrabold tracking-widest uppercase block mb-2 ${f.text}`}>{f.tag}</span>
              <h3 className="font-serif italic text-[1.2rem] font-bold text-on-surface mb-2 leading-tight">{f.title}</h3>
              <p className="text-[0.845rem] text-on-surface-var leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="pt-8 pb-20 px-6 bg-gradient-to-b from-transparent via-surface-container/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="sr text-center mb-14">
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-extrabold text-primary-container uppercase tracking-widest bg-primary-ghost px-3.5 py-1.5 rounded-full mb-4 border border-primary-container/10">
              <Lightbulb className="w-3.5 h-3.5" /> How it works
            </div>
            <h2 className="animated-title font-serif italic text-[clamp(1.9rem,4vw,2.75rem)] font-bold text-on-surface tracking-[-1px] leading-[1.12] mb-3">
              <span className="block overflow-hidden pb-1"><span className="title-line block origin-left">Three steps to resolution</span></span>
            </h2>
            <p className="text-base text-on-surface-var max-w-lg mx-auto leading-relaxed">
              The simplest campus reporting workflow ever designed. No forms, no confusion.
            </p>
          </div>

          <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 relative">
            <div className="hidden md:block absolute top-[42px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-container via-sky-500 to-green-500 opacity-30 z-0" />
            {[
              { n: 1, icon: Edit, color: 'text-primary-container', title: 'Submit your report', desc: 'Fill in the title, location, category, and description. Attach a photo. Mark as confidential if needed. Done in under a minute.' },
              { n: 2, icon: Search, color: 'text-amber-600', title: 'Admin reviews it', desc: 'Our admin team receives your report instantly, reviews the evidence, and assigns it to the right department for action.' },
              { n: 3, icon: CheckCircle2, color: 'text-green-600', title: 'Issue gets resolved', desc: 'You receive a status update and admin note when the issue progresses. Full transparency from start to finish.' }
            ].map((s, i) => (
              <div key={i} className="step-item flex flex-col items-center text-center px-6 relative z-10 group">
                <div className="relative mb-6">
                  <div className="w-[86px] h-[86px] rounded-full border-2 border-primary-container/15 grid place-items-center transition-all duration-300 group-hover:border-primary-container group-hover:scale-105">
                    <div className="w-[68px] h-[68px] rounded-full bg-white shadow-[0_4px_20px_rgba(37,99,235,0.14)] grid place-items-center">
                      <s.icon className={`w-7 h-7 ${s.color}`} />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-container text-white text-[0.65rem] font-extrabold grid place-items-center shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
                    {s.n}
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-on-surface mb-2">{s.title}</h3>
                <p className="text-[0.845rem] text-on-surface-var leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="sr my-20 mx-6 rounded-[2rem] overflow-hidden relative bg-gradient-to-br from-[#0d1f4e] via-[#1a3a7c] to-[#0c2340] p-16 text-center shadow-[0_40px_80px_rgba(13,31,78,0.25)] max-w-6xl md:mx-auto">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full -top-[100px] -left-[80px] bg-[radial-gradient(circle,rgba(37,99,235,0.3)_0%,transparent_65%)] blur-[70px] pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] rounded-full -bottom-[80px] -right-[60px] bg-[radial-gradient(circle,rgba(14,165,233,0.25)_0%,transparent_65%)] blur-[70px] pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-[0.7rem] font-extrabold tracking-widest uppercase text-white/55 mb-4">Join today — it's free</p>
          <h2 className="animated-title font-serif italic text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-white tracking-[-1px] leading-[1.15] mb-4">
            <span className="block overflow-hidden pb-1"><span className="title-line block origin-left">Your campus is waiting</span></span>
            <span className="block overflow-hidden pb-1"><span className="title-line block origin-left">for your voice</span></span>
          </h2>
          <p className="text-base text-white/60 max-w-md mx-auto mb-10 leading-relaxed">
            Every report you file makes the campus safer and better for every student that comes after you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn bg-white text-primary px-8 h-12 rounded-xl font-bold shadow-[0_8px_24px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.22)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Create Free Account
            </Link>
            <Link to="/login" className="btn bg-transparent text-white/85 border-2 border-white/25 px-8 h-12 rounded-xl font-bold hover:bg-white/10 hover:border-white/45 transition-all flex items-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
