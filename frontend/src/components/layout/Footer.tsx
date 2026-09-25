import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Twitter, Github, Linkedin, Instagram, Mail, Send, Loader2 } from 'lucide-react';
import { newsletterAPI } from '../../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const location = useLocation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.trim()) return;

    setSubscribing(true);
    setMessage('');
    try {
      const res = await newsletterAPI.subscribe(email.trim());
      setSubscribed(true);
      setMessage(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to subscribe. Please try again.';
      setMessage(errorMsg);
    } finally {
      setSubscribing(false);
    }
  };

  const handleQuickLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSupportLinkClick = (hash: string) => {
    if (location.pathname === '/about') {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  const quickLinks = [
    { label: 'Tournaments', to: '/' },
    { label: 'Forums', to: '/forum' },
    { label: 'Ranking', to: '/scoring' },
    { label: 'About', to: '/about' },
  ];

  const supportLinks = [
    { label: 'Contact Us', to: '/about#contact', hash: '#contact' },
    { label: 'FAQ', to: '/about#faq', hash: '#faq' },
  ];

  return (
    <footer className="border-t border-slate-300 bg-white/85 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Social Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="VIVAATHI" className="w-9 h-9 border border-[#06192b]/20" />
              <span className="font-display font-bold text-xl text-[#06192b]">VIVAATHI</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              The premier platform for managing debate tournaments, tracking scores, and building the next generation of great debaters.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-slate-300 flex items-center justify-center text-slate-500 hover:text-[#06192b] hover:bg-[#eef5ff] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="eyebrow text-[#06192b] mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to}
                    onClick={handleQuickLinkClick}
                    className="text-slate-600 hover:text-[#06192b] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="eyebrow text-[#06192b] mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to}
                    onClick={() => handleSupportLinkClick(link.hash)}
                    className="text-slate-600 hover:text-[#06192b] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="mailto:support@vivaathi.com"
                  className="flex items-center gap-2 text-slate-600 hover:text-[#06192b] text-sm transition-colors">
                  <Mail className="w-3.5 h-3.5" /> support@vivaathi.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="eyebrow text-[#06192b] mb-4">Stay Updated</h4>
            <p className="text-slate-600 text-sm mb-4">
              Get the latest tournament news and debate tips delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="glass px-4 py-3 text-emerald-800 border border-emerald-300 text-sm font-medium bg-emerald-50">
                {message || 'You are subscribed. Thanks!'}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={subscribing}
                  className="input-field text-sm"
                />
                {message && !subscribed && (
                  <p className="text-xs text-red-600">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={subscribing}
                  className="w-full btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {subscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Subscribe
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-300 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 VIVAATHI. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            Built for the debate community, by debaters.
          </p>
        </div>
      </div>
    </footer>
  );
}
