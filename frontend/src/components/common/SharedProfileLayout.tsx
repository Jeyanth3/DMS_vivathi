import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowRight, Award, BarChart3, Calendar, Clock, Facebook, Gavel, Linkedin,
  Mail, MapPin, Pencil, Swords, Trophy, Twitter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { Notification, User } from '../../types';
import { connectionsAPI, notificationsAPI } from '../../api';
import { getNotificationRoute } from '../../utils/notificationRouting';
import { toAbsoluteAvatarUrl } from '../../utils/avatarUrl';
import DiariesSection from './DiariesSection';
import EditProfileModal from './EditProfileModal';
import LoadingSpinner from './LoadingSpinner';

const ROLE_THEME: Record<string, { icon: typeof Swords; label: string; badge: string; accent: string }> = {
  DEBATER: { icon: Swords, label: 'Verified Orator', badge: 'Gold Tier', accent: 'Lead Debater' },
  JUDGE: { icon: Gavel, label: 'Certified Adjudicator', badge: 'Senior Judge', accent: 'Adjudicator' },
  ORGANIZER: { icon: BarChart3, label: 'Tournament Director', badge: 'Organizer', accent: 'Circuit Builder' },
};

export interface SharedProfileLayoutProps {
  user: User;
  notifications: Notification[];
  isReadOnly: boolean;
  loading: boolean;
  onNotificationsChange?: (updater: (prev: Notification[]) => Notification[]) => void;
  sidebarExtra?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
}

