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
        default: "https://i.pinimg.com/originals/68/0e/24/680e241336ae8d3a57a42f54b656e58f.jpg",
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;