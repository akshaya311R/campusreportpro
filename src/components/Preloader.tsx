import React, { useRef, useState } from 'react';
import { Building2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function Preloader() {
  const container = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsDone(true)
    });

    // Animate progress bar filling up
    tl.to('.pre-bar', {
      width: '100%',
      duration: 1.5,
      ease: 'power2.inOut'
    })
    // Fade out and slide up the whole preloader
    .to(container.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power3.inOut'
    }, "+=0.2");
  }, { scope: container });

  if (isDone) return null;

  return (
    <div ref={container} className="fixed inset-0 z-[10000] bg-gradient-to-br from-[#f6f8ff] via-[#eef2ff] to-[#f0f3ff] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-[90px] h-[90px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-container/70 border-r-primary-container/20 animate-[spin_1.2s_linear_infinite]" />
          <div className="absolute inset-[10px] rounded-full border-2 border-transparent border-t-sky-500/60 border-l-sky-500/20 animate-[spin_0.9s_linear_infinite_reverse]" />
          <div className="absolute inset-[22px] rounded-full border-2 border-transparent border-b-tertiary/50 animate-[spin_1.6s_linear_infinite]" />
          
          <div className="relative z-10 w-[42px] h-[42px] bg-gradient-to-br from-[#39b8fd] to-primary-container rounded-xl grid place-items-center shadow-[0_6px_20px_rgba(37,99,235,0.35)] animate-[pulseGlow_2s_ease-in-out_infinite]">
            <Building2 className="text-white w-5 h-5" />
          </div>
        </div>
        
        <div className="font-serif italic text-[1.3rem] font-bold text-on-surface tracking-[-0.4px]">
          Campus<em className="text-primary-container not-italic">Report</em>
        </div>
        
        <div className="w-[160px] h-[3px] bg-primary-container/12 rounded-sm overflow-hidden">
          <div className="pre-bar h-full w-0 bg-gradient-to-r from-primary to-sky-500 rounded-sm shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
        </div>
        
        <div className="text-[0.72rem] font-semibold text-outline uppercase tracking-widest animate-[pulse_1.5s_ease-in-out_infinite]">
          Initialising platform...
        </div>
      </div>
    </div>
  );
}