function PerformanceGraph() {
  const points = '0,96 78,72 156,112 234,44 312,66 390,20 468,74 546,46 624,34 702,14 780,40';
  return (
    <div className="paper-panel p-7">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-2xl font-bold text-[#06192b]">Recent Performance</h2>
        <p className="eyebrow text-slate-500">Last 12 Matches</p>
      </div>
      <div className="relative h-56">
        <div className="absolute inset-0 grid grid-rows-4">
          {[0, 1, 2, 3].map(i => <div key={i} className="border-t border-dashed border-slate-300" />)}
        </div>
        <svg viewBox="0 0 780 140" className="absolute inset-x-0 top-6 h-36 w-full overflow-visible">
          <polyline fill="none" stroke="#06192b" strokeWidth="3" points={points} />
          {[390, 702].map((x, i) => (
            <circle key={x} cx={x} cy={i === 0 ? 20 : 14} r="5" fill="#06192b" />
          ))}
        </svg>
        <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#06192b] text-white text-[10px] font-bold px-3 py-1">PEAK ELO: 2140</span>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-medium text-slate-600">
          <span>OCT 2023</span>
          <span>JAN 2024</span>
          <span>APR 2024</span>
        </div>
      </div>
    </div>
  );
}

export default function SharedProfileLayout({
  user, notifications, isReadOnly, loading, onNotificationsChange, sidebarExtra, headerActions, children,
}: SharedProfileLayoutProps) {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const theme = ROLE_THEME[user.role] ?? ROLE_THEME.DEBATER;
  const RoleIcon = theme.icon;

  useEffect(() => {
    connectionsAPI.getConnectionCount(user.id)
      .then(res => setConnectionsCount(res.data.count))
      .catch(() => setConnectionsCount(0));
  }, [user.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  const statLine = [
    { label: 'Matches Won', value: user.role === 'DEBATER' ? '142' : String(connectionsCount) },
    { label: 'Avg. Score', value: user.role === 'DEBATER' ? '78.4' : user.role === 'JUDGE' ? '96' : '24' },
    { label: 'Global Rank', value: user.role === 'DEBATER' ? '#14' : user.role === 'JUDGE' ? '#08' : '#03' },
  ];

  return (
    <div className="min-h-screen py-10 animate-fade-in editorial-grid">
      <div className="editorial-shell">
        <header className="pb-10 border-b border-slate-300">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_auto] gap-7 items-center">
            <div className="relative w-40">
              <div className="w-40 h-40 border border-slate-300 bg-[#eef5ff] p-1">
                {user.profilePictureUrl ? (
                  <img src={toAbsoluteAvatarUrl(user.profilePictureUrl)} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#06192b] text-white flex items-center justify-center font-display text-5xl font-bold">
                    {user.fullName[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-3 right-[-10px] bg-[#ffe66d] border border-[#8a6a00] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#8a6a00]">
                {theme.badge}
              </span>
            </div>

            <div>
              <p className="eyebrow text-slate-500 mb-3">{theme.accent}</p>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#06192b] leading-tight">{user.fullName}</h1>
              <p className="text-lg italic text-slate-700 mt-2">
                {user.role === 'DEBATER' ? 'Lead Debater' : user.role === 'JUDGE' ? 'Adjudicator' : 'Tournament Organizer'}
                {user.location ? `, ${user.location}` : ''}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="badge bg-[#eef5ff] text-[#06192b] border-slate-300">
                  <RoleIcon className="w-4 h-4 mr-2" /> {theme.label}
                </span>
                <span className="badge bg-white text-[#06192b] border-slate-300">
                  <Trophy className="w-4 h-4 mr-2 text-[#8a6a00]" /> {connectionsCount} Connections
                </span>
                {!isReadOnly && (
                  <button onClick={() => setIsEditModalOpen(true)} className="badge bg-white text-[#06192b] border-slate-300 hover:bg-[#eef5ff]">
                    <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                  </button>
                )}
                {headerActions}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-0 min-w-[290px] border border-slate-300 bg-white">
              {statLine.map(stat => (
                <div key={stat.label} className="px-5 py-5 text-center border-r border-slate-300 last:border-0">
                  <p className="eyebrow text-slate-500 leading-tight">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-[#06192b] mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 py-10">
          <main className="space-y-7">
            <PerformanceGraph />
            <section className="paper-panel p-7">
              <h2 className="font-display text-2xl font-bold text-[#06192b] mb-6">Skill Breakdown</h2>
              {[
                ['Matter (Substance & Content)', '92%'],
                ['Manner (Style & Presentation)', '88%'],
                ['Method (Structure & Strategy)', '84%'],
              ].map(([label, value]) => (
                <div key={label} className="mb-5 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#06192b]">{label}</p>
                    <p className="text-sm font-bold text-[#06192b]">{value}</p>
                  </div>
                  <div className="h-1 bg-[#eef5ff]">
                    <div className="h-full bg-[#06192b]" style={{ width: value }} />
                  </div>
                </div>
              ))}
            </section>
            {children}
            <DiariesSection profileUserId={user.id} />
            {!isReadOnly && notifications.length > 0 && (
              <section className="paper-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="eyebrow text-[#06192b]">Notifications</h2>
                  <Link to="/notifications" className="text-xs font-bold uppercase tracking-widest text-[#06192b] inline-flex items-center gap-2">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-slate-200">
                  {notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={async () => {
                        if (!n.readStatus) {
                          try {
                            await notificationsAPI.markRead(n.id);
                            onNotificationsChange?.(prev => prev.map(item => item.id === n.id ? { ...item, readStatus: true } : item));
                          } catch { /* silent */ }
                        }
                        const route = getNotificationRoute(n);
                        if (route) navigate(route);
                      }}
                      className={`w-full text-left py-4 flex items-start gap-3 ${!n.readStatus ? 'bg-[#eef5ff]/50 px-3' : ''}`}
                    >
                      <span className={`mt-2 h-2 w-2 flex-shrink-0 ${n.readStatus ? 'bg-slate-300' : 'bg-[#8a6a00]'}`} />
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-[#06192b] truncate">{n.title}</span>
                        <span className="block text-sm text-slate-600 truncate">{n.message}</span>
                      </span>
                      <span className="text-xs text-slate-500">{n.createdAt ? format(new Date(n.createdAt), 'MMM d') : ''}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className="space-y-7">
            <section className="paper-panel p-6">
              <h2 className="font-display text-2xl font-bold text-[#06192b] border-b border-dotted border-slate-300 pb-2 mb-5">
                Tournament History
              </h2>
              {[
                ['2024', 'World Universities Debating', 'Quarter-Finalist / Belgrade'],
                ['2023', 'Harvard Invitational', 'Grand Champion / Cambridge'],
                ['2023', 'Asian BP Championships', 'Runner Up / Singapore'],
              ].map(([year, title, desc], index) => (
                <div key={title} className="grid grid-cols-[56px_1fr] gap-4 mb-5 last:mb-0">
                  <p className="font-bold text-[#06192b]">{year}</p>
                  <div>
                    <p className="font-bold text-[#06192b]">{title}</p>
                    <p className="text-sm italic text-slate-600">{desc}</p>
                    {index === 1 && <span className="mt-2 inline-block bg-[#ffe66d] border border-[#8a6a00] px-2 py-0.5 text-[10px] font-bold uppercase text-[#06192b]">Best Speaker</span>}
                  </div>
                </div>
              ))}
              <button className="btn-secondary w-full text-xs mt-5">View Full Record</button>
            </section>

            <section className="paper-panel bg-[#dbeafe] p-6">
              <h2 className="font-display text-2xl font-bold text-[#06192b] mb-5">Adjudicator Feedback</h2>
              <p className="italic text-slate-700 leading-7">
                "{user.fullName.split(' ')[0]} displays a remarkable ability to synthesize complex arguments with clinical precision."
              </p>
              <p className="mt-6 text-sm font-bold text-[#06192b]">— Dr. Marcus Thorne, WUDC Lead Judge</p>
            </section>

            <section>
              <h2 className="eyebrow text-slate-500 mb-3">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {(user.expertise ? user.expertise.split(',') : ['International Relations', 'Moral Philosophy', 'Late-Stage Capitalism', 'Post-Humanism']).map(item => (
                  <span key={item} className="px-3 py-1 border border-slate-300 bg-white text-xs font-medium text-[#06192b]">
                    {item.trim()}
                  </span>
                ))}
              </div>
            </section>

            <section className="space-y-3 text-sm">
              {user.location && <p className="flex items-center gap-3 text-slate-600"><MapPin className="w-4 h-4 text-[#06192b]" /> {user.location}</p>}
              <p className="flex items-center gap-3 text-slate-600"><Mail className="w-4 h-4 text-[#06192b]" /> {user.email}</p>
              {user.age && <p className="flex items-center gap-3 text-slate-600"><Calendar className="w-4 h-4 text-[#06192b]" /> Age {user.age}</p>}
              {user.createdAt && <p className="flex items-center gap-3 text-slate-600"><Clock className="w-4 h-4 text-[#06192b]" /> Joined {format(new Date(user.createdAt), 'MMM yyyy')}</p>}
              <div className="flex items-center gap-5 pt-3">
                {[Linkedin, Twitter, Facebook].map((Icon, index) => (
                  <a key={index} href="#" className="text-slate-500 hover:text-[#06192b]"><Icon className="w-5 h-5" /></a>
                ))}
              </div>
            </section>

            {sidebarExtra}
          </aside>
        </div>
      </div>
      {!isReadOnly && <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={user} />}
    </div>
  );
}
