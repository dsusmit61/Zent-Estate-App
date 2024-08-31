import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4NYjL4Pf46if4pylfVLCii5tsg2xE4km7l4snMUJR7w&s',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
