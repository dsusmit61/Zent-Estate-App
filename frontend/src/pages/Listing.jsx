import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaLink,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { convert } from '../utils/convert';

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/listing/get/${params.listingId}`
        );
        setListing(res.data.listing);
        // console.log(res.data.listing);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  const subtraction = +listing?.regularPrice - +listing?.discountPrice;
  return (
    <main>
      {loading && <p className='text-xl text-center my-7'>Loading...</p>}
      {listing && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className=''
                  style={{
                    height: '450px',
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-10 h-10 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaLink
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
        </div>
      )}
      {listing && (
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
          <p className='text-2xl font-semibold'>
            {listing.title} - &#8377;{' '}
            {listing.offer
              ? convert(listing.discountPrice)
              : convert(listing.regularPrice)}
            {listing.type === 'rent' && ' / month'}
          </p>
          <p className='flex items-center gap-2 mt-3 text-slate-600 text-sm'>
            <FaMapMarkerAlt className='text-green-700' />
            {listing.address}
          </p>
          <div className='flex gap-4'>
            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </p>
            {listing.offer && (
              <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                &#8377;
                {subtraction.toLocaleString()} discount
              </p>
            )}
          </div>
          <p className='text-slate-800'>
            <span className='font-semibold text-black'>Description - </span>
            {listing.description}
          </p>
          <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaBed className='text-lg' />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaBath className='text-lg' />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaParking className='text-lg' />
              {listing.parking ? 'Parking spot' : 'No Parking'}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap '>
              <FaChair className='text-lg' />
              {listing.furnished ? 'Furnished' : 'Unfurnished'}
            </li>
          </ul>
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button
              onClick={() => setContact(true)}
              className='p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95'
            >
              contact landlord
            </button>
          )}
          {contact && <Contact listing={listing} />}
        </div>
      )}
    </main>
  );
};

export default Listing;
