import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-8 text-center p-4 bg-cyan-50 text-black">
              <p>Please review NCVS for the numbering references <a className='text-blue-500 hover:underline' href='https://bjs.ojp.gov/programs/ncvs#:~:text=Description,persons%20in%20about%20150%2C000%20households.'>here</a>.</p>
            <p className="text-sm">Have a good research</p>
        </footer>
    );
};

export default Footer;