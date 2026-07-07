import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <header className="flex justify-between items-center h-16 px-container-padding w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest dark:border-outline-variant">
      {/* Mobile Brand (Hidden on Desktop) */}
      <div className="lg:hidden flex items-center gap-2">
        <button className="p-2 text-on-surface hover:bg-surface-variant rounded-full transition-colors mr-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary dark:text-primary-fixed">EduManage</span>
      </div>
      
      {/* Search Bar - Centers on Desktop */}
      <div className="hidden lg:flex flex-1 items-center gap-4">
         <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all w-64" placeholder="Search..." type="text" />
        </div>
      </div>
      
      {/* Actions Right */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all rounded-full relative group">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-2 w-2 h-2 bg-error rounded-full group-hover:animate-pulse" />
        </button>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-error hover:bg-error-container/20 hover:text-error transition-all rounded-full flex items-center gap-2"
          title="Logout"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>

        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-outline-variant hover:border-outline transition-colors bg-surface-container-lowest">
          <span className="font-label-md text-label-md text-primary pl-2 hidden sm:block">Profile</span>
          <img alt="User Avatar" className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDJPTfesukZreTrsxPpngV2pLamjppft1ojW0PdSxD_Gq0VNHKlG_uLYvSDgGRj8XMICxAXr7JVuakEjm5x5fdRL6uN9yT5UZjOxIZyet_XvPao5TJ9s3c2nABw7lCqb4N8nHkS30vb7MaBmiICLeJXqMD_onX0Kql037f8cqhWDiK56m1SWrfHmtoIGqlKU_7cq1rVZO2asVIIi0uq3vII6URWTmeCXxq16tI6YveDIRqgL26PNjW_dxwj7c8yuP1fpwr5nmU4S8" />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
