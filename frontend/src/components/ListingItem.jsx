import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { convert } from '../utils/convert';

const ListingItem = ({ list }) => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg rounded-lg transition-shadow overflow-hidden duration-300 w-full sm:w-[250px]'>
      <Link to={`/listing/${list._id}`}>
        <img
          className='h-[320px] sm:h-[220px] object-cover w-full  hover:scale-105 transition-scale duration-300'
          src={list.imageUrls[0]}
          alt='listing cover'
        />
        <div className='p-4 flex flex-col gap-2'>
          <p className='truncate text-lg font-semibold text-slate-700 capitalize'>
            {list.title}
          </p>
          <div className='flex gap-1 items-center'>
            <MdLocationOn className='text-green-800 w-4 h-4' />
            <p className='text-sm truncate text-gray-700 w-full'>
              {list.address}
            </p>
          </div>
          <p className='line-clamp-2 text-sm text-gray-600 w-full'>
            {list.description}
          </p>
          <p className='text-sm'>
            &#8377;{' '}
            {list.offer
              ? convert(list.discountPrice)
              : convert(list.regularPrice)}
            {list.type === 'rent' && '/month'}
          </p>
          <div className='flex gap-4'>
            <div className='flex items-center gap-1 text-sm font-bold text-slate-700'>
              <p>{list.bedrooms}</p>
              <span>{list.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
            </div>
            <div className='flex items-center gap-1 text-sm font-bold text-slate-700'>
              <p>{list.bathrooms}</p>
              <span>{list.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
