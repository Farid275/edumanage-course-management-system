import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (currentSession?.user) {
          console.log("AuthContext: Session loaded for user", currentSession.user.id);
          const userProfile = await fetchProfile(currentSession.user.id);
          
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession.user);
            if (userProfile) {
              setProfile(userProfile);
              setRole(userProfile.role);
            }
          }
        }
      } catch (err) {
        console.error("AuthContext: Error fetching session on mount:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("AuthContext: Auth event:", event);
      if (newSession?.user) {
        const userProfile = await fetchProfile(newSession.user.id);
        if (mounted) {
          setSession(newSession);
          setUser(newSession.user);
          if (userProfile) {
            setProfile(userProfile);
            setRole(userProfile.role);
          }
          setLoading(false);
        }
      } else {
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('AuthContext: Error fetching profile:', error);
      }

      if (data) {
        console.log("AuthContext: Profile fetched. Role detected:", data.role);
        return data;
      }
    } catch (err) {
      console.error('AuthContext: Unexpected error fetching profile:', err);
    }
    return null;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileData) {
      await supabase.auth.signOut();
      return { error: new Error('Profile not found. Please contact admin.') };
    }

    return { data };
  };
  
  const signUp = async (email, password, options) => {
    return await supabase.auth.signUp({ email, password, options });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    role,
    loading,
    login,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-surface gap-4">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
          <p className="font-body-md text-on-surface-variant">Checking session...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};
