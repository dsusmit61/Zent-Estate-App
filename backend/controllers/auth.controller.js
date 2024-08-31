import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: 'User registerd successfully' });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const vaildUser = await User.findOne({ email });
    if (!vaildUser) return next(errorHandler(404, 'user not found'));

    const vaildPassword = await bcryptjs.compare(password, vaildUser.password);

    if (!vaildPassword) return next(errorHandler(401, 'Wrong credentials'));

    const token = jwt.sign({ id: vaildUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = vaildUser._doc;

    res.status(200).json({
      user: rest,
      success: true,
      message: 'User signed in successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = user._doc;

      res.status(200).json({
        user: rest,
        success: true,
        message: 'User signed in successfully',
        token,
      });
    } else {
      const createPassword = Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(createPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-3),
        password: hashPassword,
        email: req.body.email,
        photo: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = newUser._doc;

      res.status(200).json({
        user: rest,
        success: true,
        message: 'User registerd successfully',
        token,
      });
    }
  } catch (error) {
    next(error);
  }
};
