import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Award, BarChart3, CalendarDays, CheckCircle, ChevronRight, Loader2,
  MessageSquare, Plus, Scale, Send, Trash2, Trophy, Users
} from 'lucide-react';
import { format } from 'date-fns';
import { discussionAPI, matchesAPI, scoreSheetsAPI, statsAPI, tournamentsAPI } from '../../api';
import Avatar from '../../components/common/Avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import type { DiscussionComment, Match, SchoolLeaderboardEntry, Tournament } from '../../types';
import CreateMatchModal from './CreateMatchModal';

type Tab = 'matches' | 'discussion' | 'leaderboard' | 'scoresheet' | 'results' | 'info';

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'matches', label: 'Matches', icon: Trophy },
  { key: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { key: 'discussion', label: 'Discussion', icon: MessageSquare },
  { key: 'scoresheet', label: 'Score Sheet', icon: Scale },
  { key: 'results', label: 'Results', icon: Award },
  { key: 'info', label: 'Info', icon: Users },
];

function MiniMatch({ a, b, scoreA, scoreB }: { a: string; b: string; scoreA?: number; scoreB?: number }) {
  return (
    <div className="paper-panel bg-white w-full min-w-[180px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-300">
        <span className="font-display text-[#06192b]">{a}</span>
        <span className="font-bold text-[#06192b]">{scoreA ?? 'VS'}</span>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-display text-slate-500">{b}</span>
        <span className="text-slate-500">{scoreB ?? ''}</span>
      </div>
    </div>
  );
}

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<SchoolLeaderboardEntry[]>([]);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [scoreTemplate, setScoreTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOrganizer = user?.role === 'ORGANIZER' && tournament?.organizer?.id === user?.id;

  const fetchAll = async () => {
    if (!id) return;
    try {
      const tournamentId = parseInt(id);
      const [tRes, mRes, lRes, cRes] = await Promise.allSettled([
        tournamentsAPI.getById(tournamentId),
        matchesAPI.getByTournament(tournamentId),
        statsAPI.getLeaderboard(tournamentId),
        discussionAPI.getComments(tournamentId),
      ]);
      if (tRes.status === 'fulfilled') setTournament(tRes.value.data);
      if (mRes.status === 'fulfilled') setMatches(mRes.value.data);
      if (lRes.status === 'fulfilled') setLeaderboard(lRes.value.data);
      if (cRes.status === 'fulfilled') setComments(cRes.value.data);
      try {
        const tmplRes = await scoreSheetsAPI.getTemplate(tournamentId);
        setScoreTemplate(tmplRes.data);
      } catch { /* optional */ }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const postComment = async () => {
    if (!newComment.trim() || !user || !id) return;
    setCommentLoading(true);
    try {
      await discussionAPI.addComment({ tournamentId: parseInt(id), userId: user.id, comment: newComment });
      setNewComment('');
      const { data } = await discussionAPI.getComments(parseInt(id));
      setComments(data);
      showToast('Comment posted', 'success');
    } catch {
      showToast('Failed to post comment', 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await discussionAPI.delete(commentId);
      setComments(p => p.filter(c => c.id !== commentId));
    } catch {
      showToast('Failed to delete comment', 'error');
    }
  };

  const generateNextRound = async () => {
    if (!id) return;
    try {
      await matchesAPI.generateNextRound(parseInt(id));
      showToast('Next round generated!', 'success');
      const { data } = await matchesAPI.getByTournament(parseInt(id));
      setMatches(data);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Cannot generate next round yet', 'error');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner message="Loading tournament..." /></div>;
  if (!tournament) return <div className="min-h-screen flex items-center justify-center"><Link to="/" className="btn-primary">Tournament Not Found</Link></div>;

  const completedMatches = matches.filter(m => m.status === 'COMPLETED');
  const finalMatch = matches.find(m => m.roundNumber === Math.max(...matches.map(match => match.roundNumber), 1));
  const displayMatches = matches.length > 0 ? matches.slice(0, 4) : [];
  const winner = tournament.status === 'COMPLETED' ? leaderboard[0] : null;

  return (
    <div className="min-h-screen">
      <section className="border-b border-slate-300 bg-white/80">
        <div className="editorial-shell py-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="badge bg-[#ffe66d] text-[#8a6a00] border-[#ffe66d]">{tournament.status}</span>
                <span className="eyebrow text-slate-500">Season 2026</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#06192b] max-w-3xl leading-tight">{tournament.name}</h1>
              <p className="mt-5 max-w-2xl text-slate-700 italic leading-7">
                The premier platform for intellectual rigor and professional debate excellence. Organized by {tournament.organizer?.fullName}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isOrganizer && (
                <>
                  <button onClick={() => setShowCreateMatch(true)} className="btn-primary text-xs"><Plus className="w-4 h-4" /> Create Match</button>
                  {tournament.tournamentType === 'KNOCKOUT' && (
                    <button onClick={generateNextRound} className="btn-secondary text-xs">Generate Next Round</button>
                  )}
                </>
              )}
              <button onClick={() => setActiveTab('scoresheet')} className="btn-secondary text-xs">View Rules</button>
              <button onClick={() => setActiveTab('discussion')} className="btn-primary text-xs">Join Discussion</button>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-shell py-14">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-10 items-center">
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[760px] grid grid-cols-[1fr_1fr_1fr] gap-12 items-center">
              <div>
                <p className="eyebrow text-center mb-6">Round of 16</p>
                <div className="space-y-8">
                  {(displayMatches.length ? displayMatches : [
                    { propositionSchool: { name: 'Oxford' }, oppositionSchool: { name: 'Yale' }, id: 1 },
                    { propositionSchool: { name: 'Harvard' }, oppositionSchool: { name: 'Princeton' }, id: 2 },
                    { propositionSchool: { name: 'Stanford' }, oppositionSchool: { name: 'MIT' }, id: 3 },
                    { propositionSchool: { name: 'Cambridge' }, oppositionSchool: { name: 'LSE' }, id: 4 },
                  ] as any[]).map((m, index) => (
                    <MiniMatch key={m.id ?? index} a={m.propositionSchool?.name || 'TBD'} b={m.oppositionSchool?.name || 'TBD'} scoreA={index % 2 === 0 ? 24 + index : undefined} scoreB={index % 2 === 0 ? 19 + index : undefined} />
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow text-center mb-6">Quarterfinals</p>
                <div className="space-y-20">
                  <MiniMatch a={leaderboard[0]?.schoolName || 'Winner Q1'} b={leaderboard[1]?.schoolName || 'Winner Q2'} />
                  <MiniMatch a={leaderboard[2]?.schoolName || 'Winner Q3'} b={leaderboard[3]?.schoolName || 'Winner Q4'} />
                </div>
              </div>
              <div className="bg-[#dbeafe] border border-slate-300 p-7">
                <p className="eyebrow text-center mb-6">Semifinals</p>
                <MiniMatch a="TBD (Winner Q1)" b="TBD (Winner Q2)" />
                <p className="text-center my-5 font-display">VS</p>
                <MiniMatch a="TBD (Winner Q3)" b="TBD (Winner Q4)" />
              </div>
            </div>
          </div>

          <aside className="ink-panel p-8 text-center">
            <p className="eyebrow text-[#ffe66d] mb-8">The Grand Final</p>
            <Trophy className="w-8 h-8 text-[#ffe66d] mx-auto mb-5" />
            <p className="font-display text-white">Final Decider</p>
            <div className="my-7 space-y-4 text-sm italic text-slate-300">
              <p>{finalMatch?.propositionSchool?.name || 'Finalist A'}</p>
              <p className="text-[#ffe66d] not-italic">AUGUST 24, 2026</p>
              <p>{finalMatch?.oppositionSchool?.name || 'Finalist B'}</p>
            </div>
            <button className="w-full bg-[#8a6a00] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest">Set Reminder</button>
          </aside>
        </div>
      </section>

      <section className="bg-[#eef5ff] border-y border-slate-300 py-10">
        <div className="editorial-shell">
          <div className="flex items-center justify-between mb-8">
            <p className="font-display text-[#06192b]">Tournament Insights</p>
            <button onClick={() => setActiveTab('leaderboard')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#06192b]">
              Full Analytics <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="paper-panel p-6">
              <p className="eyebrow mb-5">Top Debater</p>
              <p className="font-display text-[#06192b]">{leaderboard[0]?.schoolName || 'Prof. Julian Thorne'}</p>
              <p className="italic text-slate-600 text-sm mt-2">Tournament Leader</p>
              <p className="font-display text-6xl text-[#06192b] mt-8">9.8</p>
              <p className="eyebrow text-[#8a6a00] text-right">Average Rating</p>
            </div>
            <div className="relative min-h-56 overflow-hidden border border-slate-300 bg-[#06192b]">
              <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80" alt="Venue" className="absolute inset-0 h-full w-full object-cover grayscale opacity-70" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="badge bg-[#06192b] text-white border-white/20 mb-2">Venue Spotlight</p>
                <p className="font-display">The Radcliffe Camera</p>
              </div>
            </div>
            <div className="paper-panel p-6">
              <p className="eyebrow mb-5">Current Trend</p>
              <p className="font-display text-[#06192b]">{leaderboard[0]?.schoolName || 'Cambridge'} Dominance</p>
              <p className="text-slate-600 text-sm leading-7 mt-3">Unbeaten in recent competitive rounds with a margin of +4.2 points.</p>
              <div className="grid grid-cols-4 gap-3 mt-9">
                <div className="h-1 bg-[#06192b]" />
                <div className="h-1 bg-[#06192b]" />
                <div className="h-1 bg-[#06192b]" />
                <div className="h-1 bg-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-shell py-10">
        <div className="flex gap-2 overflow-x-auto border-b border-slate-300 pb-3 mb-8">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={activeTab === t.key ? 'tab-btn-active' : 'tab-btn-inactive'}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matches.length > 0 ? matches.map(m => (
              <article key={m.id} className="paper-panel p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow text-slate-500">{m.matchCode} / Round {m.roundNumber}</p>
                    <p className="font-display text-2xl text-[#06192b] mt-2">{m.propositionSchool?.name} <span className="text-slate-400">vs</span> {m.oppositionSchool?.name}</p>
                    <p className="text-sm italic text-slate-600 mt-2">"{m.topic}"</p>
                  </div>
                  <span className={m.status === 'LIVE' ? 'badge-live' : m.status === 'COMPLETED' ? 'badge-completed' : 'badge bg-[#eef5ff] text-[#06192b] border-slate-300'}>{m.status}</span>
                </div>
                {m.judges && m.judges.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.judges.map(j => (
                      <Link key={j.id} to={`/score-sheet/${m.id}/${j.judge.id}`} className="badge bg-white text-[#06192b] border-slate-300">
                        {j.judge.fullName} {j.submitted ? '✓' : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            )) : (
              <div className="paper-panel text-center py-14">
                <Trophy className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <p className="text-slate-600">No matches yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="paper-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr><th className="p-4 text-left">#</th><th className="p-4 text-left">School</th><th className="p-4">Played</th><th className="p-4">Wins</th><th className="p-4">Points</th><th className="p-4">Win Rate</th></tr></thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={entry.schoolId} className="border-t border-slate-300">
                    <td className="p-4 font-bold text-[#8a6a00]">{String(i + 1).padStart(2, '0')}</td>
                    <td className="p-4 font-display text-lg text-[#06192b]">{entry.schoolName}</td>
                    <td className="p-4 text-center">{entry.played}</td>
                    <td className="p-4 text-center font-bold">{entry.wins}</td>
                    <td className="p-4 text-center font-bold">{entry.points}</td>
                    <td className="p-4 text-center">{entry.winRate.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="space-y-4">
            {user && (
              <div className="paper-panel p-5 flex gap-4">
                <Avatar name={user.fullName} src={user.profilePictureUrl} size="sm" />
                <div className="flex-1">
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} className="input-field resize-none" placeholder="Join the proceedings..." />
                  <button onClick={postComment} disabled={commentLoading || !newComment.trim()} className="btn-primary text-xs mt-3">
                    {commentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Post Comment
                  </button>
                </div>
              </div>
            )}
            {comments.map(c => (
              <article key={c.id} className="paper-panel p-5 flex gap-4">
                <Avatar name={c.user.fullName} src={c.user.profilePictureUrl} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#06192b]">{c.user.fullName}</p>
                    {(isOrganizer || user?.id === c.user.id) && <button onClick={() => deleteComment(c.id)} className="text-red-700"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <p className="text-slate-700 mt-2">{c.comment}</p>
                  <p className="text-xs text-slate-500 mt-2">{c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : ''}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'scoresheet' && (
          <div className="paper-panel p-6">
            <h2 className="font-display text-3xl font-bold text-[#06192b] mb-5">Score Sheet Template</h2>
            {scoreTemplate?.criteriaJson ? (
              <table className="w-full text-sm">
                <thead><tr><th className="p-4 text-left">Criteria</th><th className="p-4 text-center">Max Marks</th></tr></thead>
                <tbody>
                  {JSON.parse(scoreTemplate.criteriaJson).map((c: any, i: number) => (
                    <tr key={i} className="border-t border-slate-300"><td className="p-4 font-bold">{c.name}</td><td className="p-4 text-center">{c.maxMarks}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-slate-500">No score sheet template configured.</p>}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            {winner && <div className="paper-panel bg-[#fff8df] p-8 text-center"><Trophy className="w-12 h-12 mx-auto text-[#8a6a00] mb-3" /><p className="eyebrow">Winner</p><h2 className="font-display text-4xl font-bold text-[#06192b]">{winner.schoolName}</h2></div>}
            {completedMatches.length ? completedMatches.map(m => (
              <div key={m.id} className="paper-panel p-5"><p className="eyebrow">{m.matchCode}</p><p className="font-display text-2xl">{m.propositionSchool?.name} vs {m.oppositionSchool?.name}</p><p className="text-sm text-slate-600">Winner: {m.winnerSchool?.name || 'TBD'}</p></div>
            )) : <div className="paper-panel text-center py-12">Results will appear as matches are completed.</div>}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="paper-panel p-6">
              <h2 className="font-display text-2xl font-bold mb-5">Schools & Debaters</h2>
              {tournament.schools?.map(school => (
                <div key={school.id} className="mb-5">
                  <p className="font-bold text-[#06192b]">{school.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">{school.debaters?.map(d => <Link key={d.id} to={`/profile/${d.id}`} className="badge bg-[#eef5ff] text-[#06192b] border-slate-300">{d.fullName}</Link>)}</div>
                </div>
              ))}
            </div>
            <div className="paper-panel p-6">
              <h2 className="font-display text-2xl font-bold mb-5">Judges</h2>
              {tournament.judges?.map(tj => (
                <Link key={tj.id} to={`/profile/${tj.judge.id}`} className="flex items-center gap-3 py-3 border-b border-slate-200">
                  <span className="eyebrow text-slate-500">{tj.judgeCode}</span>
                  <Avatar name={tj.judge.fullName} src={tj.judge.profilePictureUrl} size="sm" />
                  <span className="font-bold text-[#06192b]">{tj.judge.fullName}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {showCreateMatch && tournament && (
        <CreateMatchModal
          tournament={tournament}
          onClose={() => setShowCreateMatch(false)}
          onCreated={() => {
            setShowCreateMatch(false);
            matchesAPI.getByTournament(parseInt(id!)).then(r => setMatches(r.data));
          }}
        />
      )}
    </div>
  );
}
