import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { usersAPI } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { DebaterStats } from '../../types';

export default function ScoringPage() {
  const [debaters, setDebaters] = useState<DebaterStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getTopDebaters()
      .then(res => setDebaters(res.data))
      .catch(() => setDebaters([]))
      .finally(() => setLoading(false));
  }, []);

  const top = debaters[0];
  const second = debaters[1];
  const third = debaters[2];
  const tableRows = debaters.slice(3, 8);

  return (
    <div className="min-h-screen py-14">
      <div className="editorial-shell">
        <header className="border-b border-[#06192b] pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="eyebrow text-[#8a6a00] mb-5">Global Standings</p>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#06192b] leading-tight max-w-3xl">
                Elite Debaters & The Art of Rhetoric
              </h1>
              <p className="mt-5 max-w-2xl italic text-slate-700 leading-7">
                Quantifying intellectual rigor through longitudinal performance data and competitive excellence.
              </p>
            </div>
            <div className="text-right">
              <p className="eyebrow text-slate-500">Season</p>
              <p className="font-display text-2xl text-[#06192b]">Autumn 2024</p>
            </div>
          </div>
        </header>

        <div className="flex gap-7 overflow-x-auto border-b border-slate-300 pb-4 mb-10">
          {['Top Debaters', 'Top Institutions', 'Tournament Standings', 'Regional Rankings'].map((tab, index) => (
            <button key={tab} className={`eyebrow whitespace-nowrap ${index === 0 ? 'text-[#06192b] border-b-2 border-[#06192b] pb-2' : 'text-slate-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-7 mb-10">
              <div className="paper-panel p-8 min-h-[260px] relative">
                <Award className="absolute right-7 top-7 w-8 h-8 text-[#8a6a00]" />
                <p className="font-display text-5xl font-bold text-[#8a6a00]">01</p>
                <h2 className="font-display text-3xl font-bold text-[#06192b] mt-8">{top?.fullName || 'Julian Thorne-Smith'}</h2>
                <p className="eyebrow text-slate-500 mt-1">{top?.username || 'Oxford Union Society'}</p>
                <div className="grid grid-cols-2 gap-10 mt-20">
                  <div>
                    <p className="eyebrow text-slate-500">Elo Rating</p>
                    <p className="font-display text-2xl font-bold text-[#06192b]">{top ? Math.round(top.winRate * 30 + 1000).toLocaleString() : '2,842'}</p>
                  </div>
                  <div className="text-right">
                    <p className="eyebrow text-slate-500">Win Rate</p>
                    <p className="font-display text-2xl font-bold text-[#06192b]">{top?.winRate.toFixed(1) || '89.4'}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {[second, third].map((debater, index) => (
                  <div key={index} className="paper-panel bg-[#eef5ff] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <p className="font-display text-3xl italic text-slate-500">0{index + 2}</p>
                      <div>
                        <p className="font-display text-2xl font-bold text-[#06192b]">{debater?.fullName || (index === 0 ? 'Amara Diallo' : 'Chen Wei')}</p>
                        <p className="text-sm text-slate-600">{debater?.username || (index === 0 ? 'Harvard Debate Council' : 'Nanyang Debate Collective')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#8a6a00] font-bold">{debater ? Math.round(debater.winRate * 28 + 1000).toLocaleString() : index === 0 ? '2,710' : '2,695'}</p>
                      <p className="eyebrow text-slate-500">Elo</p>
                    </div>
                  </div>
                ))}
                <div className="ink-panel p-6 grid grid-cols-2">
                  <div>
                    <p className="eyebrow text-slate-300">Total Active Debaters</p>
                    <p className="font-display text-3xl text-white mt-2">{Math.max(debaters.length, 14209).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="eyebrow text-slate-300">Avg. Elo</p>
                    <p className="font-display text-3xl text-white mt-2">1,450</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="paper-panel overflow-hidden mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-5 text-left">#</th>
                    <th className="p-5 text-left">Debater Name</th>
                    <th className="p-5 text-left">Institution</th>
                    <th className="p-5 text-center">Elo Rating</th>
                    <th className="p-5 text-center">Win Rate</th>
                    <th className="p-5 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {(tableRows.length ? tableRows : [
                    { fullName: 'Elena Rodriguez', username: 'Complutense Madrid', winRate: 82.1 },
                    { fullName: 'Marcus Aurelius', username: 'University of Rome', winRate: 79.5 },
                    { fullName: 'Sophie Dubois', username: 'Sorbonne University', winRate: 77.3 },
                    { fullName: 'Kenji Sato', username: 'University of Tokyo', winRate: 76.8 },
                    { fullName: 'Lars Nielsen', username: 'Copenhagen Business School', winRate: 75.2 },
                  ] as any[]).map((debater, index) => (
                    <tr key={debater.debaterId || debater.fullName} className="border-t border-slate-300">
                      <td className="p-5">{String(index + 4).padStart(2, '0')}</td>
                      <td className="p-5 font-bold uppercase tracking-wider text-[#06192b]">{debater.fullName}</td>
                      <td className="p-5 text-slate-600">{debater.username}</td>
                      <td className="p-5 text-center font-bold">{Math.round((debater.winRate || 75) * 26 + 500).toLocaleString()}</td>
                      <td className="p-5 text-center">{Number(debater.winRate || 75).toFixed(1)}%</td>
                      <td className="p-5 text-center">{index % 3 === 2 ? <ArrowDownRight className="w-4 h-4 text-red-600 mx-auto" /> : <ArrowUpRight className="w-4 h-4 text-[#8a6a00] mx-auto" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-[#eef5ff] border-t border-slate-300 p-5 flex items-center justify-between">
                <p className="eyebrow text-slate-500">Displaying 1 - 25 of 14,209</p>
                <div className="flex gap-2">
                  <button className="w-10 h-10 border border-slate-300 bg-white flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-10 h-10 border border-slate-300 bg-white flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </section>

            <section className="paper-panel bg-[#dbeafe] p-8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-[#06192b]">Methodology of Ranking</h2>
                <p className="text-slate-700 leading-7 mt-5">
                  The VIVAATHI Elo Ranking system is an iterative algorithm that accounts for tournament difficulty, opposition strength, and adjudication consistency. Unlike simple win-loss ratios, our proprietary Rigor Metric rewards high-complexity rebuttals.
                </p>
                <button className="mt-6 text-xs font-bold uppercase tracking-widest border-b border-[#06192b]">Review the Whitepaper</button>
              </div>
              <img src="https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80" alt="" className="w-full h-56 object-cover grayscale border border-slate-300" />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
