import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(footerRef.current, 
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }
    );
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="py-12 px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-6 text-center sm:text-left">
        <div>
          <p className="font-serif italic text-[1.1rem] font-bold text-on-surface mb-1">CampusReport</p>
          <p className="text-sm text-outline">© 2026 CampusReport. Built for the Academic Luminary.</p>
        </div>
        <div className="flex gap-7 flex-wrap justify-center">
          <a href="#" className="text-[0.85rem] font-semibold text-outline hover:text-primary-container transition-colors">Terms</a>
          <a href="#" className="text-[0.85rem] font-semibold text-outline hover:text-primary-container transition-colors">Privacy</a>
          <a href="#" className="text-[0.85rem] font-semibold text-outline hover:text-primary-container transition-colors">Support</a>
          <a href="#" className="text-[0.85rem] font-semibold text-outline hover:text-primary-container transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
