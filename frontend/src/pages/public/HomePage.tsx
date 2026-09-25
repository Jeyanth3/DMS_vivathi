import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, ChevronLeft, ChevronRight, Filter, MapPin, Plus, Search, Trophy } from 'lucide-react';
import { tournamentsAPI } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Tournament } from '../../types';

const images = [
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
];

function TournamentCard({ tournament, index }: { tournament: Tournament; index: number }) {
  const label = index % 3 === 0 ? 'International' : index % 3 === 1 ? 'Invitational' : 'Master Tier';
  return (
    <article className="paper-panel overflow-hidden group">
      <div className="relative h-56 bg-[#eef5ff]">
        <img src={images[index % images.length]} alt="" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
        <span className="absolute top-4 left-4 bg-[#ffe66d] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8a6a00]">{label}</span>
      </div>
      <div className="p-7">
        <p className="text-xs text-slate-500 flex items-center gap-2 uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5" /> {new Date(tournament.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
        </p>
        <h2 className="font-display text-2xl font-bold text-[#06192b] mt-4 leading-tight">{tournament.name}</h2>
        <p className="text-sm text-slate-600 flex items-center gap-2 mt-4">
          <MapPin className="w-4 h-4" /> {tournament.debateType?.replace(/_/g, ' ')} / {tournament.tournamentType}
        </p>
        <div className="border-t border-slate-300 mt-8 pt-5 flex items-center gap-3">
          <Link to={`/tournament/${tournament.id}`} className="btn-primary flex-1 text-xs">
            {tournament.status === 'ACTIVE' ? 'View Details' : 'Review'}
          </Link>
          <Link to={`/tournament/${tournament.id}`} className="w-12 h-12 border border-slate-300 flex items-center justify-center hover:bg-[#eef5ff]">
            <ArrowUpRight className="w-5 h-5 text-[#06192b]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tournamentsAPI.getAll()
      .then(res => setTournaments(res.data))
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tournaments;
    return tournaments.filter(t => `${t.name} ${t.debateType} ${t.tournamentType}`.toLowerCase().includes(q));
  }, [query, tournaments]);

  const fallback = filtered.length > 0 ? filtered : tournaments;

  return (
    <div className="min-h-screen">
      <section className="editorial-shell py-14">
        <div className="border-l-4 border-[#06192b] pl-6 max-w-3xl">
          <p className="eyebrow text-slate-500 mb-4">Elite Catalog</p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#06192b]">Discover Tournaments</h1>
          <p className="mt-5 text-lg italic leading-8 text-slate-700">
            A curated selection of rigorous intellectual competitions. Engage with the world's leading minds and refine your professional rigor.
          </p>
        </div>
      </section>

      <section className="editorial-shell">
        <div className="paper-panel p-5 flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <button className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#06192b]">
              <Filter className="w-4 h-4" /> Filters
            </button>
            {['Region', 'Skill Level', 'Status'].map(item => (
              <button key={item} className="text-xs font-medium text-[#06192b]">{item}⌄</button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tournaments..." className="input-field border-0 border-b border-slate-300 pr-10 bg-transparent" />
          </div>
        </div>
      </section>

      <section className="editorial-shell py-10">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {(fallback.length ? fallback : []).map((tournament, index) => (
              <TournamentCard key={tournament.id} tournament={tournament} index={index} />
            ))}
            <Link to="/create-tournament" className="min-h-[520px] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-8 hover:bg-[#eef5ff] transition-colors">
              <span className="w-16 h-16 border border-[#06192b] flex items-center justify-center mb-8">
                <Plus className="w-8 h-8 text-[#06192b]" />
              </span>
              <h2 className="font-display text-2xl font-bold text-[#06192b]">Host a Tournament</h2>
              <p className="text-sm italic text-slate-600 mt-3">Reach the global elite community.</p>
            </Link>
          </div>
        )}
      </section>

      <section className="editorial-shell pb-16">
        <div className="flex items-center justify-center gap-2">
          <button className="w-10 h-10 border border-slate-300 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
          {[1, 2, 3].map(page => <button key={page} className={`w-10 h-10 border border-slate-300 text-sm ${page === 1 ? 'bg-[#06192b] text-white' : 'bg-white text-[#06192b]'}`}>{page}</button>)}
          <span className="px-2">...</span>
          <button className="w-10 h-10 border border-slate-300 text-sm bg-white text-[#06192b]">12</button>
          <button className="w-10 h-10 border border-slate-300 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </section>
    </div>
  );
}
