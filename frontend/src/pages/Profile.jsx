import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  updateUserFailed,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { app } from '../firebase/firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [userListing, setUserListing] = useState({});
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
    // eslint-disable-next-line
  }, [file]);

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(uploadProgress));
      },
      (error) => {
        setError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, photo: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem('access_token'),
          },
        }
      );
      dispatch(updateUserSuccess(res.data.user));

      toast.success(res.data.message);
    } catch (error) {
      dispatch(updateUserFailed());
      toast.error('Internal error occured');
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/delete/${currentUser._id}`,
        {
          headers: {
            token: localStorage.getItem('access_token'),
          },
        }
      );
      dispatch(deleteUserSuccess());
      if (res.data.success) {
        localStorage.removeItem('access_token');
      }
      toast.success(res.data.message);
    } catch (error) {
      dispatch(deleteUserFailed());
      toast.error('Internal error occured');
    }
  };
  const handleSignOut = () => {
    dispatch(signOutUserSuccess());
    localStorage.removeItem('access_token');
    toast.success('User signed out successfully');
  };
  const showListings = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/listings/${currentUser._id}`,
        {
          headers: {
            token: localStorage.getItem('access_token'),
          },
        }
      );
      setUserListing(res.data.listings);
    } catch (error) {
      console.log(error);
      toast.error('Some error occured');
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/listing/delete/${id}`,
        {
          headers: {
            token: localStorage.getItem('access_token'),
          },
        }
      );
      if (res.data.success) {
        setUserListing((prev) => prev.filter((i) => i._id !== id));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error('Internal error occured');
      console.log(error);
    }
  };

  return (
    <div className=' max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-5'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          ref={fileRef}
        />
        <img
          className='rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer'
          src={formData.photo || currentUser.photo}
          alt='profile'
          onClick={() => fileRef.current.click()}
        />
        {error ? (
          <span className='text-center text-red-700'>Error Image upload</span>
        ) : progress > 0 && progress < 100 ? (
          <span className=' text-center text-slate-700'>{`Uploading ${progress}%`}</span>
        ) : progress === 100 ? (
          <span className='text-green-700 text-center'>
            Image successfully uploaded!
          </span>
        ) : (
          ''
        )}
        <input
          type='text'
          className='rounded-lg border p-3'
          id='username'
          placeholder='Username'
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <input
          type='email'
          className='rounded-lg border p-3'
          id='email'
          placeholder='Email'
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type='password'
          className='rounded-lg border p-3'
          id='password'
          placeholder='New Password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-2'
        >
          {loading ? 'loading' : 'update'}
        </button>
        <Link
          className='bg-green-700 p-2 text-center rounded-lg uppercase hover:opacity-95 text-white'
          to='/create-listing'
        >
          create listing
        </Link>
      </form>
      <div className=' mt-5 flex justify-between'>
        <span
          className='text-red-700 cursor-pointer'
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      <button onClick={showListings} className='w-full text-green-700 my-5'>
        Show listings
      </button>
      {userListing && userListing.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center font-semibold text-2xl mt-5'>
            Your listings
          </h1>
          {userListing.map((listing) => (
            <div
              className='flex p-3 rounded-lg items-center justify-between gap-4 border '
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className='h-16 w-16 object-contain rounded-md'
                  src={listing.imageUrls[0]}
                  alt='Listing'
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className='flex-1 truncate text-slate-700 font-semibold hover:underline'
              >
                <p>{listing.title}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button
                  className='uppercase text-red-700 hover:opacity-80'
                  onClick={() => handleDelete(listing._id)}
                >
                  delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='uppercase text-green-700 hover:opacity-80'>
                    edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
