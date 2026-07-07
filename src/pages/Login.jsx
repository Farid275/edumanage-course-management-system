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
      <div className="flex w-full h-full">
        {/* Left Side: Form Area */}
        <div className="flex-1 flex flex-col justify-center px-container-padding sm:px-12 md:px-24 lg:px-32 xl:px-48 bg-surface-container-lowest border-r border-surface-container-highest z-10 relative shadow-[0_0_30px_rgba(0,0,0,0.05)]">
          <div className="max-w-md w-full mx-auto">
            {/* Brand Logo */}
            <div className="mb-12 flex items-center gap-base">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{fontVariationSettings: '"FILL" 1'}}>school</span>
              </div>
              <span className="font-headline-lg text-headline-lg text-primary">EduManage</span>
            </div>
            
            {/* Welcome Text */}
            <div className="mb-8">
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

        {/* Right Side: Visual Context */}
        <div className="hidden lg:flex flex-1 relative bg-primary overflow-hidden items-center justify-center">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
            <div className="bg-cover bg-center w-full h-full" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJgtjg6stp-lfeja-MDz8qgwqlBfW21jdduQ38HcZGSY64bHwaKqkUB9TtbZuwIeys1HJ4nlffQ_A0yVyAATHGt5haxpUe7SkpU3zojqACF9FyBDSu-5GeGnD3t9zdnsPn2OfhBwn6iNWmD9n5icfkMAA9wvdNry0lF1wsSUpG9K8My3FVXyzw_t2qv-AUIHcY2YK37DDrxpcEkgdUYfpZhaBMnmzKd5DQikvG-z6IEAWkdaCziytrDZgP2S37bFUm4wOBPV8J6zo")'}} />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/90 to-primary-container/90" />
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] rounded-full border-[40px] border-secondary-container/10 blur-3xl" />
            <div className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] rounded-full border-[20px] border-tertiary-fixed/10 blur-2xl" />
          </div>
          <div className="z-10 w-full max-w-2xl px-12 transform translate-x-12">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white" style={{fontVariationSettings: '"FILL" 1'}}>bar_chart</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-white">System Overview</h3>
                    <p className="font-body-sm text-body-sm text-primary-fixed-dim">Academic Performance Metrics</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-tertiary-fixed/20 border border-tertiary-fixed/30 text-tertiary-fixed font-label-sm text-label-sm">
                  Live Data
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary-container/40 border border-white/10 rounded-lg p-4">
                  <span className="material-symbols-outlined text-secondary-fixed mb-2">group</span>
                  <div className="font-headline-lg text-headline-lg text-white mb-1">12,450</div>
                  <div className="font-label-sm text-label-sm text-primary-fixed-dim">Active Students</div>
                </div>
                <div className="bg-primary-container/40 border border-white/10 rounded-lg p-4">
                  <span className="material-symbols-outlined text-tertiary-fixed mb-2">assignment</span>
                  <div className="font-headline-lg text-headline-lg text-white mb-1">98.2%</div>
                  <div className="font-label-sm text-label-sm text-primary-fixed-dim">Submission Rate</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm text-white mb-2">
                    <span>Server Capacity</span>
                    <span>45%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed w-[45%] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm text-white mb-2">
                    <span>Database Sync</span>
                    <span>99%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary-fixed w-[99%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-12 bg-white rounded-lg p-4 shadow-xl border border-surface-container-highest animate-bounce" style={{animationDuration: '3s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDirection: 'alternate'}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">System Status</div>
                  <div className="font-label-sm text-label-sm text-secondary">All operational</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
