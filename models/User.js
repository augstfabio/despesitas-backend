import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email:{type:String, required: true},
    password: { type: String, required: true },
})

export const Usuario = mongoose.model("User", UserSchema)
