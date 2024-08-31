import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/user/userSlice';

import OAuth from '../components/OAuth';
const SignIn = () => {
  const initialState = {
    email: '',
    password: '',
  };
  const [formData, setFormData] = useState(initialState);
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signin`,
        formData
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(signInSuccess(res.data.user));
        localStorage.setItem('access_token', res.data.token);
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure());
      toast.error('Internal error occured');
    }
    setFormData(initialState);
  };
  return (
    <div className='max-w-lg mx-auto p-3 min-h-screen'>
      <h1 className='text-3xl text-center font-semibold  my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='email'
          className='rounded-lg border p-3'
          id='email'
          placeholder='Email'
          onChange={handleChange}
          value={formData.email}
          required={true}
        />
        <input
          type='password'
          className='rounded-lg border p-3'
          id='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          required={true}
        />
        <button className='rounded-lg uppercase bg-slate-700 text-white hover:opacity-95 disable:opacity-80 p-2'>
          {loading ? 'Loading...' : 'sign in'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-1 mt-3'>
        <p className='text-slate-800'>Don&apos;t have an account?</p>
        <Link to='/sign-up'>
          <p className='text-blue-600'>Sign up</p>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
