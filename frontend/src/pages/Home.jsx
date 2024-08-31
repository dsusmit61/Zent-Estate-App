import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const URL = process.env.REACT_APP_BACKEND_URL;
    const fetchOfferListing = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${URL}/api/listing/get?offer=true&limit=4`
        );
        setOfferListing(res.data);
        setLoading(false);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await axios.get(`${URL}/api/listing/get?type=sale&limit=4`);
        setSaleListing(res.data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await axios.get(`${URL}/api/listing/get?type=rent&limit=4`);
        setRentListing(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListing();
  }, []);

  return (
    <Fragment>
      <div className='max-w-6xl mx-auto  flex flex-col gap-6 py-28 px-7'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span> place
          with ease
        </h1>
        <p className='text-xs text-gray-500 sm:text-sm'>
          Zant estate is the best place to find your next perfect place to live
          .
          <br />
          We have wide range of properties for you to choose from.
          <br />
          Our experts are always available for you.
        </p>
        <Link
          className='text-xs text-blue-700 font-bold sm:text-sm hover:underline'
          to='/search'
        >
          Let's get started
        </Link>
      </div>
      {loading && (
        <h1 className='text-center text-slate-700 text-xl'>Loading...</h1>
      )}
      <div className='p-3'>
        {offerListing && offerListing.length > 0 && (
          <div>
            <Swiper navigation>
              {offerListing.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div
                    className=''
                    style={{
                      height: '500px',
                      background: `url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
      <div className='max-w-6xl mx-auto flex flex-col gap-6 py-28 px-7 '>
        {offerListing && offerListing.length > 0 && (
          <div className='flex flex-col gap-2 '>
            <div className='my-2'>
              <h2 className='text-slate-700 font-semibold'>Recent offers</h2>
              <Link
                className='text-sm text-blue-600 hover:underline'
                to='/search?offer=true'
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListing.map((list) => (
                <ListingItem key={list._id} list={list} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className='flex flex-col gap-2 '>
            <div className='my-2'>
              <h2 className='text-slate-700 font-semibold'>
                Recent places for sale
              </h2>
              <Link
                className='text-sm text-blue-600 hover:underline'
                to='/search?type=sale'
              >
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListing.map((list) => (
                <ListingItem key={list._id} list={list} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className='flex flex-col gap-2 '>
            <div className='my-2'>
              <h2 className='text-slate-700 font-semibold'>
                Recent places for rent
              </h2>
              <Link
                className='text-sm text-blue-600 hover:underline'
                to='/search?type=rent'
              >
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListing.map((list) => (
                <ListingItem key={list._id} list={list} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Home;
