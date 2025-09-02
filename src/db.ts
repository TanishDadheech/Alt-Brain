import mongoose,{ model, Schema } from "mongoose";

mongoose.connect("mongodb+srv://tdadheech07:tanish%4007102002@cluster0.2dndh.mongodb.net/Alt-Brain");

const UserSchema = new Schema({
    username: {type:String, unique:true},
    password: String
})

export const UserModel= model( "Users", UserSchema);