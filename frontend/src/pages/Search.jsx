import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
const initialState = {
  searchTerm: '',
  type: 'all',
  parking: false,
  furnished: false,
  offer: false,
  sort: 'createdAt',
  order: 'desc',
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideBarData, setSideBarData] = useState(initialState);
  const [listing, setListing] = useState(null);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const offerUrl = urlParams.get('offer');
    const furnishedUrl = urlParams.get('furnished');
    const parkingUrl = urlParams.get('parking');
    const typeUrl = urlParams.get('type');
    const sortUrl = urlParams.get('sort');
    const orderUrl = urlParams.get('order');
    const searchTermUrl = urlParams.get('searchTerm');
    if (
      offerUrl ||
      furnishedUrl ||
      typeUrl ||
      orderUrl ||
      sortUrl ||
      searchTermUrl ||
      parkingUrl
    ) {
      setSideBarData((prevState) => ({
        ...prevState,
        searchTerm: searchTermUrl || '',
        type: typeUrl || 'all',
        sort: sortUrl || 'createdAt',
        order: orderUrl || 'desc',
        parking: parkingUrl === 'true' ? true : false,
        offer: offerUrl === 'true' ? true : false,
        furnished: furnishedUrl === 'true' ? true : false,
      }));
    }
    const fetchListing = async () => {
      try {
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/listing/get?${searchQuery}`);
        if (res.data.length < 6) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
        setListing(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSideBarData({
        ...sideBarData,
        sort,
        order,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('type', sideBarData.type);
    urlParams.set('offer', sideBarData.offer);
    urlParams.set('furnished', sideBarData.furnished);
    urlParams.set('parking', sideBarData.parking);
    urlParams.set('searchTerm', sideBarData.searchTerm);
    urlParams.set('sort', sideBarData.sort);
    urlParams.set('order', sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = async () => {
    const startIndex = listing.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/listing/get?${searchQuery}`);
    if (res.data.length < 6) {
      setShowMore(false);
    }
    setListing([...listing, ...res.data]);
  };
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex whitespace-nowrap items-center gap-2'>
            <label htmlFor='searchTerm' className='font-semibold'>
              Search term:
            </label>
            <input
              type='text'
              id='searchTerm'
              className='border rounded-lg p-3 w-full'
              placeholder='Search...'
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5 '
                id='all'
                checked={sideBarData.type === 'all'}
                onChange={handleChange}
              />
              <span>Rent & sale</span>
            </div>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                checked={sideBarData.type === 'rent'}
                onChange={handleChange}
                className='w-5 '
                id='rent'
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5 '
                id='sale'
                checked={sideBarData.type === 'sale'}
                onChange={handleChange}
              />
              <span>sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5 '
                id='offer'
                checked={sideBarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5 '
                id='parking'
                checked={sideBarData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5'
                checked={sideBarData.furnished}
                onChange={handleChange}
                id='furnished'
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue='createdAt_desc'
              className='border rounded-lg w-full p-3'
              id='sort_order'
            >
              <option value='regularPrice_desc'>Price high to low </option>
              <option value='regularPrice_asc'>Price low to high </option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest </option>
            </select>
          </div>
          <button className='text-white bg-slate-700 p-3 rounded-lg'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1 py-7 px-3 '>
        <h1 className=' text-2xl font-semibold text-slate-700'>
          Listing results:
        </h1>
        <div className='flex gap-4 flex-wrap mt-4'>
          {listing &&
            listing.map((list) => <ListingItem list={list} key={list._id} />)}
        </div>
        {showMore && (
          <button
            onClick={handleShowMore}
            className=' w-full text-center text-green-700 mt-5 hover:underline '
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
