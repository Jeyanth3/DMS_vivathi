import { useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { Swords, Twitter, Github, Linkedin, Instagram, Mail, Send } from 'lucide-react';
=======
import { Link, useLocation } from 'react-router-dom';
import { Twitter, Github, Linkedin, Instagram, Mail, Send, Loader2 } from 'lucide-react';
import { newsletterAPI } from '../../api';
>>>>>>> f344c79472462de7bd57a4a2007efe1ce1bb241d

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
    <footer className="border-t border-white/10 bg-gray-950/80 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Social Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="VIVAATHI" className="w-9 h-9 rounded-xl" />
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">VIVAATHI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier platform for managing debate tournaments, tracking scores, and building the next generation of great debaters.
            </p>
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
=======
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-slate-300 flex items-center justify-center text-slate-500 hover:text-[#06192b] hover:bg-[#eef5ff] transition-all duration-200"
                >
>>>>>>> f344c79472462de7bd57a4a2007efe1ce1bb241d
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to}
<<<<<<< HEAD
                    className="text-gray-400 hover:text-white text-sm transition-colors">
=======
                    onClick={handleQuickLinkClick}
                    className="text-slate-600 hover:text-[#06192b] text-sm transition-colors">
>>>>>>> f344c79472462de7bd57a4a2007efe1ce1bb241d
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to}
<<<<<<< HEAD
                    className="text-gray-400 hover:text-white text-sm transition-colors">
=======
                    onClick={() => handleSupportLinkClick(link.hash)}
                    className="text-slate-600 hover:text-[#06192b] text-sm transition-colors">
>>>>>>> f344c79472462de7bd57a4a2007efe1ce1bb241d
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="mailto:support@vivaathi.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                  <Mail className="w-3.5 h-3.5" /> support@vivaathi.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest tournament news and debate tips delivered to your inbox.
            </p>
            {subscribed ? (
<<<<<<< HEAD
              <div className="glass rounded-xl px-4 py-3 text-green-400 text-sm">
                ✓ You're subscribed! Thanks.
=======
              <div className="glass px-4 py-3 text-emerald-800 border border-emerald-300 text-sm font-medium bg-emerald-50">
                {message || 'You are subscribed. Thanks!'}
>>>>>>> f344c79472462de7bd57a4a2007efe1ce1bb241d
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

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 VIVAATHI. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Built for the debate community, by debaters.
          </p>
        </div>
      </div>
    </footer>
  );
}
