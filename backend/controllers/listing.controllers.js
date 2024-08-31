import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Your Listing has been created successfully',
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, 'Listing not found'));
  if (req.user.id !== listing.userRef.toString())
    return next(errorHandler(401, 'you can only delete your own listing'));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Deleted successfully', listing });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, 'Listing not found'));
  if (req.user.id !== listing.userRef.toString())
    return next(errorHandler(401, 'you can only delete your own listing'));
  try {
    const newListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Updated successfully',
      updatedListing: newListing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, 'Listing not found'));
    res.status(200).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit) || 6;
    let startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;
    let searchTerm = req.query.searchTerm || '';
    let sort = req.query.sort || 'createdAt';
    let order = req.query.order || 'desc';
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }
    const listing = await Listing.find({
      title: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
