import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='flex justify-between text-sm items-center flex-wrap bg-slate-100 text-slate-700'>
      <p className='p-2 sm:p-5 '>
        Need help,{' '}
        <Link to='/about' className='text-blue-500 font-bold hover:underline '>
          Contact us
        </Link>
      </p>
      <p className='p-2 sm:p-5 '>Copyright &copy; 2024 All rights reserved</p>
    </footer>
  );
};

export default Footer;
