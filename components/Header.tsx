// components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold">NCVS Crime Analysis</h1>
      <p className="text-lg mt-2">
        Analyze crime data from the National Crime Victimization Survey (NCVS) with filters and visualizations.
      </p>
      <p className="text-lg mt-2"> A real-time tool that automatically scrapes for anually updated crime data to provide you with real & vital information anytime, anyday. </p>
    <p className='text-lg mt-2'> Note that NCVS only interview victims of such crime, and this is not a random sruvey done on the US population.</p>
    </header>
  );
};

export default Header;