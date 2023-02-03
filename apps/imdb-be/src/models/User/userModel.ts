import mongoose from "mongoose";
import { IUser } from "../../types/User/userTypes";


const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>({
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
    required: true,
    minlength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Like",
    default: []
  }]
},
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
