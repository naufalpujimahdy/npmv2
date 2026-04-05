import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the user interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Create the user schema
const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Create the user model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

// CRUD operations
export const createUser = async (userData: IUser) => {
  const user = new User(userData);
  return await user.save();
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const getAllUsers = async () => {
  return await User.find();
};

export const updateUser = async (id: string, userData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};
