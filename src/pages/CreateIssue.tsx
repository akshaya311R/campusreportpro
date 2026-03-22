import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit, MapPin, Camera, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function CreateIssue() {
  const [title, setTitle] = useState('');
  const [loc, setLoc] = useState('');
  const [cat, setCat] = useState('Infrastructure');
  const [desc, setDesc] = useState('');
  const [prio, setPrio] = useState<'Low' | 'Medium' | 'Urgent'>('Medium');
  const [conf, setConf] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, { scope: container });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) return alert('Only image files are allowed');
    if (selectedFile.size > 5242880) return alert('File too large — max 5MB');
    
    setFile(selectedFile);
    setFileName(selectedFile.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImg(ev.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      let imageUrl = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('issue-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('issue-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('issues')
        .insert([{
          title,
          loc,
          cat,
          description: desc,
          prio,
          conf,
          img: imageUrl,
          status: 'Pending',
          note: '',
          ts: new Date().toISOString(),
          uid: user.id,
          uname: user.username
        }]);

      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating issue:', err);
      alert('Failed to create issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={container} className="max-w-[780px] mx-auto px-6">
      <div className="glass glass-xl p-10 md:p-11">
        <div className="flex items-start gap-5 mb-8">
          <div className="w-14 h-14 rounded-[18px] shrink-0 bg-primary-container/10 grid place-items-center">
            <Edit className="w-7 h-7 text-primary-container" />
          </div>
          <div>
            <h1 className="font-serif italic text-[2.25rem] font-bold text-on-surface tracking-[-1px] leading-[1.1]">Report an Issue</h1>
            <p className="text-on-surface-var text-[0.95rem] mt-1">All reports are reviewed by the administration team.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="h-px bg-white/50 my-7" />
          <div className="text-[0.72rem] font-extrabold uppercase tracking-widest text-primary/65 mb-4">Issue Details</div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="flex items-center gap-1 text-[0.75rem] font-bold uppercase tracking-widest text-primary/70 mb-1.5">
                Issue Title <span className="text-red-600">*</span>
              </label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Broken window in Library Block B" maxLength={200} className="w-full bg-surface-lowest border-none rounded-xl p-4 text-[0.9rem] text-on-surface outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12),0_2px_8px_rgba(0,0,0,0.04)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all" />
              <p className="text-[0.75rem] text-outline mt-1">Be concise and specific to help locate the problem faster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-[0.75rem] font-bold uppercase tracking-widest text-primary/70 mb-1.5">
                  Location <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                  <input type="text" required value={loc} onChange={e => setLoc(e.target.value)} placeholder="Building / Room number" className="w-full bg-surface-lowest border-none rounded-xl p-4 pl-11 text-[0.9rem] text-on-surface outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12),0_2px_8px_rgba(0,0,0,0.04)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1 text-[0.75rem] font-bold uppercase tracking-widest text-primary/70 mb-1.5">
                  Category
                </label>
                <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-surface-lowest border-none rounded-xl p-4 text-[0.9rem] text-on-surface outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12),0_2px_8px_rgba(0,0,0,0.04)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all appearance-none cursor-pointer">
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Safety">Safety</option>
                  <option value="Discipline">Discipline</option>
                  <option value="Academic">Academic</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-[0.75rem] font-bold uppercase tracking-widest text-primary/70 mb-1.5">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={5} placeholder="Describe the issue in detail — what happened, when, severity, context..." className="w-full bg-surface-lowest border-none rounded-xl p-4 text-[0.9rem] text-on-surface outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12),0_2px_8px_rgba(0,0,0,0.04)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all resize-y min-h-[120px]" />
            </div>
          </div>

          <div className="h-px bg-white/50 my-7" />
          <div className="text-[0.72rem] font-extrabold uppercase tracking-widest text-primary/65 mb-4">Priority Level</div>
          <div className="flex gap-3 flex-wrap">
            {['Low', 'Medium', 'Urgent'].map(p => (
              <button key={p} type="button" onClick={() => setPrio(p as any)} className={`px-8 py-2.5 rounded-full font-bold text-[0.875rem] border-2 transition-all ${prio === p ? (p === 'Low' ? 'bg-green-bg text-green-600 border-green-bdr' : p === 'Medium' ? 'bg-primary-ghost text-primary border-primary/30 shadow-[0_4px_14px_rgba(0,74,198,0.14)] scale-105' : 'bg-red-bg text-red-600 border-red-bdr') : 'bg-surface-low text-on-surface-var border-outline-var hover:bg-surface-container'}`}>
                {p}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/50 my-7" />
          <div className="text-[0.72rem] font-extrabold uppercase tracking-widest text-primary/65 mb-4">Evidence Photo</div>
          <div className="relative border-2 border-dashed border-primary/25 rounded-3xl p-10 text-center cursor-pointer bg-primary/5 hover:bg-primary/10 hover:border-primary-container transition-all overflow-hidden group">
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
            <div className="w-[60px] h-[60px] rounded-full bg-white/75 border border-white/85 grid place-items-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-primary-container" />
            </div>
            <h3 className="font-bold text-on-surface mb-1">Drop your photo here or browse</h3>
            <p className="text-[0.8rem] text-on-surface-var">PNG, JPG or WEBP (max 5MB)</p>
            {img && (
              <div className="mt-4">
                <img src={img} alt="Preview" className="max-h-[110px] rounded-xl border-2 border-white/85 mx-auto object-cover" />
                <div className="text-[0.8rem] font-semibold text-on-surface mt-1.5">{fileName}</div>
              </div>
            )}
          </div>

          <div className="h-px bg-white/50 my-7" />
          <div className="text-[0.72rem] font-extrabold uppercase tracking-widest text-primary/65 mb-4">Privacy</div>
          <div className="flex items-center justify-between bg-[#006591]/5 p-4 px-5 rounded-[1.1rem] gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full shrink-0 bg-[#006591]/10 grid place-items-center">
                <EyeOff className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-bold text-on-surface text-[0.9rem]">Mark as Confidential</p>
                <p className="text-[0.75rem] text-on-surface-var mt-0.5">Your identity will be hidden from other students. Only admins can view this report.</p>
              </div>
            </div>
            <label className="relative w-[46px] h-[26px] shrink-0 cursor-pointer">
              <input type="checkbox" checked={conf} onChange={e => setConf(e.target.checked)} className="sr-only peer" />
              <div className="absolute inset-0 rounded-full bg-outline-var peer-checked:bg-primary-container transition-colors" />
              <div className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm peer-checked:translate-x-[20px] transition-transform" />
            </label>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-white/40">
            <Link to="/dashboard" className="btn btn-ghost flex-1 text-center py-3.5 rounded-xl font-bold border border-outline-var hover:bg-white">Cancel</Link>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1 py-3.5 rounded-xl font-bold bg-gradient-to-br from-primary-mid to-primary text-white shadow-[0_4px_14px_rgba(0,74,198,0.28)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
              {loading ? 'Submitting...' : 'Submit Report'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
