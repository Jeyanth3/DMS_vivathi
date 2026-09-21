import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '../types';
import SessionChangedModal from '../components/common/SessionChangedModal';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  selectedRole: Role | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setSelectedRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('dms_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('dms_token')
  );

  const [selectedRole, setSelectedRoleState] = useState<Role | null>(() =>
    (localStorage.getItem('dms_selected_role') as Role) || null
  );

  const [sessionModal, setSessionModal] = useState<{
    isOpen: boolean;
    newUsername?: string;
    isLoggedOut?: boolean;
  }>({ isOpen: false });

  const login = useCallback((tok: string, usr: User) => {
    localStorage.setItem('dms_token', tok);
    localStorage.setItem('dms_user', JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dms_token');
    localStorage.removeItem('dms_user');
    localStorage.removeItem('dms_selected_role');
    setToken(null);
    setUser(null);
    setSelectedRoleState(null);
  }, []);

  const setSelectedRole = useCallback((role: Role) => {
    localStorage.setItem('dms_selected_role', role);
    setSelectedRoleState(role);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('dms_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'dms_token' || e.key === 'dms_user' || e.key === 'dms_selected_role') {
        const newToken = localStorage.getItem('dms_token');
        let newUser: User | null = null;
        try {
          const storedUser = localStorage.getItem('dms_user');
          newUser = storedUser ? JSON.parse(storedUser) : null;
        } catch {
          newUser = null;
        }
        const newRole = (localStorage.getItem('dms_selected_role') as Role) || null;

        // Check if user changed or logged out
        const hasTokenChanged = newToken !== token;
        const hasUserChanged = newUser?.id !== user?.id;

        // Update state in current tab
        setToken(newToken);
        setUser(newUser);
        setSelectedRoleState(newRole);

        if (hasTokenChanged || hasUserChanged) {
          if (!newToken || !newUser) {
            setSessionModal({ isOpen: true, isLoggedOut: true });
          } else {
            setSessionModal({
              isOpen: true,
              newUsername: newUser.username || newUser.fullName,
              isLoggedOut: false,
            });
          }
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [token, user]);

  return (
    <AuthContext.Provider value={{
      user, token, selectedRole,
      isAuthenticated: !!token && !!user,
      login, logout, setSelectedRole, updateUser,
    }}>
      {children}
      <SessionChangedModal
        isOpen={sessionModal.isOpen}
        newUsername={sessionModal.newUsername}
        isLoggedOut={sessionModal.isLoggedOut}
        onClose={() => setSessionModal({ isOpen: false })}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

