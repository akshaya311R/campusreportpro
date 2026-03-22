import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ClipboardList, Clock, CheckCircle2, Search, MapPin, Calendar, Trash2, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function Dashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const { user } = useAuth();
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('uid', user.id)
        .order('ts', { ascending: false });
        
      if (error) throw error;
      if (data) setIssues(data);
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  useEffect(() => {
    fetchIssues();

    if (!user) return;

    const subscription = supabase
      .channel('public:issues')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => {
        fetchIssues();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const handleDelete = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this issue?')) {
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

  const filtered = issues.filter(iss => {
    if (q && !iss.title.toLowerCase().includes(q.toLowerCase()) && !iss.description?.toLowerCase().includes(q.toLowerCase())) return false;
    if (statusFilter && iss.status !== statusFilter) return false;
    if (catFilter && iss.cat !== catFilter) return false;
    return true;
  });

  const total = issues.length;
  const pending = issues.filter(i => i.status === 'Pending').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div ref={container} className="max-w-6xl mx-auto px-6">
      <header className="flex flex-wrap justify-between items-end gap-5 mb-11">
        <div>
          <h2 className="text-[3rem] font-extrabold text-on-surface tracking-[-2px] leading-none mb-1">Dashboard</h2>
          <p className="font-serif italic text-[1.35rem] text-on-surface-var">Track your reported issues</p>
        </div>
        <Link to="/create-issue" className="btn btn-primary btn-lg flex items-center gap-2 bg-gradient-to-br from-primary-mid to-primary text-white px-8 py-3.5 rounded-full font-bold shadow-[0_4px_14px_rgba(0,74,198,0.28)] hover:-translate-y-0.5 transition-all">
          <Plus className="w-5 h-5" /> New Issue
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        <StatCard icon={ClipboardList} color="blue" val={total} label="Total Reports" />
        <StatCard icon={Clock} color="amber" val={pending} label="Pending" />
        <StatCard icon={CheckCircle2} color="green" val={resolved} label="Resolved" />
      </div>

      <div className="glass glass-md flex flex-wrap items-center gap-3 p-4 rounded-full mb-10">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-var w-4 h-4 pointer-events-none" />
          <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Search your reports..." className="w-full bg-surface-lowest border-none rounded-full py-2.5 pr-4 pl-11 text-[0.875rem] text-on-surface outline-none focus:shadow-[0_0_0_2px_rgba(0,74,198,0.2)] transition-shadow" />
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
          <h2 className="text-2xl font-extrabold text-on-surface tracking-[-0.5px]">Your Issues</h2>
          <p className="text-[0.85rem] text-on-surface-var mt-1">{filtered.length} report{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-8 border-2 border-dashed border-primary/20 rounded-3xl bg-white/30">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-base font-extrabold text-on-surface mb-1.5">No issues yet</h3>
            <p className="text-[0.875rem] text-on-surface-var">
              {q || statusFilter || catFilter ? 'No results match your filters.' : 'Ready to make a difference? Submit your first report.'}
            </p>
          </div>
        ) : (
          filtered.map(iss => (
            <IssueCard key={iss.id} iss={iss} onDelete={() => handleDelete(iss.id)} />
          ))
        )}
      </div>
    </div>
  );
}

