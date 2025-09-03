import mongoose,{ model, Schema } from "mongoose";

import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const UserSchema = new Schema({
    username: {type:String, unique:true},
    password: String
});

const ContentSchema = new Schema({
    
    link: String,
    type: String,
    title: String,
    tags: [{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId: {type:mongoose.Types.ObjectId, ref:'Users'},
});




export const UserModel= model( "Users", UserSchema);
export const ContentModel= model("Content", ContentSchema);