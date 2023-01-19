import mongoose from "mongoose";
import { IAuth } from "../../types/Auth/authTypes"

const Schema = mongoose.Schema;

const authSchema = new Schema<IAuth>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },
},
  {
    timestamps: true,
  }
);

export default mongoose.model('Auth', authSchema);
