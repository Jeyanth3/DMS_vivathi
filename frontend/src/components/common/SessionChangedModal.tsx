import { ShieldAlert, RefreshCw, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  newUsername?: string;
  isLoggedOut?: boolean;
  onClose: () => void;
}

export default function SessionChangedModal({ isOpen, newUsername, isLoggedOut, onClose }: Props) {
  if (!isOpen) return null;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-dark rounded-2xl p-6 w-full max-w-md border border-amber-500/30 shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              {isLoggedOut ? 'Session Expired / Logged Out' : 'User Account Switched'}
            </h3>
            <p className="text-gray-300 text-sm mt-2 leading-relaxed">
              {isLoggedOut ? (
                <span>You were logged out in another browser tab.</span>
              ) : (
                <span>
                  Another browser tab updated your login session. You are now logged in as{' '}
                  <strong className="text-amber-300">{newUsername || 'another user'}</strong>.
                </span>
              )}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Please reload the page to update your active view and permissions.
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex-1 text-sm font-medium"
            >
              Acknowledge
            </button>
            <button
              onClick={handleReload}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-all flex items-center justify-center gap-2 flex-1 text-sm shadow-lg shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
