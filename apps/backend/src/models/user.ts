import mongoose, { Schema, Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  first_name: string;
  last_name?: string | null;
  email: string;
  password: string;
  phoneNo?: string | null;
}

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
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
  phone_no: {
    type: String,
    required: false,
  },
});

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
