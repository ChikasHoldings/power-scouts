import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({});
  const authResolved = useRef(false);
  const profileFetchInProgress = useRef(false);
  // Store the userId that needs a profile fetch — triggered by a separate useEffect
  const [pendingProfileUserId, setPendingProfileUserId] = useState(null);

  /**
   * Load the signed-in user's profile.
   *
   * The outcome has to be recorded, not just logged. AdminRoute holds the panel
   * on its boot screen until a profile arrives, so a fetch that finishes
   * without one used to leave the whole admin panel on a full-viewport spinner
   * for ever: the error was written to the console, `isLoadingProfile` went
   * false in the finally, `profile` stayed null, and the boot condition stayed
   * true with nothing left to change it. No error, no retry, no way out.
   *
   * PGRST116 is the same dead end by a different route. It means the query
   * succeeded and matched no row — an authenticated account with no profile
   * record — which is not a transport error but is still "no profile", so it
   * has to end the wait rather than extend it.
   */
  const fetchProfile = useCallback(async (userId) => {
    // Prevent duplicate concurrent fetches
    if (profileFetchInProgress.current) return;
    profileFetchInProgress.current = true;

    try {
      setIsLoadingProfile(true);
      setProfileError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch failed:', error);
        setProfileError(error.message || 'Your profile could not be loaded.');
      } else if (!data) {
        setProfileError('This account has no profile record, so its role cannot be determined.');
      }

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setProfileError(err?.message || 'Your profile could not be loaded.');
    } finally {
      setIsLoadingProfile(false);
      profileFetchInProgress.current = false;
    }
  }, []);

  /** Re-run the profile fetch, for the retry offered when it failed. */
  const refreshProfile = useCallback(() => {
    if (user?.id) fetchProfile(user.id);
  }, [user, fetchProfile]);

  // Separate useEffect to handle profile fetching — avoids deadlock with onAuthStateChange
  useEffect(() => {
    if (pendingProfileUserId) {
      fetchProfile(pendingProfileUserId);
      setPendingProfileUserId(null);
    }
  }, [pendingProfileUserId, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout — if auth hasn't resolved in 10 seconds, force loading to false
    const safetyTimer = setTimeout(() => {
      if (isMounted && !authResolved.current) {
        console.warn('Auth loading safety timeout reached — forcing resolution');
        authResolved.current = true;
        setIsLoadingAuth(false);
        setIsLoadingProfile(false);
        profileFetchInProgress.current = false;
      }
    }, 10000);

    // Listen for auth state changes (login, logout, token refresh, initial session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          setIsLoadingProfile(true); // Set loading immediately so UI shows loading state
          
          // Mark auth as resolved
          authResolved.current = true;
          setIsLoadingAuth(false);
          
          // Trigger profile fetch via state change — NOT inside this callback
          // This avoids a deadlock where supabase.from() waits for onAuthStateChange to return
          setPendingProfileUserId(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
          authResolved.current = true;
          setIsLoadingAuth(false);
          setIsLoadingProfile(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        } else if (event === 'INITIAL_SESSION' && !session) {
          // No existing session
          authResolved.current = true;
          setIsLoadingAuth(false);
          setIsLoadingProfile(false);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // onAuthStateChange will fire SIGNED_IN and handle profile fetch
      return data;
    } catch (error) {
      setAuthError({ type: 'login_failed', message: error.message });
      throw error;
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      setAuthError({ type: 'signup_failed', message: error.message });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      setAuthError({ type: 'oauth_failed', message: error.message });
      throw error;
    }
  };

  /**
   * Sign out, and by default leave for the public homepage.
   *
   * The one place in the app where a full page load is the right call rather
   * than a router navigation: it discards the React Query cache along with
   * everything else, and that cache holds leads, buyers and customer contact
   * details fetched under the session being ended. A soft navigation would
   * leave all of it in memory for whoever sits down next.
   */
  const logout = async (shouldRedirect = true) => {
    // Signing out locally cannot be conditional on the network call
    // succeeding. This used to clear the session state and redirect inside the
    // try, so a signOut that rejected — an expired refresh token, a dropped
    // connection — left the operator on a fully populated admin panel with
    // nothing said and nothing changed. They walk away believing they have
    // logged out, and the session the comment above worries about stays open
    // with the leads, buyers and customer contact details it fetched.
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setProfile(null);
      setProfileError(null);
      setIsAuthenticated(false);
      if (shouldRedirect) {
        window.location.href = '/';
      }
    }
  };


  // Manually re-check the session (used by checkAppState)
  const checkSession = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setAuthError({ type: 'session_error', message: error.message });
        setIsLoadingAuth(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        await fetchProfile(session.user.id);
      }

      setIsLoadingAuth(false);
    } catch (error) {
      setAuthError({ type: 'unknown', message: error.message });
      setIsLoadingAuth(false);
    }
  };

  // Check if current user is admin
  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated,
      isLoadingAuth,
      isLoadingProfile,
      profileError,
      refreshProfile,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      isAdmin,
      login,
      signUp,
      loginWithGoogle,
      logout,
      checkAppState: checkSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
