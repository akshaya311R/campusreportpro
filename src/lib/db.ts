export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'student' | 'staff';
  isAdmin: boolean;
}

export interface Issue {
  id: number;
  title: string;
  loc: string;
  cat: string;
  desc: string;
  prio: 'Low' | 'Medium' | 'Urgent';
  conf: boolean;
  status: 'Pending' | 'In Progress' | 'Resolved';
  note: string;
  img: string | null;
  ts: number;
  uid: number;
  uname: string;
}

export const DB = {
  get: (k: string) => {
    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; }
  },
  set: (k: string, v: any) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  },
  users: (): User[] => DB.get('cr_users') || [],
  issues: (): Issue[] => DB.get('cr_issues') || [],
  session: (): { userId: number } | null => DB.get('cr_session') || null,
  saveUsers: (u: User[]) => DB.set('cr_users', u),
  saveIssues: (i: Issue[]) => DB.set('cr_issues', i),
  saveSession: (s: { userId: number } | null) => DB.set('cr_session', s),
  clearSession: () => localStorage.removeItem('cr_session'),
  currentUser: (): User | null => {
    const s = DB.session();
    if (!s) return null;
    const users = DB.users();
    return users.find(u => u.id === s.userId) || null;
  },
  nextId: (key: string) => {
    const n = (DB.get(key) || 0) + 1;
    DB.set(key, n);
    return n;
  }
};

// Seed admin
if (!DB.get('cr_seeded')) {
  DB.saveUsers([{ id: 1, username: 'admin', password: 'password', role: 'staff', isAdmin: true }]);
  DB.set('cr_uid', 1);
  DB.set('cr_seeded', true);
}
