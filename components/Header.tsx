// components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold">NCVS Crime Analysis</h1>
      <p className="text-lg mt-2">
        Analyze crime data from the National Crime Victimization Survey (NCVS) with filters and visualizations.
      </p>
      <p>A real-tool that automatically scrapes for updated crime data to provide you with real & vital information anytime, anyday.</p>
    </header>
  );
};

export default Header;