export function StatCard({ icon: Icon, color, val, label }: { icon: any, color: string, val: number, label: string }) {
  const colors = {
    blue: 'bg-primary-container text-primary-container',
    amber: 'bg-amber-600 text-amber-600',
    green: 'bg-green-600 text-green-600',
    sky: 'bg-sky-500 text-sky-500'
  } as any;
  const bgColors = {
    blue: 'bg-primary-container/10',
    amber: 'bg-amber-600/10',
    green: 'bg-green-600/10',
    sky: 'bg-sky-500/10'
  } as any;

  return (
    <div className="stat-card glass glass-md p-7 pl-8 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(37,99,235,0.12)] transition-all">
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-r-sm ${colors[color].split(' ')[0]}`} />
      <div className={`w-11 h-11 rounded-xl grid place-items-center mb-4 ${bgColors[color]} ${colors[color].split(' ')[1]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-[2.5rem] font-extrabold text-on-surface leading-none tracking-[-2px] tabular-nums mb-1">{val}</div>
      <div className="text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-var opacity-65">{label}</div>
    </div>
  );
}

export function IssueCard({ iss, onDelete, isAdmin = false, onUpdate }: any) {
  const [manageOpen, setManageOpen] = useState(false);
  const [status, setStatus] = useState(iss.status);
  const [note, setNote] = useState(iss.note || '');

  useEffect(() => {
    setStatus(iss.status);
    setNote(iss.note || '');
  }, [iss.status, iss.note]);

  const handleSave = () => {
    if (onUpdate) onUpdate(iss.id, status, note);
    setManageOpen(false);
  };

  return (
    <div className="issue-card glass glass-md rounded-3xl overflow-hidden hover:scale-[1.005] hover:shadow-[0_16px_50px_rgba(37,99,235,0.10)] transition-all">
      <div className="flex flex-col md:flex-row gap-7 p-7 items-start">
        {iss.img && (
          <div className="shrink-0">
            <img src={iss.img} alt="Evidence" className={`w-[92px] h-[130px] object-cover rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.10)] ${iss.status === 'Resolved' ? 'grayscale opacity-80' : ''}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-surface-highest text-primary">{iss.cat || 'Other'}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold bg-surface-low text-on-surface-var">
              <MapPin className="w-3.5 h-3.5" /> {iss.loc}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold bg-surface-low text-on-surface-var">
              <Calendar className="w-3.5 h-3.5" /> {new Date(iss.ts).toLocaleDateString()}
            </span>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold bg-surface-low text-on-surface-var">
                <UserPlus className="w-3.5 h-3.5" /> {iss.uname}
              </span>
            )}
            {iss.conf && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.72rem] font-semibold bg-surface-low text-on-surface-var">Confidential</span>}
          </div>
          <h4 className="text-[1.35rem] font-extrabold text-on-surface mb-2 leading-tight">{iss.title}</h4>
          <p className="text-[0.875rem] text-on-surface-var leading-relaxed line-clamp-2 mb-3">{iss.description}</p>
          
          {iss.note && (
            <div className={`flex gap-2 items-start p-3 rounded-xl text-[0.84rem] ${iss.status === 'Resolved' ? 'bg-green-600/5 border border-green-600/10 text-green-900' : 'bg-sky-600/5 border border-sky-600/10 text-sky-900'}`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${iss.status === 'Resolved' ? 'text-green-600' : 'text-sky-600'}`} />
              <p><strong>Admin Note:</strong> {iss.note}</p>
            </div>
          )}
        </div>

        <div className="shrink-0 w-full md:w-[180px] flex md:flex-col justify-between items-center md:items-end gap-4 md:min-h-[130px]">
          <div className="flex md:flex-col items-center md:items-end gap-2">
            <StatusBadge status={iss.status} />
            <PrioBadge prio={iss.prio} />
          </div>
          <div className="flex gap-1.5">
            {isAdmin && (
              <button onClick={() => setManageOpen(!manageOpen)} className={`btn btn-sm ${manageOpen ? 'btn-primary bg-primary text-white' : 'btn-ghost border border-outline-var'} px-4 py-1.5 rounded-full text-sm font-bold`}>
                {manageOpen ? 'Close' : 'Manage'}
              </button>
            )}
            {(!isAdmin && iss.status === 'Pending') && (
              <button onClick={onDelete} className="w-10 h-10 rounded-full bg-transparent hover:bg-white/60 hover:text-red-600 text-on-surface-var grid place-items-center transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isAdmin && manageOpen && (
        <div className="border-t border-white/40 p-5 px-8 bg-[#f0f3ff]/50 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-primary/70 mb-1.5">Change Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white border-none rounded-xl p-2.5 text-[0.85rem] shadow-sm outline-none focus:shadow-[0_0_0_2px_rgba(37,99,235,0.12)]">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="flex-[2] min-w-[200px]">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-primary/70 mb-1.5">Admin Note</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for the student..." className="w-full bg-white border-none rounded-xl p-2.5 text-[0.85rem] shadow-sm outline-none focus:shadow-[0_0_0_2px_rgba(37,99,235,0.12)]" />
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={handleSave} className="btn btn-primary btn-sm px-4 py-2 rounded-xl font-bold bg-primary text-white">Save</button>
              <button onClick={onDelete} className="text-red-600 text-[0.8rem] font-bold hover:underline px-2">Delete Issue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    'Pending': 'bg-amber-bg text-amber-800',
    'In Progress': 'bg-sky-bg text-sky-600',
    'Resolved': 'bg-green-bg text-green-800'
  } as any;
  const dotStyles = {
    'Pending': 'bg-amber-600 animate-pulse',
    'In Progress': 'bg-sky-500 animate-pulse',
    'Resolved': 'bg-green-600'
  } as any;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] font-extrabold uppercase tracking-widest whitespace-nowrap ${styles[status] || 'bg-surface-container text-on-surface-var'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || 'bg-outline'}`} />
      {status}
    </span>
  );
}

function PrioBadge({ prio }: { prio: string }) {
  const styles = {
    'Urgent': 'bg-error-container text-red-700',
    'Medium': 'bg-surface-container text-on-surface',
    'Low': 'bg-surface-high text-on-surface-var'
  } as any;

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[0.68rem] font-extrabold uppercase tracking-widest ${styles[prio] || styles['Medium']}`}>
      {prio} Priority
    </span>
  );
}
