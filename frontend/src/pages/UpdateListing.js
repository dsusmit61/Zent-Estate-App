import { useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase/firebase';
import axios from 'axios';
// import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
const initialState = {
  title: '',
  description: '',
  address: '',
  type: 'rent',
  bedrooms: 1,
  bathrooms: 1,
  regularPrice: 0,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
  imageUrls: [],
};

const UpdateListing = () => {
  const params = useParams();
  const navigate = useNavigate();
  // const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [uploadingError, setUploadingError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/listing/get/${listingId}`);
        setFormData(res.data.listing);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
    // eslint-disable-next-line
  }, []);
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  };
  const handleImageSubmit = () => {
    setUploading(true);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, ...urls],
            // imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setUploadingError(null);
        })
        .catch((error) => {
          setUploadingError('You can upload (max 2mb per image)' + error);
          setUploading(false);
        });
    } else {
      setUploadingError('You can upload max 6 images');
      setUploading(false);
    }
  };
  const handleDelete = (i) => {
    const newList = formData.imageUrls.filter((_, index) => index !== i);
    setFormData({ ...formData, imageUrls: newList });
  };
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === 'parking' ||
      e.target.id === 'offer' ||
      e.target.id === 'furnished'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === 'number' ||
      e.target.type === 'textarea' ||
      e.target.type === 'text'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/listing/update/${formData._id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem('access_token'),
          },
        }
      );
      toast.success(res.data.message);
      navigate(`/listing/${formData._id}`);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('internal error');
    }
  };
  console.log(formData);

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-center font-semibold text-3xl my-5'>
        Update a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit}>
        <div className='flex gap-4 flex-col flex-1'>
          <input
            type='text'
            placeholder='Title'
            className='border p-3 rounded-lg'
            id='title'
            requried='true'
            value={formData.title}
            onChange={handleChange}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            requried='true'
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            requried='true'
            value={formData.address}
            onChange={handleChange}
          />
          <div className='flex flex-wrap gap-6'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                checked={formData.type === 'sale'}
                onChange={handleChange}
                className='w-5'
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                checked={formData.type === 'rent'}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                checked={formData.furnished}
                onChange={handleChange}
                className='w-5'
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                checked={formData.offer}
                onChange={handleChange}
                className='w-5'
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-6 flex-wrap'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                onChange={handleChange}
                value={formData.bedrooms}
                className='rounded-lg border border-grey-300 p-3'
                min='1'
                max='10'
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                className='rounded-lg border border-grey-300 p-3'
                min='1'
                max='10'
                id='bathrooms'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                id='regularPrice'
                onChange={handleChange}
                value={formData.regularPrice}
                type='number'
                className='rounded-lg border border-grey-300 p-3'
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(&#8377; / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className='rounded-lg border border-grey-300 p-3'
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>(&#8377; / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-sm text-grey-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-2'>
            <input
              className='border border-grey-600 p-3 w-full rounded-lg'
              type='file'
              id='images'
              accept='image/*'
              multiple={true}
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type='button'
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              onClick={handleImageSubmit}
            >
              {uploading ? 'uploading...' : 'upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{uploadingError}</p>
          {formData.imageUrls.map((url, index) => {
            return (
              <div
                className='flex justify-between p-3 border items-center'
                key={url}
              >
                <img
                  src={url}
                  className='w-20 h-20 object-contain rounded-lg'
                  alt='uploaded listing'
                />
                <button
                  className='text-red-700 uppercase rounded-lg hover:opacity-80'
                  type='button'
                  onClick={() => handleDelete(index)}
                >
                  delete
                </button>
              </div>
            );
          })}
          <button className='p-2 text-white bg-slate-700 uppercase rounded-lg hover:opacity-95'>
            {loading ? 'updating...' : 'Update listing'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
