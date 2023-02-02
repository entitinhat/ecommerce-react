import mongoose, { Mongoose } from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true }
}, {
    timestamps: true,
})


const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String },
    imageBack: { type: String }, // imageback
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    reviews: [reviewSchema]
}, {
    timestamps: true,
})

const Product = mongoose.model('Product', productSchema);

export default Product;


