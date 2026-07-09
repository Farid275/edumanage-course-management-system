import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, login, signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && role) {
      console.log('Login: User is already logged in with role:', role);
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'lecturer') navigate('/lecturer/dashboard', { replace: true });
      else navigate('/student/dashboard', { replace: true });
    }
  }, [loading, user, role, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-surface-container-lowest gap-4">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
        <p className="font-body-md text-on-surface-variant">Checking session...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const defaultFullName = email.split('@')[0].split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
        
        const { data, error } = await signUp(email, password, {
          data: {
            full_name: defaultFullName
          }
        });
        
        if (error) throw error;
        
        setSuccessMsg('Account created successfully. Student access has been assigned by default.');
        setIsSignUp(false);
        setPassword('');
      } else {
        const { error } = await login(email, password);
        if (error) {
          if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
            throw new Error("Email not confirmed. Please confirm your email or disable email confirmation for development.");
          }
          throw error;
        }
        setSuccessMsg('');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message);
      setSuccessMsg(''); // Clear success messages when a new error appears
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full min-h-screen items-center justify-center bg-surface-container-lowest py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[440px] bg-white border border-surface-container-highest rounded-2xl shadow-sm p-8 sm:p-10">
          
          {/* Brand Logo */}
          <div className="mb-10 flex items-center justify-center gap-base">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{fontVariationSettings: '"FILL" 1'}}>school</span>
            </div>
            <span className="font-headline-lg text-headline-lg text-primary">EduManage</span>
          </div>
          
          {/* Welcome Text */}
          <div className="mb-8 text-center">
            <h1 className="font-headline-xl text-headline-xl text-primary mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {isSignUp ? 'Sign up for your academic portal.' : 'Sign in to your academic portal.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container text-body-md rounded-lg text-center">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 p-4 bg-primary-container text-on-primary-container text-body-md rounded-lg text-center">
              {successMsg}
            </div>
          )}

          {isSignUp && (
            <div className="mb-6 p-4 bg-surface-container-low text-on-surface-variant text-body-sm rounded-lg border border-outline-variant/30 text-center">
              Only students can register themselves. Admin and lecturer accounts are created by the system administrator.
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Email Input */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="email">Institutional Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" 
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-outline-variant/60 rounded-lg bg-white placeholder-on-surface-variant/50 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-shadow" 
                  id="email" 
                  name="email" 
                  placeholder="name@university.edu" 
                  required 
                  type="email" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                {!isSignUp && (
                  <Link className="font-label-md text-label-md text-secondary hover:text-primary transition-colors" to="/login">Forgot Password?</Link>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" 
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-outline-variant/60 rounded-lg bg-white placeholder-on-surface-variant/50 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-shadow" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-tertiary-fixed bg-tertiary-fixed hover:bg-tertiary-fixed-dim focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-fixed transition-colors duration-200 disabled:opacity-50" 
                type="submit"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                ) : (
                  <>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
