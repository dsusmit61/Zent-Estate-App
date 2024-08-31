import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
const SignUp = () => {
  const initialState = {
    username: '',
    email: '',
    password: '',
  };
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        formData
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/sign-in');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error('Internal error occured');
    }
    setFormData(initialState);
  };
  return (
    <div className='max-w-lg mx-auto p-3 min-h-screen'>
      <h1 className='text-3xl text-center font-semibold  my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='text'
          className='rounded-lg border p-3'
          id='username'
          placeholder='Username'
          onChange={handleChange}
          value={formData.username}
          required={true}
        />
        <input
          type='email'
          className='rounded-lg border p-3'
          id='email'
          required={true}
          placeholder='Email'
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type='password'
          className='rounded-lg border p-3'
          id='password'
          placeholder='Password'
          required={true}
          value={formData.password}
          onChange={handleChange}
        />
        <button className='rounded-lg uppercase bg-slate-700 text-white hover:opacity-95 disable:opacity-80 p-2'>
          {isLoading ? 'Loading...' : 'sign up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-1 mt-3'>
        <p className='text-slate-800'>Have an account?</p>
        <Link to='/sign-in'>
          <p className='text-blue-600'>Sign in</p>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
