import React from 'react';
import PageTransition from '../animations/PageTransition';

const PageContainer = ({ children }) => {
  return (
    <PageTransition className="space-y-6">
      {children}
    </PageTransition>
  );
};

export default PageContainer;
