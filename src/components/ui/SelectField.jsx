import React from 'react';

const SelectField = ({ className, wrapperClassName, children, label, ...props }) => {
  return (
    <div className={`w-full ${wrapperClassName || ''}`}>
      {label && <label className="font-label-sm text-on-surface-variant block mb-1">{label}</label>}
      <div className="relative w-full">
        <select 
          className={`h-11 w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 pr-10 font-body-md text-body-md text-on-surface outline-none transition-all focus:border-secondary-container focus:ring-1 focus:ring-secondary-container ${className || ''}`}
          {...props}
        >
          {children}
        </select>
        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
          expand_more
        </span>
      </div>
    </div>
  );
};

export default SelectField;
