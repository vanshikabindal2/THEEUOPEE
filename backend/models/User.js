import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    trim:true,
    default:" ",
    },

    email: {
      type: String,
      lowercase:true,
      trim:true,
    },
phone: {
      type: String,
      required:true,
      unique:true,
      trim:true,
    },
   phoneVerified:{
    type:Boolean,
    default:false,
   },
   gender:{
    type:String,
    enum:['Male','Female','Other'," "],
    default:undefined,
   },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;