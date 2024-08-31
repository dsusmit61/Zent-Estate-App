import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/${listing.userRef}`,
          {
            headers: {
              token: localStorage.getItem('access_token'),
            },
          }
        );
        console.log(res.data);
        setLandlord(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [listing.userRef]);
  return (
    <div className='flex gap-2 flex-col '>
      {landlord && (
        <Fragment>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.title.toLowerCase()}</span>
          </p>
          <textarea
            rows='2'
            className='w-full border rounded-lg p-3'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Enter your message here...'
          />

          <Link
            className='bg-slate-700 w-full text-white text-center p-3 rounded-lg uppercase hover:opacity-95'
            to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
          >
            Send message
          </Link>
        </Fragment>
      )}
    </div>
  );
};

export default Contact;
