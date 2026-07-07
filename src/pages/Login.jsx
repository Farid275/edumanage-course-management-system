import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'lecturer') navigate('/lecturer/dashboard', { replace: true });
      else navigate('/student/dashboard', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      login(email, selectedRole);
    }, 600);
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

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selector - Now visible for both Sign Up and Login */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container-low rounded-lg border border-outline-variant/30 mb-6">
              <label className="cursor-pointer relative">
                <input 
                  className="peer sr-only" 
                  name="role" 
                  type="radio" 
                  value="student" 
                  checked={selectedRole === 'student'}
                  onChange={() => setSelectedRole('student')}
                />
                <div className="text-center py-2 rounded font-label-md text-label-md text-on-surface-variant peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm transition-all">
                  Student
                </div>
              </label>
              <label className="cursor-pointer relative">
                <input 
                  className="peer sr-only" 
                  name="role" 
                  type="radio" 
                  value="lecturer"
                  checked={selectedRole === 'lecturer'}
                  onChange={() => setSelectedRole('lecturer')}
                />
                <div className="text-center py-2 rounded font-label-md text-label-md text-on-surface-variant peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm transition-all">
                  Lecturer
                </div>
              </label>
              <label className="cursor-pointer relative">
                <input 
                  className="peer sr-only" 
                  name="role" 
                  type="radio" 
                  value="admin"
                  checked={selectedRole === 'admin'}
                  onChange={() => setSelectedRole('admin')}
                />
                <div className="text-center py-2 rounded font-label-md text-label-md text-on-surface-variant peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm transition-all">
                  Admin
                </div>
              </label>
            </div>

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
                onClick={() => setIsSignUp(!isSignUp)}
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
