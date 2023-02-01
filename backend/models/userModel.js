import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    profileImage: { type: String, default: 'https://res.cloudinary.com/dxucktn2g/image/upload/v1675094718/s5angmk6iy1fxu85uomi.png', required: true },
    // address: { type: String }
}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema);

export default User;