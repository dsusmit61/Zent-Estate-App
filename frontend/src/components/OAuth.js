import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase/firebase';
import axios from 'axios';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      dispatch(signInStart());
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`,
        {
          name: result.user.displayName,
          photo: result.user.photoURL,
          email: result.user.email,
        }
      );
      dispatch(signInSuccess(res.data.user));
      localStorage.setItem('access_token', res.data.token);
      navigate('/');
    } catch (error) {
      dispatch(signInFailure());
      console.log('could not connect with google' + error);
    }
  };
  return (
    <button
      className='bg-red-700 rounded-lg text-white p-3 uppercase hover:opacity-95'
      type='button'
      onClick={handleGoogleClick}
    >
      continue with google
    </button>
  );
}

export default OAuth;
