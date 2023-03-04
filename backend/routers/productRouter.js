import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

// import mongoose from "mongoose";

// // add this inside your route
// if (!mongoose.Types.ObjectId.isValid(id)) return false;


const productRouter = express.Router();



productRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        const products = await Product.find({});
        res.send(products);
    }))

productRouter.get('/admin',
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const products = await Product.find({});
        const countProducts = await Product.countDocuments();
        res.send({
            products,
            countProducts,
        });
    }))

// Update Product

productRouter.put('/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id)
        if (product) {
            product.name = req.body.name;
            product.category = req.body.category;
            product.image = req.body.image;
            product.imageBack = req.body.imageBack;
            product.price = req.body.price;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            product.color = req.body.color;
            product.type = req.body.type;
        }
        await product.save();
        res.send({
            message: 'Product updated'
        })

    }))
productRouter.delete('/:id',
    // isAuth,
    // isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id)
        if (product) {
            await product.remove();
            res.send({ message: 'Product deleted' })
        }
        else res.status(404).send({ message: 'Product Not Found' });

    }))

// Review API

productRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            if (product.reviews.find((x) => x.name === req.user.name)) {

                return res
                    .status(400)
                    .send({ message: 'You already submitted a review' });
            }
            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                product.reviews.length;
            const updatedProduct = await product.save();
            res.status(201).send({
                message: 'Review Created',
                review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
                numReviews: updatedProduct.numReviews,
                rating: updatedProduct.rating,
            });
        } else {
            res.status(404).send({ message: 'Product Not Foundd' });
        }
    })
);

productRouter.post('/',
    // isAuth,
    // isAdmin,
    expressAsyncHandler(async (req, res) => {
        const newProduct = new Product({
            name: 'sample product' + Date.now(),
            category: 'shirt',
            image: '/images/model7.jpg',
            imageBack: '/images/model7.jpg',
            price: 50,
            brand: 'shirt',
            countInStock: 20,
            rating: 0,
            numReviews: 0,
            description: 'sample',
            color: 'white',
            type: 'top',

        });
        const product = await newProduct.save();
        res.send({
            message: 'product created', product
        })
    }))

productRouter.get('/seed',
    expressAsyncHandler(async (req, res) => {
        const createdProducts = await Product.insertMany(data.products);
        res.send({ createdProducts });
    }));




productRouter.get('/categories',
    expressAsyncHandler(async (req, res) => {
        const categories = await Product.find().distinct('category');
        res.send(categories);
    })
)

productRouter.get('/search',
    expressAsyncHandler(async (req, res) => {
        const { query } = req;

        const category = query.category || '';
        const type = query.type || '';
        // const type = 'top' ? (category === 'Shirts' || 'Jackets' || 'Coats') :
        //     'bottom' ? (category === 'Pants') :
        //         'backpacks'

        const price = query.price || '';
        const color = query.color || '';
        const order = query.order || '';
        const searchQuery = query.query || '';



        const searchQueryFilter = searchQuery && searchQuery !== 'all' ? {
            name: {
                $regex: searchQuery,
                $options: 'i',
            }
        } : {};
        const typeFilter = type && type !== 'all' ? { type } : {};
        const categoryFilter = category && category !== 'all' ? { category } : {};
        const priceFilter = price && price !== 'all' ? {
            price: {
                $lte: Number(price),
            }
        } : {};

        const colorFilter = color && color !== 'all' ? {
            color: {
                $regex: color,
                $options: 'i',
            }
        } : {};

        const sortOrder = (order === 'az') ? {
            name: 1,
        } : (order === 'za') ? {
            name: -1,
        } : (order === 'h2l') ? {
            price: -1,
        } : (order === 'l2h') ? {
            price: 1,
        } : {};



        const products = await Product.find({
            ...typeFilter,
            ...searchQueryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...colorFilter,

        })
            .sort(sortOrder);


        const countProducts = await Product.countDocuments({
            ...typeFilter,
            ...searchQueryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...colorFilter,

        })  // countProducts step 4
        res.send({
            products,
            countProducts,
        });  // count pro step 5
    }))

productRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        res.send(product);
    }))


//   Pants , Shirts




export default productRouter;



