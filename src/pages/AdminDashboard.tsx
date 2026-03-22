import { useState, useEffect, useRef } from 'react';
import { ClipboardList, Clock, CheckCircle2, Search, BarChart, Hourglass, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StatCard, IssueCard } from './Dashboard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function AdminDashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
    
    gsap.from('.stat-card', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.2
    });
  }, { scope: container });

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('ts', { ascending: false });
        
      if (error) throw error;
      if (data) setIssues(data);
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  useEffect(() => {
    fetchIssues();

    const subscription = supabase
      .channel('public:issues')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => {
        fetchIssues();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDelete = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this issue? This cannot be undone.')) {
      try {
        const issueToDelete = issues.find(i => i.id === id);
        
        if (issueToDelete?.img) {
          const urlParts = issueToDelete.img.split('/issue-images/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            await supabase.storage.from('issue-images').remove([filePath]);
          }
        }

        const { error } = await supabase
          .from('issues')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        setIssues(issues.filter(i => i.id !== id));
      } catch (err) {
        console.error('Error deleting issue:', err);
        alert('Failed to delete issue. Please try again.');
      }
    }
  };

  const handleUpdate = async (id: string | number, status: any, note: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status, note })
        .eq('id', id);
        
      if (error) throw error;
      
      setIssues(issues.map(i => i.id === id ? { ...i, status, note } : i));
    } catch (err) {
      console.error('Error updating issue:', err);
      alert('Failed to update issue. Please try again.');
    }
  };

  const filtered = issues.filter(iss => {
    if (q && !iss.title.toLowerCase().includes(q.toLowerCase()) && !iss.description?.toLowerCase().includes(q.toLowerCase()) && !iss.uname.toLowerCase().includes(q.toLowerCase()) && !iss.loc.toLowerCase().includes(q.toLowerCase())) return false;
    if (statusFilter && iss.status !== statusFilter) return false;
    if (catFilter && iss.cat !== catFilter) return false;
    return true;
  });

  const total = issues.length;
  const pending = issues.filter(i => i.status === 'Pending').length;
  const progress = issues.filter(i => i.status === 'In Progress').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div ref={container} className="max-w-6xl mx-auto px-6">
      <header className="flex flex-wrap justify-between items-end gap-5 mb-11">
        <div>
          <h2 className="text-[3rem] font-extrabold text-on-surface tracking-[-2px] leading-none mb-1">Admin Dashboard</h2>
          <p className="font-serif italic text-[1.35rem] text-on-surface-var">Manage and resolve campus reports with precision.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatCard icon={BarChart} color="blue" val={total} label="Total Reports" />
        <StatCard icon={Hourglass} color="amber" val={pending} label="Pending" />
        <StatCard icon={RefreshCw} color="sky" val={progress} label="In Progress" />
        <StatCard icon={CheckCircle2} color="green" val={resolved} label="Resolved" />
      </div>

      <div className="glass glass-md flex flex-wrap items-center gap-3 p-4 rounded-full mb-10">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-var w-4 h-4 pointer-events-none" />
          <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, location, student..." className="w-full bg-surface-lowest border-none rounded-full py-2.5 pr-4 pl-11 text-[0.875rem] text-on-surface outline-none focus:shadow-[0_0_0_2px_rgba(0,74,198,0.2)] transition-shadow" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-surface-lowest border-none rounded-full py-2.5 pr-9 pl-4 text-[0.85rem] text-on-surface cursor-pointer outline-none focus:shadow-[0_0_0_2px_rgba(0,74,198,0.2)] appearance-none">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-surface-lowest border-none rounded-full py-2.5 pr-9 pl-4 text-[0.85rem] text-on-surface cursor-pointer outline-none focus:shadow-[0_0_0_2px_rgba(0,74,198,0.2)] appearance-none">
            <option value="">All Categories</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Safety">Safety</option>
            <option value="Discipline">Discipline</option>
            <option value="Academic">Academic</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => { setQ(''); setStatusFilter(''); setCatFilter(''); }} className="btn btn-ghost btn-sm px-4 py-2 rounded-full text-sm font-bold border border-outline-var hover:bg-white">Clear</button>
        </div>
      </div>

      <div className="flex justify-between items-end gap-4 mb-7 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-[-0.5px]">All Issues</h2>
          <p className="text-[0.85rem] text-on-surface-var mt-1">{filtered.length} report{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-8 border-2 border-dashed border-primary/20 rounded-3xl bg-white/30">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-base font-extrabold text-on-surface mb-1.5">No issues found</h3>
            <p className="text-[0.875rem] text-on-surface-var">
              {q || statusFilter || catFilter ? 'No results match your filters.' : 'No reports have been submitted yet.'}
            </p>
          </div>
        ) : (
          filtered.map(iss => (
            <IssueCard key={iss.id} iss={iss} isAdmin={true} onDelete={() => handleDelete(iss.id)} onUpdate={handleUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
