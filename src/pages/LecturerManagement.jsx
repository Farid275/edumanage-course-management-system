import React from 'react';
import SummaryCard from '../components/SummaryCard';
import { lecturers } from '../data/dummyData';
import { Link, useNavigate } from 'react-router-dom';

const LecturerManagement = () => {
  const navigate = useNavigate();
  return (
    <>
{/* TopNavBar */}
    <header className="flex justify-between items-center h-16 px-container-padding w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest dark:border-outline-variant">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary dark:text-primary-fixed">EduManage</span>
      </div>
      {/* Search Bar (on_left in TopNavBar config) */}
      <div className="hidden lg:flex items-center bg-surface-container-low border border-surface-container-highest rounded-full px-4 py-2 w-96 focus-within:border-secondary-container focus-within:ring-2 focus-within:ring-secondary-container/20 transition-all">
        <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
        <input className="bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface w-full focus:ring-0 placeholder:text-outline p-0" placeholder="Search lecturers, departments..." type="text" />
      </div>
      <div className="flex items-center gap-6 ml-auto">
        <button className="text-on-surface-variant hover:text-primary transition-all relative group">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface group-hover:scale-95 duration-150" />
        </button>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <img className="w-8 h-8 rounded-full object-cover border border-outline-variant" data-alt="A professional headshot of a middle-aged academic administrator wearing glasses and a navy blue suit. The background is a brightly lit, modern university office with blurred books on shelves. Clean, bright, and professional lighting suitable for an academic software platform avatar." src="https://lh3.googleusercontent.com/aida-public/AB6AXuADC_zt-eSmXrfHFdMvNo3iDTW1IDeZHiuXN5diu4deqX2CdkMzdfSzpn36xoF3P_rgeFWRAMT8Hi3sezOmahP85YgYe_siujhcNGD4eLR5G46XzVuevywTmUa-l-zkJY8MnGh0ysmjdWWiqb5fefowEs0leU2lLN-HMtlzlcW6nG7-Rsxw6cbH1oGF6ZztAXtUUhGNOP-Yie7kqqCWrNg4fSdETKvZPIOsd3F2Thkk3NidThCZjrzQnlcSJ_pOLVPDFKTxuzUqreM" />
          <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">Profile</span>
        </div>
      </div>
    </header>
    {/* Page Content */}
    <div className="p-container-padding flex-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Lecturers</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage faculty members, assignments, and departmental roles.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors w-full md:w-auto">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed rounded-lg font-label-md text-label-md transition-colors shadow-sm w-full md:w-auto">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Lecturer
          </button>
        </div>
      </div>
      {/* Content Area - Table */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-bright border-b border-surface-container-highest">
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold sticky top-0">Name</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold sticky top-0">ID</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold sticky top-0">Department</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold sticky top-0 hidden md:table-cell">Assigned Courses</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold sticky top-0">Status</th>
                <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold sticky top-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {lecturers.map(lecturer => (
              <tr key={lecturer.id} className="hover:bg-surface-bright/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {lecturer.avatar ? (
                      <img className="w-10 h-10 rounded-full object-cover" src={lecturer.avatar} />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${lecturer.bgClass} flex items-center justify-center font-headline-md text-headline-md`}>{lecturer.initials}</div>
                    )}
                    <div>
                      <div className="font-label-md text-label-md text-primary group-hover:text-secondary-container transition-colors">{lecturer.name}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{lecturer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface-variant">{lecturer.lecturerId}</td>
                <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface">{lecturer.department}</td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {lecturer.courses.map((c, i) => (
                      <span key={i} className={c.startsWith('+') ? "inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm" : "inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-fixed/50 text-on-secondary-container font-label-sm text-label-sm"}>{c}</span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm ${lecturer.status === 'Active' ? 'bg-surface-tint/10 text-surface-tint' : 'bg-error-container/50 text-on-error-container'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${lecturer.status === 'Active' ? 'bg-surface-tint' : 'bg-error'}`} /> {lecturer.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination / Footer */}
        <div className="px-6 py-4 border-t border-surface-container-highest flex items-center justify-between bg-surface-container-lowest">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 1-3 of 42 lecturers</span>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container-low transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-primary-container text-white font-label-md text-label-md flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md flex items-center justify-center transition-colors">2</button>
            <button className="w-8 h-8 rounded text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md flex items-center justify-center transition-colors">3</button>
            <span className="text-on-surface-variant font-label-md text-label-md">...</span>
            <button className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default LecturerManagement;
