import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
<div>
  {/* Navbar */}
  <header className="bg-surface-container-lowest border-b border-surface-container-highest sticky top-0 z-50 transition-all duration-300" id="main-nav">
    <div className="max-w-[1280px] mx-auto px-4 md:px-container-padding h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-3xl" data-weight="fill" style={{fontVariationSettings: '"FILL" 1'}}>school</span>
        <span className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">EduManage</span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
        <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#about">About</a>
        <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#contact">Contact</a>
      </nav>
      <div className="flex items-center gap-4">
        <button className="hidden md:block font-label-md text-label-md text-primary hover:text-primary-container px-4 py-2 transition-colors" onClick={() => navigate("/login")}>Log In</button>
        <button className="bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md text-label-md px-6 py-2 rounded-lg transition-colors shadow-sm" onClick={() => navigate("/login")}>Get Started</button>
        <button className="md:hidden text-on-surface-variant p-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>
  </header>
  {/* Hero Section */}
  <main className="flex-grow">
    <section className="relative pt-20 pb-32 overflow-hidden bg-surface-container-lowest">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary-container opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-secondary-container opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-4 md:px-container-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm text-primary">Academic Portal v2.0 Live</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary md:text-[48px] md:leading-[56px] lg:text-[56px] lg:leading-[64px] font-extrabold max-w-2xl">
              A modern course management system for lecturers and students
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Manage courses, assignments, attendance, grades, and learning materials in one unified, secure platform designed for high-stakes academic environments.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md text-label-md px-8 py-3.5 rounded-lg transition-all duration-200 shadow-sm flex items-center gap-2 group" onClick={() => navigate("/login")}>
                Login
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button className="bg-transparent border-2 border-primary text-primary hover:bg-primary/5 font-label-md text-label-md px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2" onClick={() => navigate("/admin/dashboard")}>
                View Demo
              </button>
            </div>
            <div className="pt-8 flex items-center gap-6 text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Enterprise Security
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">speed</span>
                High Performance
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                24/7 Support
              </div>
            </div>
          </div>
          {/* Hero Visual (Abstract Dashboard Preview) */}
          <div className="relative lg:h-[600px] w-full flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-highest to-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(0,17,58,0.08)] border border-surface-container-highest overflow-hidden transform md:rotate-2 md:scale-105 transition-transform duration-700 hover:rotate-0">
              {/* Abstract UI Mockup */}
              <div className="flex h-full w-full bg-surface-container-lowest">
                {/* Sidebar Mockup */}
                <div className="w-16 md:w-48 border-r border-surface-container-highest bg-surface-bright flex flex-col p-4 gap-4">
                  <div className="h-6 w-full bg-primary/10 rounded mb-4" />
                  <div className="h-4 w-3/4 bg-surface-container-highest rounded" />
                  <div className="h-4 w-full bg-surface-container-highest rounded" />
                  <div className="h-4 w-5/6 bg-surface-container-highest rounded" />
                  <div className="h-4 w-full bg-surface-container-highest rounded" />
                </div>
                {/* Main Content Mockup */}
                <div className="flex-1 p-6 flex flex-col gap-6 bg-surface">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-8 w-40 bg-surface-container-highest rounded" />
                    <div className="h-8 w-8 rounded-full bg-primary/20" />
                  </div>
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-20 bg-surface-container-lowest rounded-lg border border-surface-container-highest p-3 flex flex-col gap-2">
                      <div className="h-3 w-1/2 bg-surface-container-highest rounded" />
                      <div className="h-6 w-3/4 bg-primary/10 rounded" />
                    </div>
                    <div className="h-20 bg-surface-container-lowest rounded-lg border border-surface-container-highest p-3 flex flex-col gap-2">
                      <div className="h-3 w-1/2 bg-surface-container-highest rounded" />
                      <div className="h-6 w-2/3 bg-tertiary-fixed/40 rounded" />
                    </div>
                    <div className="h-20 hidden md:flex bg-surface-container-lowest rounded-lg border border-surface-container-highest p-3 flex-col gap-2">
                      <div className="h-3 w-1/2 bg-surface-container-highest rounded" />
                      <div className="h-6 w-5/6 bg-secondary-container/40 rounded" />
                    </div>
                    <div className="h-20 hidden md:flex bg-surface-container-lowest rounded-lg border border-surface-container-highest p-3 flex-col gap-2">
                      <div className="h-3 w-1/2 bg-surface-container-highest rounded" />
                      <div className="h-6 w-1/2 bg-error-container/40 rounded" />
                    </div>
                  </div>
                  {/* Chart/List Area */}
                  <div className="flex-1 bg-surface-container-lowest rounded-lg border border-surface-container-highest p-4 flex gap-4">
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="h-4 w-32 bg-surface-container-highest rounded mb-2" />
                      <div className="h-8 w-full bg-surface-container rounded" />
                      <div className="h-8 w-full bg-surface-container rounded" />
                      <div className="h-8 w-full bg-surface-container rounded" />
                      <div className="h-8 w-full bg-surface-container rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Features Section (Bento Grid Style) */}
    <section className="py-24 bg-surface" id="features">
      <div className="max-w-[1280px] mx-auto px-4 md:px-container-padding">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="font-headline-xl text-headline-xl text-primary mb-4">Everything you need to run your institution</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">A comprehensive suite of tools built for the complexities of modern education.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-card-gap">
          {/* Feature 1: Course Management */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-8 hover:border-primary/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6 relative z-10">
              <span className="material-symbols-outlined text-primary-container text-[24px]">school</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-3 relative z-10">Course Management</h3>
            <p className="font-body-md text-body-md text-on-surface-variant relative z-10">Organize curriculums, manage enrollments, and distribute learning materials seamlessly across departments.</p>
          </div>
          {/* Feature 2: Assignment Tracking */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-8 hover:border-primary/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="w-12 h-12 rounded-lg bg-secondary-container/30 flex items-center justify-center mb-6 relative z-10">
              <span className="material-symbols-outlined text-secondary text-[24px]">assignment</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-3 relative z-10">Assignment Tracking</h3>
            <p className="font-body-md text-body-md text-on-surface-variant relative z-10">Automate submissions, track deadlines, and run integrated plagiarism checks in real-time.</p>
          </div>
          {/* Feature 3: Attendance Monitoring */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-8 hover:border-primary/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center mb-6 relative z-10">
              <span className="material-symbols-outlined text-on-tertiary-fixed text-[24px]">calendar_today</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-3 relative z-10">Attendance Monitoring</h3>
            <p className="font-body-md text-body-md text-on-surface-variant relative z-10">Record presence instantly with QR codes or biometric integration. Generate automated compliance reports.</p>
          </div>
          {/* Feature 4: Grade Reports */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-8 hover:border-primary/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center mb-6 relative z-10">
              <span className="material-symbols-outlined text-on-primary text-[24px]">grade</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-3 relative z-10">Grade Reports</h3>
            <p className="font-body-md text-body-md text-on-surface-variant relative z-10">Calculate complex weighted averages automatically. Export secure, verifiable transcripts with one click.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  {/* Footer */}
  <footer className="bg-surface-container-lowest border-t border-surface-container-highest py-12">
    <div className="max-w-[1280px] mx-auto px-4 md:px-container-padding">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" data-weight="fill" style={{fontVariationSettings: '"FILL" 1'}}>school</span>
          <span className="font-headline-md text-headline-md text-primary font-bold">EduManage</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
          © 2024 EduManage Systems. All rights reserved. Built for Academic Excellence.
        </p>
        <div className="flex gap-4">
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" to="/">Privacy</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" to="/">Terms</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" to="/">Support</Link>
        </div>
      </div>
    </div>
  </footer>
</div>

    </>
  );
};

export default LandingPage;
