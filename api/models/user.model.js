import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,           //user must be unique
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
    profilePicture: {
        type: String,
        // default: "https://i.pinimg.com/originals/68/0e/24/680e241336ae8d3a57a42f54b656e58f.jpg",
        default: "https://images.squarespace-cdn.com/content/v1/639d44c16e2e3f2e80a9bb34/61dc9722-d244-4b75-a8b3-ab9d24866557/MPS+Team.jpg",
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;